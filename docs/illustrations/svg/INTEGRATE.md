# Interactive illustration

Import the accompanying CSS, load hotspots.json as a module or data object, then call the adapter with an empty DOM container. Use the returned cleanup function when the host component unmounts. In React/Vue, mount only after the container exists. The adapter manages its own subtree.

```js
import {mount} from './adapter.mjs';
const dispose = mount(container, config);
// On host unmount: dispose();
```

Keep hotspot coordinates in original image pixels. Keep SVG region IDs matched to the descriptions. Re-export after changing artwork. This adapter accepts only validated exported configuration; rerun the CLI for new SVG input. Use the existing host runtime and merge dependencies.json rather than replacing package.json. Review keyboard, touch, labels and resizing in the final page. Fonts are referenced, not installed or embedded.

## Notes and credits

Interactive SVG: SVG.js, MIT. Original Dazzler adapter: Apache-2.0. Preserve LICENSE.txt, licenses/ and renderer-provenance.json when sharing.
