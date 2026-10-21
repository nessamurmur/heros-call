// Enhance native controls without owning, copying or recalculating Nimble's rules.
export function createControls(state, changed) {
  const controller=new AbortController(), original=new Map(), previews=new Map();
  let forwarding=null, modifier=null;
  const remember=(node,name,value)=>{
    if(!original.has(node))original.set(node,new Map());
    const attrs=original.get(node);if(!attrs.has(name))attrs.set(name,node.getAttribute(name));
    if(node.getAttribute(name)!==String(value))node.setAttribute(name,String(value));
  };
  const active=()=>state.chapter===state.nativeStage;
  const stage=()=>state.body.querySelector(`section[id$="-stage-${state.chapter}"]`);
  const options=()=>[...(stage()?.querySelectorAll(state.chapter===3?'.starting-equipment-option':'.stat-array')||[])];
  const choiceFor=target=>[3,4].includes(state.chapter)&&active()?target.closest(state.chapter===3?'.starting-equipment-option':'.stat-array'):null;
  function setModifier(node){
    modifier=node;
    state.body.querySelectorAll('.heros-call-modifier-selected').forEach(e=>e.classList.remove('heros-call-modifier-selected'));
    if(node)node.classList.add('heros-call-modifier-selected');
    sync();changed();
  }
  function assign(target){
    if(!modifier?.isConnected)return;
    const source=modifier, transfer=new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart',{bubbles:true,dataTransfer:transfer}));
    // The native drag handler supplies its own value/index. Never guess it here.
    if(!transfer.types.length)return;
    target.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer}));
    source.dispatchEvent(new DragEvent('dragend',{bubbles:true,dataTransfer:transfer}));
    setModifier(null);
    requestAnimationFrame(()=>{if(target.isConnected)target.focus({preventScroll:true});});
  }
  function inspect(event){
    if(state.chapter!==5||!active())return false;
    const token=event.target.closest('.nimble-array-value-list__option[draggable="true"],.nimble-cc-ability-score__value[draggable="true"]');
    const target=event.target.closest('.nimble-cc-ability-score');
    if(token){event.preventDefault();setModifier(token);return true;}
    if(target&&modifier){event.preventDefault();assign(target);return true;}
    return false;
  }
  state.body.addEventListener('click',event=>{
    const choice=choiceFor(event.target);
    if(choice&&choice!==forwarding&&!choice.disabled){
      event.preventDefault();event.stopImmediatePropagation();previews.set(state.chapter,choice);sync();changed();return;
    }
    inspect(event);
  },{capture:true,signal:controller.signal});
  state.body.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&modifier){event.preventDefault();event.stopPropagation();setModifier(null);return;}
    if(event.key==='Enter'||event.key===' '){
      // Buttons have their own keyboard activation. Only add it to the native li/div targets.
      if(!event.target.closest('button')&&inspect(event))event.stopPropagation();
    }
  },{signal:controller.signal});
  function sync(){
    if(modifier&&!modifier.isConnected)modifier=null;
    if([3,4].includes(state.chapter)&&active()){
      for(const option of options()){
        const picked=previews.get(state.chapter)===option;
        option.classList.toggle('heros-call-option-selected',picked);remember(option,'aria-pressed',picked);
      }
    }
    if(state.chapter===5&&active()){
      stage()?.querySelectorAll('.nimble-array-value-list__option[draggable="true"],.nimble-cc-ability-score__value[draggable="true"]').forEach(token=>{
        remember(token,'role','button');remember(token,'tabindex','0');remember(token,'aria-label',`Select modifier ${token.textContent.trim()}`);remember(token,'aria-pressed',token===modifier);
      });
      stage()?.querySelectorAll('.nimble-cc-ability-score').forEach(target=>{
        const name=target.querySelector('h4')?.textContent.trim();
        remember(target,'role','button');remember(target,'tabindex','0');remember(target,'aria-label',`Assign selected modifier to ${name}`);
      });
    }
    if(state.chapter===6&&active())stage()?.querySelectorAll('.nimble-skill').forEach(skill=>{
      const name=skill.querySelector('.nimble-skill__name')?.textContent.trim();
      skill.querySelectorAll('.nimble-skill-point-star').forEach((button,i)=>{
        remember(button,'aria-label',`${name}: ${i+1} training ${i?'points':'point'}`);
        remember(button,'aria-pressed',!button.querySelector('.nimble-skill-point-star__icon--inactive'));
      });
    });
  }
  return {sync,
    get preview(){const node=previews.get(state.chapter);return node?.isConnected&&stage()?.contains(node)?node:null;},
    get modifier(){return modifier;},
    commit(source){forwarding=source;try{source.click();}finally{forwarding=null;}},
    destroy(){controller.abort();state.body.querySelectorAll('.heros-call-option-selected,.heros-call-modifier-selected').forEach(n=>n.classList.remove('heros-call-option-selected','heros-call-modifier-selected'));for(const [node,attrs]of original)for(const[name,value]of attrs)value===null?node.removeAttribute(name):node.setAttribute(name,value);}
  };
}
