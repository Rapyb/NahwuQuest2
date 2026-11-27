'use strict';
const $=id=>document.getElementById(id), panel=$('panel'), dialog=$('box'), main=$('main');
const menu={studio:'Studio Guru',home:'Home',karakter:'Karakter',skin:'Perlengkapan',global:'Peringkat Global',map:'Map',arena:'Lobi Multiplayer',quest:'Quest & Achievement'};
let user=null,pos=64;
function message(s,bad=false){const el=$('notice');if(el){el.textContent=s;el.className=bad?'warn notice':'success notice'}}
function btn(label,action,cls=''){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=cls;b.onclick=action;return b}
function heading(tag,s){const h=document.createElement(tag);h.textContent=s;return h}
function portrait(i,gear=user?.gear||0,character=user?.character||0,accessory=user?.accessory||0){const c=document.createElement('canvas');c.width=72;c.height=56;drawEquipment(c,i,gear,character,accessory);return c}
function show(title){panel.replaceChildren();let h=heading('h2',title);h.id='dialogTitle';panel.append(h);if(!dialog.open)dialog.showModal();dialog.scrollTop=0}
function view(){const route=location.hash.slice(1);return user&&(route!=='studio'||isTeacher)&&Object.hasOwn(menu,route)?route:'home'}
function go(key){if(location.hash==='#'+key)render();else location.hash=key}
function render(){const previousX=activeTrail?.pose().x; if(view()==='map' && activeTrail?.world===user?.world && previousX!=null)pos=previousX; activeTrail?.destroy();stopArena();const current=view();$('nav').replaceChildren();for(const [key,label] of Object.entries(menu)){if(key==='studio'&&!isTeacher)continue;let b=btn(label,()=>go(key),key===current?'active':'');b.disabled=!user&&key!=='home';if(key===current)b.setAttribute('aria-current','page');$('nav').append(b)}
 $('playerInfo').textContent=user?user.name+' · ✦ '+(user.done.length*50+(user.arenaXP||0))+' XP':'Profil pemain';main.replaceChildren();({global:globalBoard,studio,home,karakter,skin:equipmentView,map:mapView,quest:journal,arena:arenaView})[current]();let el=document.createElement('p');el.id='notice';el.setAttribute('role','status');main.append(el)}
function home(){main.innerHTML='<section class="homeHero"><div><span class="label">ATLAS NAHWU</span><h1>Desa Alif</h1><p>Jelajahi wilayah Atlas, pecahkan misi bahasa Arab, dan buka pakaian baru untuk karaktermu.</p><b class="tagline">ATLAS BAHASA ARAB</b></div></section><div class="twocol"><section class="box" id="login"></section><section class="box" id="continue"></section></div>';
 const area=$('login'),side=$('continue');if(!user){authHome(area,side);return}
 document.querySelector('.tagline').textContent=worlds.length+' WILAYAH · '+lessons.filter(Boolean).length+' QUEST · '+outfits.length+' OUTFIT';
 area.append(heading('h2','Selamat datang, '+user.name),heading('p',user.done.filter(id=>lessons[id]).length+' dari '+lessons.filter(Boolean).length+' quest selesai'),btn('Jelajahi map →',()=>go('map'),'gold'),btn('Masuk lobi',()=>go('arena')),btn('Keluar akun',logout));
 if(isTeacher)area.append(btn('Buka Studio Guru',()=>go('studio')));
 side.append(heading('h2','Lanjutkan quest'));const id=Object.keys(user.steps).map(Number).find(i=>user.steps[i]>0)??lessons.findIndex((a,i)=>a&&!user.done.includes(i));if(id>=0)side.append(heading('p',lessons[id][0]+' · '+worlds.find(w=>w.quests.some(q=>q.id===id)).title),btn('Buka quest',()=>lesson(id)));else if(!worlds.some(w=>w.quests.length))side.append(heading('p','Belum ada quest yang tersedia.'));else side.append(heading('p','Semua quest telah selesai. Kamu bisa mengulang latihan melalui jurnal.'))}
function karakter(){main.innerHTML='<span class="label">PROFIL PEMAIN</span><h1>Tampilan Karakter</h1><div class="twocol"><section class="bigSkin" id="look"></section><section class="box"><h2>Nama karakter</h2><p>Nama ini tampil di atas karaktermu saat menjelajah.</p><form id="rename"><label>Nama panggilan<br><input id="newName" required maxlength="24"></label><button class="gold">Simpan nama</button></form></section></div>';
 $('look').append(portrait(user.skin),heading('h2',user.name),heading('p',characters[user.character||0].slice(0,2).join(' · ')),heading('p',outfits[user.skin]),heading('p',items[user.gear||0][0]+' · '+accessories[user.accessory||0]),rankBadge(user.arenaRank),heading('small',(user.arenaRP||0)+' RP'),btn('Peringkat Global',()=>go('global')),btn('Atur penampilan',()=>go('skin')));$('newName').value=user.name;
 $('look').append(heading('small','ID akun · '+user.id));
 $('rename').onsubmit=async e=>{e.preventDefault();if(await save(p=>p.name=$('newName').value.trim())){render();message('Nama karakter berhasil disimpan.')}}}
function wardrobeGroups(){
  return [
    {key:'character',title:'Karakter',names:characters.map(c=>c[0]),needs:characters.map(()=>0)},
    {key:'skin',title:'Outfit',names:outfits,needs:gates},
    {key:'gear',title:'Benda genggam',names:items.map(i=>i[0]),needs:itemGates},
    {key:'accessory',title:'Aksesori',names:accessories,needs:accessoryGates}
  ];
}
function equipmentView(){
  main.append(heading('h1','Ruang ganti'));
  const groups=wardrobeGroups(), count=user.done.length;
  const draft=Object.fromEntries(groups.map(({key})=>[key,user[key]||0]));
  const layout=heading('div',''), preview=heading('section',''), gallery=heading('section','');
  layout.className='fitting';preview.className='fittingPreview';gallery.className='fittingGallery';
  const tabs=heading('div',''),grid=heading('div',''),caption=heading('p','');
  tabs.className='fittingTabs';grid.className='lookGrid';caption.setAttribute('aria-live','polite');
  const figure=heading('div','');figure.className='lookStage';
  const name=heading('h2','');
  const apply=btn('Simpan kombinasi',async()=>{
    const snapshot={...draft};
    apply.disabled=true;
    if(await save(p=>Object.assign(p,snapshot)))message('Penampilan tersimpan.');
    refreshPreview();
  },'gold');
  preview.append(figure,name,caption,apply);gallery.append(tabs,grid);layout.append(preview,gallery);main.append(layout);
  let current=groups[0];
  function picture(d){return portrait(d.skin,d.gear,d.character,d.accessory)}
  function refreshPreview(){
    figure.replaceChildren(picture(draft));name.textContent=characters[draft.character].slice(0,2).join(' · ');
    const required=Math.max(...groups.map(g=>g.needs[draft[g.key]]));
    caption.textContent=[outfits[draft.skin],items[draft.gear][0],accessories[draft.accessory]].join(' · ');
    apply.disabled=saving||required>count;
    if(required>count)caption.textContent+=' — Terbuka setelah '+required+' quest ('+count+'/'+required+').';
  }
  function draw(){
    refreshPreview();
    [...tabs.children].forEach((b,i)=>b.setAttribute('aria-pressed',groups[i]===current));
    grid.replaceChildren();
    current.names.forEach((label,i)=>{
      const tile=btn('',()=>{
        draft[current.key]=i;
        [...grid.children].forEach((b,j)=>b.setAttribute('aria-pressed',i===j));
        refreshPreview();
      },'lookCard');
      const need=current.needs[i];
      const detail=current.key==='character'?characters[i][1]:need>count?'🔒 '+need+' quest':'Tersedia';
      tile.append(picture({...draft,[current.key]:i}),heading('strong',label),heading('small',detail));
      tile.setAttribute('aria-pressed',i===draft[current.key]);grid.append(tile);
    });
  }
  groups.forEach(group=>tabs.append(btn(group.title,()=>{current=group;draw()})));
  draw();
}
function status(i){return user.steps[i]?'Lanjut · soal '+(user.steps[i]+1)+'/'+bank[i].length:user.done.includes(i)?'✓ Selesai · ulangi':bank[i].length+' soal · 50 XP'}
function questCard(i,j){const b=btn('',()=>lesson(i),'card');b.append(heading('small','POS '+(j+1)),heading('h3',lessons[i][0]),heading('small',status(i)));return b}
function mapView(){
  const w=user.world, world=worlds[w];
  if(!world){main.append(heading('h1','Map'),heading('p','Guru belum menambahkan map.'));return}
  main.append(heading('h1',world.title),heading('p',world.theme));
  const nav=document.createElement('nav');nav.className='atlas';main.append(nav);
  worlds.forEach((m,k)=>{const button=btn(m.title,async()=>{if(await save(p=>p.world=k)){pos=64;render()}});button.setAttribute('aria-current',k===w);nav.append(button)});
  main.append(heading('p','Berjalan dengan ← → atau A/D, lompat dengan ↑ atau Spasi. Tekan E di dekat lokasi untuk mengambil quest.'));
  const trail=explore(main,{theme:world.visual,name:world.title,skin:user.skin,initial:pos,stops:world.quests.map(q=>q.lesson[0]),enter:j=>lesson(world.quests[j].id)});
  trail.world=w;
  const list=document.createElement('div');list.className='cards';main.append(list);
  world.quests.forEach((q,j)=>{const button=btn('',()=>trail.goto(j),'card');button.append(heading('small',siteAt(world.visual,j)[0]),heading('h3',q.lesson[0]),heading('small',status(q.id)));list.append(button)});
}
function journal(){main.innerHTML='<span class="label">JURNAL PEMAIN</span><h1>Quest &amp; Achievement</h1><h2 class="section">Pencapaian</h2><div id="badges"></div><h2 class="section">Daftar quest</h2>';const d=user.done;const stats=[['Langkah Pertama',d.length,1,'quest'],['Penjelajah Atlas',worlds.filter(m=>m.quests.length&&m.quests.every(q=>d.includes(q.id))).length,worlds.length,'wilayah tuntas'],['Kolektor Skin',gates.filter(g=>g<=d.length).length,gates.length,'skin'],['Ahli Nahwu',d.filter(id=>lessons[id]).length,lessons.filter(Boolean).length,'quest']];for(const [name,n,max,unit] of stats){let el=document.createElement('div');el.className='achievement';el.append(heading('strong',(max>0&&n>=max?'★ ':'☆ ')+name),heading('small',Math.min(n,max)+' / '+max+' '+unit));$('badges').append(el)}
 worlds.forEach(m=>{main.append(heading('h3',m.title));let g=document.createElement('div');g.className='cards questrow';m.quests.forEach((q,j)=>g.append(questCard(q.id,j)));main.append(g)})}
function questScene(i){const world=worlds.find(w=>w.quests.some(q=>q.id===i));return venueBanner(world.visual,world.quests.findIndex(q=>q.id===i))}
function lesson(i){const a=lessons[i];show(a[0]);panel.append(questScene(i));let example=document.createElement('div');example.className='example';let arab=heading('b',a[1]);arab.className='ar';arab.lang='ar';arab.dir='rtl';example.append(arab,heading('span',a[2]));if(a[1]||a[2])panel.append(example);if(a[3])panel.append(heading('h3','Cara membacanya'),heading('p',a[3]));if(a[4])panel.append(heading('h3','Perhatikan'),heading('p',a[4]));panel.append(btn(user.steps[i]?'Lanjut ke soal '+(user.steps[i]+1):'Mulai latihan · '+bank[i].length+' soal',()=>quiz(i),'gold'))}
function quiz(i){const n=user.steps[i]||0,[q,correct,...rest]=bank[i][n];show(lessons[i][0]);panel.append(questScene(i),heading('small','SOAL '+(n+1)+' / '+bank[i].length),heading('h3',q));let choices=document.createElement('div');choices.className='choices';let note=heading('p','');note.setAttribute('role','status');panel.append(choices,note);let opts=[correct,...rest.slice(0,2)];for(let j=2;j>0;j--){let k=Math.floor(Math.random()*(j+1));[opts[j],opts[k]]=[opts[k],opts[j]]}
 opts.forEach(x=>{let b=btn(x,async()=>{if(x!==correct){b.disabled=true;note.textContent='Belum tepat. '+rest[2]+' Coba lagi.';return}
 const before=user.done.length;if(!await save(p=>{if((p.steps[i]||0)!==n)return;if(n+1<bank[i].length)p.steps[i]=n+1;else{delete p.steps[i];if(!p.done.includes(i))p.done.push(i)}}))return;
 for(const opt of choices.children)opt.disabled=true;note.textContent='Benar! '+rest[2];render();panel.append(btn(n+1<bank[i].length?'Soal berikutnya →':'Lihat hasil →',()=>n+1<bank[i].length?quiz(i):result(i,user.done.length>before),'gold'))});choices.append(b)})}
function result(i,fresh){show('Quest selesai');panel.append(heading('p',lessons[i][0]+' · '+bank[i].length+' soal selesai.'),heading('h3',fresh?'+50 XP':'Latihan ulang selesai'));const rewards=fresh?wardrobeGroups().flatMap(group=>group.names.filter((_,i)=>group.needs[i]===user.done.length)):[];if(rewards.length)panel.append(heading('p','Terbuka di ruang ganti: '+rewards.join(', ')),btn('Lihat hadiah',()=>{dialog.close();go('skin')}));panel.append(btn('Kembali',()=>dialog.close(),'gold'))}
$('cross').onclick=()=>dialog.close();window.addEventListener('hashchange',()=>{if(dialog.open)dialog.close();render()});
boot();
