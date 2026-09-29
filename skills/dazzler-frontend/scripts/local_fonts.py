"""Bounded, project-local SFNT inspection. No downloads, OS install or license inference."""

import hashlib
import json
from pathlib import Path
import re
import shutil
import struct
import zlib


def metadata(path):
    with path.open("rb") as stream:
        data = stream.read(16_000_001)
    if len(data) > 16_000_000:
        raise ValueError("Font exceeds 16 MB")

    def u16(blob, offset):
        return struct.unpack_from(">H", blob, offset)[0]

    def u32(blob, offset):
        return struct.unpack_from(">I", blob, offset)[0]

    try:
        woff = data[:4] == b"wOFF"
        if data[:4] not in (b"\x00\x01\x00\x00", b"OTTO", b"wOFF"):
            raise ValueError(
                "Use TTF, OTF or WOFF. WOFF2/TTC need an independently verified conversion before import"
            )
        count = u16(data, 12 if woff else 4)
        if not 1 <= count <= 128:
            raise ValueError("Invalid font table count")
        tables = {}
        for i in range(count):
            offset = (44 if woff else 12) + i * (20 if woff else 16)
            tag = data[offset : offset + 4]
            start = u32(data, offset + (4 if woff else 8))
            size = u32(data, offset + (8 if woff else 12))
            if size > 16_000_000 or start + size > len(data) or tag in tables:
                raise ValueError("Invalid font table bounds")
            blob = data[start : start + size]
            if woff:
                original = u32(data, offset + 12)
                if original > 16_000_000 or size > original:
                    raise ValueError("Invalid WOFF size")
                if size < original:
                    decoder = zlib.decompressobj()
                    blob = decoder.decompress(blob, original + 1)
                    if len(blob) != original or not decoder.eof:
                        raise ValueError("Invalid WOFF compression")
            tables[tag] = blob
        names = tables[b"name"]
        family = None
        for i in range(min(u16(names, 2), 1024)):
            platform, _, _, name_id, length, start = struct.unpack_from(
                ">6H", names, 6 + i * 12
            )
            if name_id in (1, 16) and platform in (0, 3):
                start += u16(names, 4)
                if start + length > len(names):
                    raise ValueError("Invalid name bounds")
                value = names[start : start + length].decode("utf-16-be")
                if value and len(value) <= 160 and not any(ord(c) < 32 for c in value):
                    family = value
                    if name_id == 16:
                        break
        if not family:
            raise ValueError("No usable Unicode family name")
        cmap = tables[b"cmap"]
        codes = set()
        work = 0
        for i in range(min(u16(cmap, 2), 128)):
            platform, encoding, start = struct.unpack_from(">HHI", cmap, 4 + 8 * i)
            if platform != 0 and not (platform == 3 and encoding in (1, 10)):
                continue
            fmt = u16(cmap, start)
            if fmt == 12:
                groups = u32(cmap, start + 12)
                if groups > 100000:
                    raise ValueError("Excessive cmap groups")
                for j in range(groups):
                    low, high, glyph = struct.unpack_from(
                        ">III", cmap, start + 16 + 12 * j
                    )
                    if high > 0x10FFFF or low > high:
                        raise ValueError("Invalid Unicode range")
                    work += high - low + 1
                    if work > 2_000_000:
                        raise ValueError("Excessive cmap work")
                    codes.update(range(low + (glyph == 0), high + 1))
            elif fmt == 4:
                segments = u16(cmap, start + 6) // 2
                if segments > 8192:
                    raise ValueError("Excessive cmap segments")
                for j in range(segments):
                    high = u16(cmap, start + 14 + 2 * j)
                    low = u16(cmap, start + 16 + 2 * segments + 2 * j)
                    delta = u16(cmap, start + 16 + 4 * segments + 2 * j)
                    address = start + 16 + 6 * segments + 2 * j
                    distance = u16(cmap, address)
                    work += max(0, min(high, 65534) - low + 1)
                    if work > 2_000_000:
                        raise ValueError("Excessive cmap work")
                    for cp in range(low, min(high, 65534) + 1):
                        glyph = (
                            u16(cmap, address + distance + 2 * (cp - low))
                            if distance
                            else cp
                        )
                        if (
                            (glyph and (glyph + delta) % 65536)
                            if distance
                            else (glyph + delta) % 65536
                        ):
                            codes.add(cp)
        if not codes:
            raise ValueError("No supported Unicode cmap")
        ranges = []
        for cp in sorted(codes):
            if ranges and ranges[-1][1] + 1 == cp:
                ranges[-1][1] = cp
            else:
                ranges.append([cp, cp])
        os2 = tables.get(b"OS/2", b"")
        weight = u16(os2, 4) if len(os2) >= 6 else 400
        italic = bool(u16(os2, 62) & 1) if len(os2) >= 64 else False
        return {
            "filename": path.name,
            "format": path.suffix[1:].lower(),
            "css_family": family,
            "css_weight": str(weight),
            "css_style": "italic" if italic else "normal",
            "css_stretch": "normal",
            "unicode_ranges": ranges,
            "features": [],
            "tabular_default_digits": False,
            "fixed_pitch": (
                bool(u32(tables[b"post"], 12)) if b"post" in tables else False
            ),
            "bytes": len(data),
            "sha256": hashlib.sha256(data).hexdigest(),
            "limitations": "Default face only; variation axes, OpenType features and shaping need separate inspection.",
        }
    except (struct.error, KeyError, UnicodeError, zlib.error) as error:
        raise ValueError("Malformed or unsupported font metadata") from error


def import_local(source, destination, license_type, license_file=None):
    source = Path(source).resolve()
    destination = Path(destination).resolve()
    skill = Path(__file__).resolve().parents[1]
    if destination == skill or destination.is_relative_to(skill):
        raise ValueError("Import into the project, never the installed skill")
    if destination.exists():
        raise ValueError(
            "Use a new project font directory; existing data is not overwritten"
        )
    if (
        not license_type
        or len(license_type) > 160
        or any(ord(c) < 32 for c in license_type)
    ):
        raise ValueError("Supply a bounded license declaration")
    files = sorted(
        p
        for p in source.iterdir()
        if p.suffix.lower() in (".ttf", ".otf", ".woff", ".woff2", ".ttc")
    )
    if not 1 <= len(files) <= 64 or any(
        p.is_symlink() or not p.is_file() for p in files
    ):
        raise ValueError(
            "Supply 1â€“64 ordinary font files; symbolic links are refused"
        )
    faces = [metadata(p) for p in files]
    if sum(f["bytes"] for f in faces) > 64_000_000:
        raise ValueError("Font import exceeds 64 MB")
    notice = None
    if license_file:
        with Path(license_file).open("rb") as stream:
            notice = stream.read(1_000_001)
        if len(notice) > 1_000_000:
            raise ValueError("License exceeds 1 MB")
    destination.mkdir(parents=True)
    try:
        for path in files:
            shutil.copyfile(path, destination / path.name)
        if notice is not None:
            (destination / "USER-LICENSE.txt").write_bytes(notice)
        from fonts import css_for

        (destination / "fonts.css").write_text(
            css_for(faces).replace(
                "Unmodified bundled fonts; keep accompanying licenses and SOURCE.md.",
                "User-provided fonts. License declaration is not a legal verification. Do not redistribute.",
            ),
            encoding="utf-8",
        )
        (destination / ".gitignore").write_text("*\n", encoding="utf-8")
        manifest = {
            "schemaVersion": 1,
            "private": True,
            "license": license_type,
            "licenseVerified": False,
            "redistributable": False,
            "files": faces,
            "limitations": "User declaration only. Verify permitted project use and embedding before delivery. No OS install.",
        }
        (destination / "user-fonts.json").write_text(
            json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
        )
        return {
            "imported": len(faces),
            "directory": str(destination),
            "licenseVerified": False,
        }
    except Exception:
        shutil.rmtree(destination)
        raise


def project_catalog(manifest_path):
    manifest_path = Path(manifest_path).resolve()
    with manifest_path.open("rb") as stream:
        raw = stream.read(1_000_001)
    if len(raw) > 1_000_000:
        raise ValueError("Font manifest exceeds 1 MB")
    manifest = json.loads(raw)
    faces = manifest.get("files", [])
    if not isinstance(faces, list) or not 1 <= len(faces) <= 64:
        raise ValueError("Invalid project font inventory")
    result = []
    total = 0
    for entry in faces:
        name = entry.get("filename", "")
        if (
            not name
            or Path(name).name != name
            or "/" in name
            or "\\" in name
            or ":" in name
        ):
            raise ValueError("Unsafe project font filename")
        path = manifest_path.parent / name
        if path.is_symlink() or not path.resolve().is_relative_to(manifest_path.parent):
            raise ValueError("Font path leaves project directory")
        face = metadata(path)
        total += face["bytes"]
        if total > 64_000_000 or face["sha256"] != entry.get("sha256"):
            raise ValueError("Changed or oversized project font inventory")
        result.append(
            {
                "id": "local-" + face["sha256"][:12],
                "name": face["css_family"],
                "status": "project-local",
                "files": [face],
                "roles": ["body", "heading", "ui", "display", "code"],
                "moods": [],
                "reference": str(manifest_path),
                "description": "User-supplied face; fit requires visual judgment",
                "cautions": [
                    face["limitations"],
                    "License is user-declared, not verified. Never redistribute in skill packages.",
                ],
                "license": manifest.get("license", "User-declared"),
            }
        )
    return result
