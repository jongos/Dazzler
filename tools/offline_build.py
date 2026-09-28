"""Create or restore the reviewed local build kit; never downloads or runs install scripts."""
import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import platform
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]
def sha(data): return hashlib.sha256(data).hexdigest()
def create(output):
    output=Path(output);output.mkdir(parents=True,exist_ok=False)
    paths=[]
    for directory in ('tools','tests','skills','node_modules','platforms','.codex-plugin','docs'):
        paths.extend(p for p in (ROOT/directory).rglob('*') if p.is_file() and not p.is_symlink()
                     and not any(part in ('__pycache__','.bin') for part in p.parts))
    paths.extend(ROOT/name for name in ('.npmrc','README.md','CHANGELOG.md','.gitattributes','package.json','package-lock.json','LICENSE','THIRD_PARTY_NOTICES.md'))
    inventory={}
    with zipfile.ZipFile(output/'offline-build.zip','w',compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(paths):
            data=path.read_bytes();name=path.relative_to(ROOT).as_posix()
            info=zipfile.ZipInfo(name,(2026,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16
            archive.writestr(info,data);inventory[name]=sha(data)
    manifest={'schemaVersion':1,'platform':platform.system(),'architecture':platform.machine(),
              'archiveSha256':sha((output/'offline-build.zip').read_bytes()),'files':inventory,
              'notes':'Complete local build inputs, original licenses and pinned package source. Node/Python are host prerequisites. The esbuild executable is platform-specific. No install scripts or network needed on the recorded platform.'}
    (output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    print(f'Archived {len(inventory)} files, {(output/"offline-build.zip").stat().st_size} bytes')

def restore(source,target):
    source=Path(source);target=Path(target).resolve()
    manifest=json.loads((source/'manifest.json').read_text(encoding='utf-8'))
    archive=source/'offline-build.zip'
    if archive.stat().st_size>150_000_000 or sha(archive.read_bytes())!=manifest['archiveSha256']:raise ValueError('Build archive integrity failure')
    if target.exists():raise ValueError('Use a new destination')
    # Validate every entry before creating a destination; never trust ZIP extraction paths.
    with zipfile.ZipFile(archive) as z:
        entries=z.infolist()
        if len(entries)>15000 or sum(i.file_size for i in entries)>300_000_000:raise ValueError('Archive exceeds limits')
        names=[i.filename for i in entries]
        if len(set(names))!=len(names) or set(names)!=set(manifest['files']):raise ValueError('Archive inventory mismatch')
        for info in entries:
            name=PurePosixPath(info.filename)
            if name.is_absolute() or '..' in name.parts or '\\' in info.filename or ':' in info.filename or (info.external_attr>>16)&0o170000==0o120000:raise ValueError('Unsafe archive entry')
            if sha(z.read(info))!=manifest['files'][info.filename]:raise ValueError('Modified archive entry')
        target.mkdir(parents=True)
        for info in entries:
            path=target/info.filename;path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(z.read(info))
    print(json.dumps({'restored':str(target),'platform':manifest['platform'],'architecture':manifest['architecture'],'network':'not used','installationScripts':'not run'}))

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='action',required=True)
    p=sub.add_parser('create');p.add_argument('--out',required=True)
    p=sub.add_parser('restore');p.add_argument('--from',dest='source',required=True);p.add_argument('--out',required=True)
    args=parser.parse_args()
    if args.action=='create':create(args.out)
    else:restore(args.source,args.out)
