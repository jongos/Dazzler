// Original Dazzler interaction adapter, Apache-2.0.
import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import ImageMapper from "react-img-mapper";
import { scaffold, watchMap } from "./hotspot-ui.mjs";
const h = React.createElement;
export function mount(root, config) {
  const ui = scaffold(root, config);
  let select = () => {};
  ui.setHighlight((id) => select(id));
  function MapView() {
    const [width, setWidth] = useState(
      Math.min(config.width, ui.visual.clientWidth || config.width),
    );
    const [selected, setSelected] = useState(null);
    const ref = useRef(null);
    select = setSelected;
    useEffect(() => {
      const observer = new ResizeObserver(() =>
        setWidth(Math.min(config.width, ui.visual.clientWidth)),
      );
      observer.observe(ui.visual);
      return () => observer.disconnect();
    }, []);
    const areas = config.regions.map((r) => ({
      id: r.id,
      shape: r.shape,
      coords: r.coords,
      preFillColor: r.id === selected ? config.color + "55" : undefined,
    }));
    return h(ImageMapper, {
      ref,
      src: config.artwork,
      name: config.mapName,
      areas,
      width,
      imgWidth: config.width,
      responsive: true,
      parentWidth: width,
      fillColor: config.color + "44",
      strokeColor: config.color,
      lineWidth: 3,
      imgProps: { alt: config.imageAlt },
      areaProps: config.regions.map((r) => ({
        alt: r.label,
        "aria-label": r.label,
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            ui.activate(r.id);
          }
        },
      })),
      onClick: (r) => ui.activate(r.id),
      onLoad: (img) => {
        ui.status.textContent =
          img.naturalWidth === config.width && img.naturalHeight === config.height
            ? "Select a region or its named button."
            : "Image dimensions do not match the configuration. Re-export with the actual pixel dimensions.";
        root.dataset.imageDimensions = img.naturalWidth + "x" + img.naturalHeight;
      },
    });
  }
  const reactRoot = createRoot(ui.visual);
  reactRoot.render(h(MapView));
  const stop = watchMap(ui.visual, config, ui.activate);
  root.dataset.renderer = "react-img-mapper";
  return () => {
    stop();
    reactRoot.unmount();
    root.replaceChildren();
  };
}
