'use strict';
let arenaRun = 0, arenaTimer;
function stopArena() {
  arenaRun++;
  clearTimeout(arenaTimer);
}
function arenaView() {
  const run = arenaRun;
  const questNames = {"i'rab":"Sprint I‘rāb", jumlah:"Reli Susun Kalimat"};
  main.innerHTML = '<section class="arenaBanner"><div><span class="label">MULTIPLAYER · QUEST RANKED</span><h1>Arena Nahwu</h1><p>Selesaikan lima soal dengan benar. Pemain pertama yang finis memenangkan balapan.</p></div><div class="arenaRank" id="arenaRank">Memuat rank…</div></section><p id="arenaNotice" role="status"></p><div id="arenaBody"></div>';
  const mapHost=document.createElement('section');
  $('arenaBody').before(mapHost);
  let trail=null, mapKey='', opened=-1, modalState='', latest;
  const area = $('arenaBody'), notice = $('arenaNotice');
  const token = user.arenaToken;
  let mapKeySelected=worlds[user.world]?.key;
  function roomTheme(room){return room.arenaMap?.visual??(room.quest==='jumlah'?3:0)}
  let current, last = '', busy = false, quest = "i'rab", inputCode = '';
  function card(title) {
    const box = document.createElement('section');
    box.className = 'box';
    box.append(heading('h2',title));
    return box;
  }
  async function update(action='state', fields={}) {
    if (run !== arenaRun) return;
    // Polling is serialized with actions. A click during a poll waits for it.
    if (busy) {
      if (action !== 'state') setTimeout(()=>update(action,fields),60);
      return;
    }
    clearTimeout(arenaTimer);
    busy = true;
    try {
      const response = await fetch(window.NAHWU_ARENA_URL,{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({action,token,name:user.name,code:current?.code,pose:trail?.pose(),...fields}),signal:AbortSignal.timeout(8000)});
      if (!response.headers.get('content-type')?.includes('application/json')) throw Error('API arena belum terhubung. Periksa alamat backend pada konfigurasi deployment.');
      const data = await response.json();
      if (run !== arenaRun) return;
      if (!response.ok) throw Error(data.error || 'Server belum tersedia.');
      if (action !== 'state' || notice.dataset.connection) notice.textContent = '';
      delete notice.dataset.connection;
      current = data.room;
      if (user.arenaXP!==data.xp || user.arenaRP!==data.rp || user.arenaRank!==data.rank) {
        Object.assign(user,{arenaXP:data.xp,arenaRP:data.rp,arenaRank:data.rank});
        {
          $('playerInfo').textContent=user.name+' · ✦ '+(user.done.length*50+data.xp)+' XP';
        }
      }
      $('arenaRank').replaceChildren(rankBadge(data.rank),heading('span',' · '+data.rp+' RP'+(data.next?' / '+data.next+' RP':'')+' · '+data.xp+' XP arena'));
      draw(data);
    } catch (err) {
      if (run !== arenaRun) return;
      notice.textContent = err instanceof TypeError || err.name==='TimeoutError' ? 'Koneksi ke arena terputus. Mencoba kembali…' : err.message;
      if (action==='state') notice.dataset.connection='1';
    } finally {
      busy = false;
      if (run===arenaRun) arenaTimer=setTimeout(()=>update(),current?500:1600);
    }
  }
  function draw(data) {
    const r=data.room;
    const remaining=r?Math.max(0,Math.ceil(r.start+180-data.now)):0;
    const count=r?Math.max(0,Math.ceil(r.start-data.now)):0;
    const retry=r?Math.max(0,Math.ceil(r.retry-data.now)):0;
    latest=data;
    const mapId=r?r.code+'-'+r.phase:'';
    if(mapId!==mapKey){
      mapKey=mapId;trail?.destroy();trail=null;mapHost.replaceChildren();opened=-1;
      if(dialog.open)dialog.close();
      if(r && r.phase!=='result'){
        const me=r.members.find(p=>p.me);
        mapHost.append(heading('h2',r.arenaMap?.title??(r.quest==='jumlah'?'Lintasan kebun kurma':'Lintasan desa kitab')),
          heading('p','← → untuk berjalan, ↑ untuk lompat. Saat balapan, kunjungi lima lokasi sesuai urutan dan tekan E atau Ambil.'));
        trail=explore(mapHost,{name:r.code,theme:roomTheme(r),skin:user.skin,initial:me.x,
          stops:Array.from({length:5},(_,i)=>'Pos '+(i+1)+' · '+siteAt(roomTheme(r),i)[0]),
          allowed:i=>current?.phase==='race'&&!!current?.question&&current.members.find(p=>p.me).step===i,
          enter:i=>{opened=i;modalState='';arenaQuestion()}});
      }
    }
    if(trail){trail.sync(r.members);trail.mark(r.phase==='race'?r.members.find(p=>p.me).step:-1)}
    if(opened>=0)arenaQuestion();
    const signature=JSON.stringify(r?[{...r,members:r.members.map(({x,jump,skin,...m})=>m)},count,retry]:data.rooms);
    const clock=$('arenaClock');
    if(clock) clock.textContent='Sisa waktu '+remaining+' detik';
    if(last===signature) return;
    last=signature;
    area.replaceChildren();
    area.className='twocol';
    if(!r) {
      const create=card('Buat ruangan'), rooms=card('Gabung balapan');
      const select=document.createElement('select');
      select.setAttribute('aria-label','Quest multiplayer');
      for(const [id,title] of Object.entries(questNames)) select.add(new Option(title,id));
      select.value=quest;
      select.onchange=()=>{quest=select.value};
      const mapLabel=heading('label','Map multiplayer'),mapSelect=document.createElement('select');
      worlds.forEach(w=>mapSelect.add(new Option(w.title+' · '+visualThemes[w.visual],w.key)));
      mapSelect.value=mapKeySelected;mapSelect.onchange=()=>{mapKeySelected=Number(mapSelect.value)};
      mapLabel.append(mapSelect);
      const createRoom=btn('Buat ruangan',()=>update('create',{quest,mapKey:mapKeySelected}),'gold');
      createRoom.disabled=!worlds.length;
      if(!worlds.length)create.append(heading('p','Guru belum menyediakan map.'));
      create.append(heading('p','2–4 pemain · 3 menit · 5 soal'),select,mapLabel,createRoom,
        heading('p','Juara mendapat 100 XP dan 30 RP. Finisher berikutnya mendapat 50 XP dan 12 RP. Kumpulkan RP untuk naik rank.'));
      const form=document.createElement('form'), input=document.createElement('input');
      input.placeholder='Kode ruangan';input.setAttribute('aria-label','Kode ruangan');input.maxLength=6;input.required=true;input.value=inputCode;
      input.oninput=()=>{inputCode=input.value};
      const join=document.createElement('button');join.textContent='Gabung';
      form.append(input,join);form.onsubmit=e=>{e.preventDefault();update('join',{code:input.value.trim().toUpperCase()})};
      rooms.append(form);
      for(const room of data.rooms) rooms.append(btn(questNames[room.quest]+' · '+(room.arenaMap?.title??'Arena')+' · '+room.code+' · '+room.count+'/4',()=>update('join',{code:room.code}),'roomLink'));
      if(!data.rooms.length) rooms.append(heading('p','Belum ada ruangan terbuka. Buat ruangan dan bagikan kodenya ke temanmu.'));
      create.append(btn('Peringkat Global',()=>go('global')));area.append(create,rooms);
      return;
    }
    const me=r.members.find(p=>p.me), box=card(questNames[r.quest]), board=card(r.phase==='waiting'?'Pemain di lobi':'Klasemen balapan');
    area.append(box,board);
    box.append(heading('small','Ruangan '+r.code));
    if(r.phase==='waiting') {
      box.append(heading('p','Bagikan kode ruangan. Setelah semua pemain siap, tuan rumah bisa memulai balapan.'),btn(me.ready?'Batalkan siap':'Saya siap',()=>update('ready',{ready:!me.ready})));
      if(r.host) {
        const start=btn('Mulai balapan',()=>update('start'),'gold');
        start.disabled=r.members.length<2||!r.members.every(p=>p.ready);
        box.append(start);
      }
    } else if(count) box.append(heading('h3','Mulai dalam '+count+'…'));
    else if(me.place || r.phase==='result') {
      box.append(heading('h3',me.place===1?'Kamu juara!':me.place?'Finis di posisi '+me.place:'Waktu habis'),heading('p','Hadiahmu · +'+me.reward[0]+' XP · +'+me.reward[1]+' RP'));
      if(me.place) box.append(heading('p','Waktu finis '+me.elapsed.toFixed(2)+' detik'));
    } else if(r.question) {
      const time=heading('small','Sisa waktu '+remaining+' detik');time.id='arenaClock';
      box.append(heading('p','Tujuan · '+siteAt(roomTheme(r),me.step)[0]+' (pos '+(me.step+1)+' dari 5)'),time,
        btn('Jalan ke pos soal',()=>trail.goto(me.step)));

    }
    const sorted=[...r.members].sort((a,b)=>(a.place||9)-(b.place||9)||b.step-a.step);
    for(const p of sorted) {
      const row=document.createElement('div');row.className='arenaRow';
      row.append(rankBadge(p.rank),heading('strong',p.name+(p.me?' (kamu)':'')),heading('small',r.phase==='waiting'?(p.host?'Host · ':'')+(p.ready?'Siap':'Menunggu'):p.place?'#'+p.place+' · '+p.elapsed.toFixed(2)+' dtk':p.left?'Keluar':p.step+'/5'));
      board.append(row);
    }
    board.append(btn(r.phase==='waiting'?'Keluar ruangan':'Kembali ke lobi',()=>{
      if(r.phase!=='race'||me.place||window.confirm('Keluar sekarang akan mengakhiri balapanmu tanpa hadiah.')) update('leave');
    }));
  }
  function arenaQuestion(){
    const r=latest.room, me=r?.members.find(p=>p.me);
    if(!r?.question||me?.step!==opened||r.phase!=='race'){
      opened=-1;if(dialog.open)dialog.close();return;
    }
    const retry=Math.max(0,Math.ceil(r.retry-latest.now));
    const state=opened+'-'+retry;
    if(state===modalState){if(!dialog.open)opened=-1;return}
    modalState=state;
    show(siteAt(roomTheme(r),opened)[0]+' · Soal '+(opened+1));
    panel.append(venueBanner(roomTheme(r),opened),heading('h3',r.question.prompt));
    const choices=document.createElement('div');choices.className='choices';panel.append(choices);
    r.question.choices.forEach((choice,i)=>{
      const button=btn(choice,()=>{update('answer',{step:me.step,choice:i})});button.disabled=retry>0;choices.append(button);
    });
    if(retry)panel.append(heading('p','Belum tepat. Coba lagi dalam '+retry+' detik.'));
  }
  update();
}
