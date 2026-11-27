'use strict';

let activeTrail=null;
function landmark(kind){
  const c=document.createElement('canvas');c.width=88;c.height=70;
  const g=c.getContext('2d');
  function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
  function poly(points,color){g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()}
  rect(5,66,78,4,'#685548');
  if(kind===0){
    rect(12,29,62,37,'#c68c60');rect(15,30,56,31,'#e9bc83');
    poly([[4,30],[22,9],[58,9],[81,30]],'#774759');poly([[10,25],[23,10],[58,10],[74,25]],'#a75450');
    rect(38,40,15,26,'#503d40');rect(40,36,11,8,'#503d40');
    for(const x of [19,59]){rect(x,39,8,11,'#586a70');rect(x+3,39,2,11,'#c58e64')}
    rect(34,64,23,3,'#f3d7a2');
  }else if(kind===1){
    poly([[38,67],[44,67],[50,24],[44,22]],'#765441');
    for(let j=0;j<7;j++)rect(40+j*.7,60-j*5,6,2,'#ad8256');
    for(const s of [-1,1]) for(let j=0;j<36;j++){
      const y=22-Math.sin(j/33*Math.PI)*12+j*.25;
      rect(46+j*s,y,4,4,'#376756');if(j%4===0)rect(46+j*s,y+2,3,7,'#58855a');
      rect(46+j*s*.68,y-6,3,4,'#82a068');
    }
    rect(44,25,4,6,'#c88240');rect(49,23,4,5,'#efb55d');
  }else{
    rect(16,48,56,18,'#89766c');rect(14,43,60,6,'#e4c49a');rect(21,42,46,3,'#455361');
    for(const x of [22,63])rect(x,20,4,23,'#775948');
    poly([[10,22],[27,10],[59,10],[77,22]],'#497d79');rect(44,22,1,20,'#a48767');
    for(let j=0;j<3;j++)for(let x=18+j%2*6;x<66;x+=13)rect(x,50+j*5,10,2,'#c3a992');
  }
  return c;
}
function explore(host,{theme,stops,name,skin,initial=64,enter,allowed=()=>true}){
  activeTrail?.destroy();
  const width=Math.max(1800,stops.length*380+240);
  const anchors=stops.map((s,i)=>Math.round((i+0.5)*width/Math.max(1,stops.length)));
  let x=initial,target=null,dir=0,height=0,velocity=0,jumps=0,last=performance.now(),frame;
  const controller=new AbortController(), events={signal:controller.signal};
  const viewport=document.createElement('div'),stage=document.createElement('div');
  viewport.className='trailView';viewport.tabIndex=0;viewport.setAttribute('aria-label','Peta eksplorasi '+name);
  stage.className='trailStage';stage.style.width=width+'px';viewport.append(stage);
  const sky=document.createElement('canvas');sky.width=480;sky.height=128;landscape(theme,sky);
  stage.style.backgroundImage='url('+sky.toDataURL()+')';
  const controls=document.createElement('div');controls.className='trailControls';
  const prompt=heading('p','');host.append(viewport,controls,prompt);
  const nodes=stops.map((s,i)=>{
    const b=btn('',()=>{target=anchors[i];viewport.focus({preventScroll:true})},'trailSite');
    b.style.left=anchors[i]+'px';b.setAttribute('aria-label',siteAt(theme,i)[0]+' · '+s);b.append(heading('span',(i+1)+' · '+siteAt(theme,i)[0]),drawSite(siteAt(theme,i)[1]));stage.append(b);return b;
  });
  const obstacles=anchors.map((anchor,i)=>{
    const from=i?anchors[i-1]:56;
    const center=(from+anchor)/2, size=42+(i%3)*8, top=36+(i%3)*10;
    const el=document.createElement('div');el.className='trailBarrier '+barriers[theme][1];
    el.style.left=(center-size/2)+'px';el.style.width=size+'px';el.style.height=top+'px';
    el.setAttribute('aria-label',barriers[theme][0]);stage.append(el);
    return {left:center-size/2-9,right:center+size/2+9,top};
  });
  function floorAt(px){return obstacles.find(o=>px>o.left&&px<o.right)?.top||0}
  height=floorAt(x);
  function actor(label,outfit,mine,gear){
    const el=document.createElement('div');el.className='trailActor'+(mine?' mine':'');
    el.append(heading('small',label),portrait(outfit,gear));stage.append(el);return el;
  }
  const self=actor(user.name,skin,true,user.gear||0), peers=new Map();
  function jump(){if(height===floorAt(x)&&!dialog.open){velocity=635;height+=.01;jumps++}}
  function nearby(){return anchors.findIndex((a,i)=>Math.abs(a-x)<=76&&allowed(i))}
  function interact(){const i=nearby();if(i>=0)enter(i)}
  function control(label,direction){
    const b=btn(label,()=>{});b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);target=null;dir=direction};
    b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>{dir=0};
    b.onclick=e=>{if(e.detail===0)target=x+direction*80};return b;
  }
  const use=btn('Ambil',interact,'gold');
  controls.append(control('← Kiri',-1),control('Kanan →',1),btn('↑ Lompat',jump),use);
  function clear(){dir=0;target=null}
  window.addEventListener('blur',clear,events);
  document.addEventListener('keydown',e=>{
    if(dialog.open||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,select,textarea,form'))return;
    if(e.code==='Space'&&e.target.closest('button,a'))return;
    if(['ArrowLeft','KeyA','ArrowRight','KeyD'].includes(e.code)){
      e.preventDefault();dir=['ArrowLeft','KeyA'].includes(e.code)?-1:1;target=null;
    }else if(['Space','ArrowUp','KeyW','KeyE'].includes(e.code)){
      e.preventDefault();if(!e.repeat){if(e.code==='KeyE')interact();else jump()}
    }
  },events);
  document.addEventListener('keyup',e=>{if(['ArrowLeft','KeyA','ArrowRight','KeyD'].includes(e.code))dir=0},events);
  viewport.onclick=e=>{
    if(e.target.closest('button'))return;
    target=e.clientX-viewport.getBoundingClientRect().left+viewport.scrollLeft;viewport.focus({preventScroll:true});
  };
  function tick(now){
    const dt=Math.min(.05,(now-last)/1000);last=now;
    if(dialog.open)clear();
    const dx=dir*320*dt||(target===null?0:Math.sign(target-x)*Math.min(Math.abs(target-x),320*dt));
    let nextX=Math.max(25,Math.min(width-25,x+dx)),blocked=false;
    for(const o of obstacles){
      if(height>=o.top)continue;
      if(dx>0&&x<=o.left&&nextX>o.left){nextX=o.left;blocked=true;break}
      if(dx<0&&x>=o.right&&nextX<o.right){nextX=o.right;blocked=true;break}
    }
    x=nextX;
    if(target!==null&&Math.abs(target-x)<1)target=null;
    const floor=floorAt(x);
    if(height>floor||velocity>0){velocity-=1550*dt;height=Math.max(floor,height+velocity*dt)}
    if(height===floor)velocity=0;
    self.style.left=x+'px';self.style.transform='translate(-50%,'+(-height)+'px)';
    self.classList.toggle('walking',!!dx&&!blocked&&height===floor);
    viewport.scrollLeft=x-viewport.clientWidth*.45;
    const i=nearby();use.disabled=i<0;
    const hint=blocked?'Lompat untuk melewati '+barriers[theme][0]+'.':i<0?(stops.length?'Dekati lokasi quest.':'Wilayah ini belum memiliki quest.'):siteAt(theme,i)[0]+' · '+stops[i];
    if(prompt.textContent!==hint)prompt.textContent=hint;
    frame=requestAnimationFrame(tick);
  }
  frame=requestAnimationFrame(tick);
  const api={
    pose:()=>({x:Math.round(x),jump:jumps,skin,gear:user.gear||0}),
    goto:i=>{target=anchors[i];viewport.focus({preventScroll:true})},
    mark:i=>nodes.forEach((b,j)=>b.classList.toggle('goal',i===j)),
    sync(members){
      const present=new Set();
      members.filter(m=>!m.me&&!m.left).forEach((m,j)=>{
        present.add(m.avatar);let peer=peers.get(m.avatar);
        if(!peer||peer.skin!==m.skin||peer.gear!==m.gear){peer?.el.remove();peer={el:actor(m.name,m.skin||0,false,m.gear||0),jump:m.jump,skin:m.skin,gear:m.gear};peers.set(m.avatar,peer)}
        peer.el.style.bottom='calc(15% + '+(4+j*8+floorAt(m.x))+'px)';
        peer.el.style.left=m.x+'px';
        if(peer.jump!==m.jump){peer.el.animate([{translate:'0 0'},{translate:'0 -105px'},{translate:'0 0'}],550);peer.jump=m.jump}
      });
      for(const [id,p] of peers)if(!present.has(id)){p.el.remove();peers.delete(id)}
    },
    destroy(){controller.abort();cancelAnimationFrame(frame);if(activeTrail===api)activeTrail=null}
  };
  activeTrail=api;return api;
}

function venueBanner(theme,index){
  const [name,symbol]=siteAt(theme,index);
  const banner=document.createElement('div');banner.className='venueBanner';
  const canvas=document.createElement('canvas');canvas.width=320;canvas.height=76;
  const g=canvas.getContext('2d');
  function r(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
  if(symbol==="house"){
    r(0,0,320,76,'#bd916f');r(0,0,320,5,'#62444a');r(0,55,320,21,'#886550');
    for(let x=5;x<320;x+=52)r(x,0,5,54,'#966954');
    for(const x of [25,224]){
      r(x,12,62,35,'#635049');
      for(let j=0;j<12;j++){let h=8+(j*7)%8;r(x+3+j*4,30-h,3,h,['#959b79','#b56c5f','#c39c69'][j%3])}
      r(x,30,62,3,'#deb689');r(x,46,62,3,'#deb689');
    }
    r(132,8,38,30,'#f4ce92');r(136,12,30,21,'#8bb2ad');r(149,12,3,22,'#826657');
    r(109,58,89,5,'#603f3b');r(115,63,5,9,'#69493f');r(188,63,5,9,'#69493f');
    r(141,54,23,4,'#f6deaa');r(151,54,2,4,'#b08860');
  }else{
    const bg=document.createElement("canvas");bg.width=480;bg.height=128;landscape(theme,bg);g.drawImage(bg,0,0,320,76);
    g.drawImage(drawSite(symbol),120,3,87,70);
  }
  canvas.setAttribute('aria-hidden','true');banner.append(canvas,heading('span',name));return banner;
}
