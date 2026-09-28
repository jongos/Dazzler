// Original Dazzler interaction adapter, Apache-2.0.
import {createApp,h,ref,onMounted,onBeforeUnmount} from 'vue';
import ImageMapper from 'vue-img-mapper';
import {scaffold,watchMap} from './hotspot-ui.mjs';
export function mount(root,config){
  const ui=scaffold(root,config),selected=ref(null);ui.setHighlight(id=>selected.value=id);
  const mapper=ref(null);
  const app=createApp({setup(){const width=ref(Math.min(config.width,ui.visual.clientWidth||config.width));let observer;
    onMounted(()=>{observer=new ResizeObserver(()=>width.value=Math.min(config.width,ui.visual.clientWidth));observer.observe(ui.visual);});onBeforeUnmount(()=>observer?.disconnect());
    return()=>h(ImageMapper,{ref:mapper,src:config.artwork,map:{name:config.mapName,areas:config.regions.map(r=>({id:r.id,shape:r.shape,coords:r.coords,preFillColor:r.id===selected.value?config.color+'55':undefined}))},
      responsive:true,parentWidth:width.value,imgWidth:config.width,fillColor:config.color+'44',strokeColor:config.color,lineWidth:3,
      // The pinned 0.1.0 component creates its map in updated(), not mounted().
      onClick:r=>ui.activate(r.id),onLoad:img=>{mapper.value?.$forceUpdate();ui.status.textContent=img.naturalWidth===config.width&&img.naturalHeight===config.height?'Select a region or its named button.':'Image dimensions do not match the configuration. Re-export with the actual pixel dimensions.';root.dataset.imageDimensions=img.naturalWidth+'x'+img.naturalHeight;}});
  }});app.mount(ui.visual);const stop=watchMap(ui.visual,config,ui.activate);root.dataset.renderer='vue-img-mapper';
  return()=>{stop();app.unmount();root.replaceChildren();};
}
