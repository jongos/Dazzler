// Dazzler responsive image regions. Apache-2.0. Browser APIs only.
import {scaffold} from './hotspot-ui.mjs';
export function mount(root,config){
 const ui=scaffold(root,config),ns='http://www.w3.org/2000/svg';
 const make=(tag,attrs)=>{const node=document.createElementNS(ns,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,String(value));return node;};
 const svg=make('svg',{viewBox:`0 0 ${config.width} ${config.height}`,width:'100%',role:'group','aria-label':config.imageAlt});
 const art=make('image',{href:config.artwork,width:config.width,height:config.height,'aria-hidden':true});svg.append(art);
 const regions=new Map();
 for(const r of config.regions){const c=r.coords;const shape=r.shape==='rect'?make('rect',{x:c[0],y:c[1],width:c[2]-c[0],height:c[3]-c[1]}):r.shape==='circle'?make('circle',{cx:c[0],cy:c[1],r:c[2]}):make('polygon',{points:c.reduce((a,n,i)=>a+(i%2?',':' ')+n,'').trim()});
  for(const [key,value] of Object.entries({fill:'transparent',stroke:'none','stroke-width':3,'vector-effect':'non-scaling-stroke',role:'button',tabindex:0,'aria-label':r.label,'aria-pressed':false,'data-native-region':r.id}))shape.setAttribute(key,String(value));
  shape.style.cursor='pointer';shape.addEventListener('click',()=>ui.activate(r.id));shape.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();ui.activate(r.id);}});regions.set(r.id,shape);svg.append(shape);
 }
 ui.setHighlight(id=>{for(const [key,shape] of regions){shape.setAttribute('fill',key===id?config.color+'44':'transparent');shape.setAttribute('stroke',key===id?config.color:'none');shape.setAttribute('aria-pressed',String(key===id));}});
 ui.visual.append(svg);ui.status.textContent='Select a region or its named button.';root.dataset.renderer='native-image';
 const probe=new Image();probe.onload=()=>{if(probe.naturalWidth!==config.width||probe.naturalHeight!==config.height)ui.status.textContent='Artwork dimensions differ. Re-export with orientation-normalized image dimensions.';};probe.onerror=()=>{ui.status.textContent='Artwork could not be decoded. Region descriptions remain available below.';};probe.src=config.artwork;
 return()=>{probe.onload=probe.onerror=null;root.replaceChildren();};
}
