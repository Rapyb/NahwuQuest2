'use strict';
const newOutfits=[
 ['Baju zirah','armor','#a3aebc'],['Hoodie malam','hood','#685689'],['Seragam sekolah','tie','#f3e6d8'],
 ['Jaket varsity','jacket','#9e5157'],['Jubah kegelapan','robe','#65528b'],['Seragam pramuka','tie','#c4a477'],
 ['Mantel hujan','hood','#d9ad44'],['Zirah samudra','armor','#478996'],['Kimono sakura','robe','#d09aab'],
 ['Jas laboratorium','jacket','#d5e3df'],['Pakaian astronaut','helmet','#ddd6ca'],['Jersey lapangan','sport','#55a484'],
 ['Jaket pilot','jacket','#997255'],['Hoodie mint','hood','#82bbaa'],['Setelan detektif','hat','#ab997c'],
 ['Zirah naga','armor','#b9a35d'],['Seragam pelaut','tie','#92b6cc'],['Jubah penjaga gurun','robe','#d19b6b'],
 ['Daster kembang','dress','#b45e80'],['Daster batik','batik','#5c9195']
];
for(const [name,,color] of newOutfits){outfits.push(name);colors.push(color);gates.push(2+Math.floor((outfits.length-13)*16/19))}
const items=[
 ['Tangan kosong',''],['Pedang bara','...a/..aa/.aa./.a../bbb./.c..'],
 ['Tombak angin','..a../.aaa./..a../..c../..c../..c../..c..'],
 ['Trisula laut','a.a.a/a.a.a/aaaaa/..a../..c../..c../..c..'],
 ['Hape neon','aaaa/abba/abba/abba/a..a/aaaa'],['Tongkat bintang','..b../.bbb./bbbbb/.bbb./..c../..c..'],
 ['Perisai surya','abbbba/baaaab/baabab/.baab./..bb..'],['Lentera','..cc../.c..c./.aaaa./.abba./.abba./.aaaa.'],
 ['Buku mantra','aaa.aaa/abbabba/abbabba/aaaaaaa/...a...'],['Kapak kristal','..aa../.abba./aabbba/..ca../..c.../..c...'],
 ['Palu rune','aaaaaa/abbbaa/aaaaaa/..cc../..cc../..cc..'],['Pedang bulan','....aa/...aa./..aa../.aa.../bbb.../.c....'],
 ['Busur hutan','..ca../.c.a../c..a../c..a../.c.a../..ca..'],['Kipas lipat','bbbbbbb/ababaab/.ababa./..aba../...c...'],
 ['Payung hujan','..bb../.bbbb./bbbbbb/...c../...c../..cc..'],['Obor','..b../.bab./.bbb./..c../..c..'],
 ['Kompas emas','.aaaa./abbbba/abacba/abbaba/.aaaa.'],['Gitar mini','...cc/...cc/..bc./.abba/aabba/.aaa.'],
 ['Kunci kuno','aaa../aba../aaa../.c.../.ccc./.c...'],['Kamera','..aa../aaaaaa/abbaba/ababba/aaaaaa'],
 ['Gulungan peta','cccccc/abbbba/ababba/abbaba/cccccc'],
 ['Pensil kuning','...ab/..ab./.ab../ab.../c....'],['Pena tinta','...aa/..aa./.aa../ab.../c....'],
 ['Penggaris','...aa/..aba/.aba./aba../aa...'],['Kuas lukis','...bb/..bba/.aa../.c.../c....']
];
// Pixel size and grip coordinates in each item's source sprite.
const itemMeasures=[null,[3,4,1,5],[2,5,2,5],[2,6,2,5],[1,1,0,4],[2,4,2,5],
  [2,3,1,3],[2,2,2,0],[2,2,0,3],[2,4,2,5],[2,3,2,5],[3,4,1,5],
  [2,4,0,3],[2,2,3,4],[3,4,3,5],[2,3,2,4],[1,1,0,3],[2,3,2,2],
  [1,2,1,4],[1,1,0,3],[2,2,0,3],[1,2,1,3],[1,2,1,3],[1,2,1,3],[1,2,1,3]];
const itemGates=[0,4,8,12,2,7,5,3,4,9,10,15,7,3,6,4,5,11,6,8,9,2,3,4,5];
const accessories=['Tanpa aksesori','Kalung ambar','Topi jelajah','Kacamata laut','Headset studio','Pita kupu-kupu','Syal senja','Anting zamrud','Baret anggur','Tas selempang','Mahkota safir','Sayap kunang-kunang','Lingkar bintang'];
const accessoryGates=[0,2,4,6,8,1,3,5,7,9,11,14,18];
// Shared pixel grid keeps feet, sleeves and held items aligned on every body shape.
const characters=[
  ['Raka','Petualang','Laki-laki',14,17,9,'crop','#d29870','#403341'],
  ['Sari','Petani','Perempuan',15,15,8,'bob','#bd815d','#533733'],
  ['Bayu','Petani','Laki-laki',19,15,7,'waves','#a66d51','#413331'],
  ['Nisa','Siswi','Perempuan',11,13,7,'braids','#e4aa83','#43333c'],
  ['Arif','Siswa','Laki-laki',11,15,9,'sidePart','#bc8461','#3a3341'],
  ['Laras','Penyihir','Perempuan',11,18,11,'long','#d59677','#744f69'],
  ['Damar','Penyihir','Laki-laki',16,16,8,'swept','#ad795a','#ded4c0'],
  ['Ayu','Pelaut','Perempuan',13,17,10,'sideBraid','#ab7052','#483246'],
  ['Bima','Pandai besi','Laki-laki',20,17,8,'buzz','#b37b60','#533e34'],
  ['Ratih','Pustakawan','Perempuan',13,16,9,'bun','#d59a72','#553c37'],
  ['Fajar','Kurir','Laki-laki',11,17,11,'quiff','#c38569','#473a32'],
  ['Intan','Perajin','Perempuan',17,14,7,'curls','#9c664c','#392d32']
];
const vintageCuts=['jacket','robe','robe','armor','sport','tie','jacket','hood','robe','jacket','robe','sport'];
const vintageNames=['Rompi desa','Jubah senja','Kaftan emas','Zirah oasis','Kemeja kebun','Blus pelaut','Jas juru tulis','Tunik giok','Mantel astronom','Jaket mercusuar','Jubah ahli nahwu','Jersey bintang'];
outfits.splice(0,12,...vintageNames);
const haircuts = {
  crop: [[-5,-2,10,4],[-5,1,2,3],[-3,-3,6,1]],
  bob: [[-5,-3,10,4],[-6,-1,3,10],[4,-1,3,10],[-6,8,4,2],[3,8,4,2],[-4,0,8,2]],
  waves: [[-6,-2,12,4],[-5,-4,4,3],[-1,-3,4,2],[2,-4,3,3],[-6,1,2,4],[3,1,3,2]],
  braids: [[-5,-3,10,4],[-5,0,3,3],[3,0,3,3],[-7,2,3,4],[-8,5,3,4],[-7,8,3,4],[5,2,3,4],[6,5,3,4],[5,8,3,4]],
  sidePart: [[-5,-2,11,3],[-5,0,6,2],[-5,2,3,2],[3,-3,2,2],[4,0,2,4]],
  long: [[-5,-3,10,4],[-7,-1,3,15],[4,-1,3,15],[-8,11,3,5],[5,12,3,5],[-4,0,4,2]],
  swept: [[-5,-2,12,3],[-3,-4,9,2],[1,-5,6,2],[-6,0,4,3],[-6,2,2,4]],
  sideBraid: [[-5,-2,11,3],[-5,0,5,2],[-7,1,4,5],[-8,5,4,4],[-9,8,4,4],[-8,11,4,4],[-9,14,3,3],[-8,17,2,2]],
  buzz: [[-5,-1,10,2],[-4,-2,8,1],[-5,1,1,2],[4,1,1,2]],
  bun: [[-5,-2,11,4],[-4,-5,7,4],[-3,-6,5,2],[-6,0,2,5],[4,1,2,5]],
  quiff: [[-5,-2,11,4],[-2,-4,7,3],[1,-6,4,3],[-5,1,2,3]],
  curls: [[-6,-2,12,4],[-7,-1,3,4],[-5,-4,4,4],[-1,-5,4,4],[3,-4,3,4],[5,0,3,4],[-6,2,2,3]]
};
function drawEquipment(canvas,skin,gear,character=0,accessory=0,frame=0){
  const [, , ,w,body,legs,hair,tone,hairColor]=characters[character]||characters[0];
  const g=canvas.getContext('2d'),ink='#382f3d',white='#f1dfbf',cx=36,base=54;
  const x=cx-Math.floor(w/2), hip=base-legs, y=hip-body, head=y-10;
  const cut=newOutfits[skin-12]?.[1]||vintageCuts[skin], color=colors[skin];
  const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  g.clearRect(0,0,canvas.width,canvas.height);
  // Boots and legs stay on the same ground line for tall and short avatars.
  for(const foot of [x+2,x+w-6]){r(foot,hip-1,4,legs,ink);r(foot-1,base-2,6,2,'#5e463b')}
  r(cx-5,head,10,10,tone);r(cx-6,head+4,12,3,tone);
  // Hair coordinates are relative to the head, so every cut follows its body.
  for(const [dx,dy,width,height] of haircuts[hair]){
    r(cx+dx,head+dy,width,height,hairColor);
  }
  r(cx-2,head+4,1,2,ink);r(cx+3,head+4,1,2,ink);r(cx,head+8,3,1,'#915e53');
  r(x,y,w,body,ink);r(x+1,y+1,w-2,body-2,color);
  for(const arm of [x-2,x+w-1]){r(arm,y+2,4,body-6,color);r(arm,y+body-4,3,4,tone)}
  if(cut==='armor'){r(x-3,y,6,4,'#9da5b4');r(x+w-3,y,6,4,'#9da5b4');for(let i=4;i<body-2;i+=4)r(x+2,y+i,w-4,1,white)}
  if(cut==='hood'){r(cx-6,head,2,9,color);r(cx+5,head,2,9,color);r(cx-5,head-2,10,2,color);r(cx-3,y+2,1,5,white);r(cx+2,y+2,1,5,white);r(cx-3,hip-5,7,2,ink)}
  if(cut==='tie'){r(cx-4,y,8,2,white);r(cx,y+2,2,6,'#9c4c4b');r(x,hip-4,w,3,'#49556b')}
  if(cut==='jacket'){r(cx-2,y+1,4,body-2,white);r(cx+3,y+4,3,2,ink)}
  if(['dress','batik','robe'].includes(cut)){r(x-2,hip-5,w+4,7,color);r(x-2,hip+1,w+4,2,white);
    if(cut==='robe'){for(let j=0;j<6;j++)r(cx-3+j,y+j,2,1,white);r(x,y+8,w,2,ink)}
    else for(let j=3;j<body;j+=5)for(let i=2;i<w-1;i+=5){r(x+i,y+j,2,2,white);r(x+i+1,y+j-1,1,1,cut==='batik'?ink:'#e9aa90')}
  }
  if(cut==='helmet'){r(cx-6,head-2,13,2,color);r(cx-6,head,2,9,color);r(cx+5,head,2,9,color);r(x+2,y+5,5,4,'#687386')}
  if(cut==='sport'){r(x,y,w,2,white);r(cx-1,y+5,4,1,white);r(cx+2,y+6,1,4,white)}
  if(cut==='hat'){r(x,y+2,w,2,'#785d50');r(cx,y+3,2,6,white);r(x-1,hip-2,w+2,3,color)}
  if(accessory===1){ // Necklace with an amber pendant
    r(cx-4,y,2,2,white);r(cx+3,y,2,2,white);r(cx-2,y+2,5,1,white);r(cx,y+3,2,3,'#efac42');
  }
  if(accessory===2){r(cx-6,head-5,12,5,'#397e78');r(cx-6,head-2,12,2,'#efbd60');r(cx-9,head,19,2,'#32625e')}
  if(accessory===3){r(cx-6,head+3,13,2,ink);for(const dx of [-5,1]){r(cx+dx,head+3,5,4,ink);r(cx+dx+1,head+4,3,2,'#80bec4')}}
  if(accessory===4){r(cx-6,head-4,13,2,ink);for(const dx of [-7,6]){r(cx+dx,head-2,2,8,ink);r(cx+dx-1,head+3,4,5,'#56aea2')}r(cx+4,head+8,4,1,ink)}
  switch(accessory){
    case 5: r(cx+3,head-4,4,4,'#d46896');r(cx+9,head-5,4,5,'#ee91ae');r(cx+7,head-3,2,3,'#f8c59f');break;
    case 6: r(cx-6,y-1,13,3,'#da754a');r(cx-5,y+2,4,7,'#ba593f');r(cx-5,y+7,4,1,'#ffc079');break;
    case 7: for(const dx of [-7,6]){r(cx+dx,head+7,1,3,'#eaca72');r(cx+dx-1,head+10,3,3,'#54ca98');r(cx+dx,head+13,1,1,'#a2edc0')}break;
    case 8: r(cx-8,head-4,14,4,'#a24e73');r(cx-5,head-6,11,2,'#bb6586');r(cx-5,head,12,2,'#64394f');break;
    case 9: for(let i=0;i<10;i++)r(x+i,y+i,2,2,'#cc945e');r(cx+1,hip-8,9,7,'#774435');r(cx+2,hip-7,7,3,'#b7744e');r(cx+5,hip-5,2,2,'#f3d287');break;
    case 10: r(cx-7,head-3,14,3,'#d6a94c');for(const dx of [-7,-1,5])r(cx+dx,head-6,2,4,'#ffda75');r(cx-1,head-3,3,2,'#699de4');break;
    case 12: r(cx-7,head-7,14,1,'#f6ce78');r(cx-7,head-5,14,1,'#f6ce78');for(const dx of [-8,7])r(cx+dx,head-6,2,1,'#fff1b5');r(cx+9,head-8,3,1,'#ffe795');r(cx+10,head-9,1,3,'#ffe795');break;
  }
  if(!gear)return;
  const [sx,sy,gripX,gripY]=itemMeasures[gear];
  const [a,b,c]=gearColors[gear];
  const palette={a,b,c};
  const hand=x+w, palm=hip-3;
  if(gear===1){
    g.save();g.shadowColor='#ff642a';g.shadowBlur=3;
    for(let j=0;j<6;j++){
      const fx=hand+2+j,fy=palm-5-j*3;
      const rise=[2,4,3,6,4,2][(j+frame)%6];
      r(fx-2,fy-rise,3,rise+3,'#ff612f');r(fx-1,fy-1,2,4,'#ffbb48');
    }
    g.restore();
    for(let j=0;j<3;j++){
      const t=(frame+j*2)%6;
      r(hand+3+j*3+(t%2),palm-10-j*4-t,1,2,'#ffd280');
    }
  }
  items[gear][1].split('/').forEach((row,j)=>[...row].forEach((pixel,i)=>{
    if(pixel!=='.')r(hand+(i-gripX)*sx,palm+(j-gripY)*sy,sx,sy,palette[pixel]);
  }));
  r(hand-1,palm,3,2,tone);
}
const gearColors=[null,
  ['#fff0a0','#bb6335','#704438'],['#9adfb4','#e0f2ba','#59826a'],['#55bfd1','#c0f5dd','#447488'],
  ['#404051','#66f3ca','#ada8b1'],['#b396dd','#ffe293','#73568b'],['#b86b43','#ffda73','#815540'],
  ['#976643','#ffe69a','#674b42'],['#845584','#ebccb0','#583752'],['#69c7dd','#c1f8fa','#785644'],
  ['#76809e','#c59efa','#674b54'],['#bacaff','#e1edff','#706897'],['#a3bd65','#dddf9e','#786048'],
  ['#d06d77','#f3ae93','#856047'],['#5e85a6','#a7d8ea','#805943'],['#ff7040','#ffdc68','#916741'],
  ['#c89a4e','#ffe4a1','#487e86'],['#c77749','#f1bd77','#755045'],['#d9af51','#ffe3a4','#aa8740'],
  ['#55596b','#a5cfd6','#282c39'],['#b1b788','#f1d3a1','#997256'],['#e6b846','#ef9586','#51434d'],
  ['#4b6489','#bed9eb','#474758'],['#b4c7a1','#657f72','#cfdaad'],['#996749','#bc75a5','#856246']
];
function showPlayerProfile(p){
  const {character,skin,gear,accessory}=p.look;
  show('Profil '+p.name);
  const card=heading('section','');card.className='bigSkin';
  card.append(portrait(skin,gear,character,accessory),rankBadge(p.rank),
    heading('strong','#'+p.place+' global · '+p.rp+' RP'),
    heading('h3',characters[character].slice(0,2).join(' · ')),
    heading('p',[outfits[skin],items[gear][0],accessories[accessory]].join(' · ')));
  panel.append(card);
}
const emblems={Perunggu:'⬟',Perak:'✦',Emas:'★',Safir:'◆',Master:'♛'};
function rankBadge(rank='Perunggu'){
  const badge=heading('span',(emblems[rank]||'⬟')+' '+rank);
  badge.className='rankBadge rank'+rank;return badge;
}
async function globalBoard(offset=0){
  const host=document.createElement('section');main.replaceChildren(host);
  host.append(heading('h1','Peringkat Global'),heading('p','Urutan berdasarkan RP arena. Pemain dengan RP sama berbagi posisi.'));
  try{
    const data=await requestAccount('leaderboard',{offset});
    if(!host.isConnected)return;
    if(data.mine)host.append(heading('h3','Posisimu #'+data.mine.place+' · '+data.mine.rp+' RP'));
    const table=document.createElement('table');table.className='rankTable';
    const header=table.createTHead().insertRow();
    for(const name of ['Posisi','Pemain','Rank','RP'])header.append(heading('th',name));
    const body=table.createTBody();
    for(const p of data.rows){
      const tr=body.insertRow();if(p.me)tr.className='myScore';
      tr.insertCell().textContent='#'+p.place;const profile=btn(p.name+(p.me?' (kamu)':''),()=>showPlayerProfile(p));
      profile.setAttribute('aria-label','Lihat profil '+p.name);tr.insertCell().append(profile);
      tr.insertCell().append(rankBadge(p.rank));tr.insertCell().textContent=p.rp;
    }
    host.append(table);
    if(offset)host.append(btn('← Sebelumnya',()=>globalBoard(offset-25)));
    if(offset+25<data.total)host.append(btn('Berikutnya →',()=>globalBoard(offset+25)));
  }catch(err){host.append(heading('p',err.message),btn('Coba lagi',()=>globalBoard(offset)))}
}

// Lapisan efek pixel NahwuQuest. Koordinat mengikuti sprite 72 × 56.
function drawLookEffects(canvas, skin, gear, character, accessory, frame) {
  const g = canvas.getContext('2d');
  const [, , , width, body, legs] = characters[character] || characters[0];
  const cx = 36, hip = 54 - legs, neck = hip - body, head = neck - 10;
  const hand = cx - Math.floor(width / 2) + width, palm = hip - 3;
  const a = frame * Math.PI / 12, wave = Math.sin(a), lift = Math.cos(a);
  const dot = (x,y,c,w=1,h=1) => { g.fillStyle=c; g.fillRect(Math.round(x),Math.round(y),w,h); };
  function spark(x,y,c,t=0) {
    const bright = Math.sin(a+t);
    if(bright < -.65) return;
    dot(x,y,c);
    if(bright>.3){ dot(x-1,y,c,3); dot(x,y-1,c,1,3); }
  }
  function line(x,y,dx,dy,n,color) {
    for(let i=0;i<n;i++)dot(x+i*dx,y+i*dy,color);
  }
  function curl(x,y,length,amplitude,color,phase=0) {
    for(let i=0;i<length;i++)dot(x+i,y+amplitude*Math.sin(a+phase+i*.5),color);
  }
  // Kostum ditaruh di belakang tubuh agar wajah dan genggaman tetap terbaca.
  g.save();
  g.globalCompositeOperation='destination-over';
  if(skin===16){ // Jubah kegelapan
    for(let i=0;i<4;i++){
      g.globalAlpha=.75-i*.12;
      curl(cx-15+i*2,hip-2-i*2,25-i*3,2+i*.4,'#9a75d2',i);
      dot(cx-10-i+Math.sin(a+i)*2,hip-4-(frame+i*5)%19,'#aa89e0',2,2);
    }
  }
  if(skin===27){ // Zirah naga: kepala, tanduk, badan beruas, ekor.
    const ox=cx-16+Math.cos(a)*3, oy=neck-6+wave*2;
    for(let i=13;i>=0;i--){
      const bx=ox-i*.63, by=oy+4+i*.95+Math.sin(a+i*.5)*2;
      dot(bx,by,i%2?'#438f78':'#54ad89',i>9?2:4,3);
      if(i<9 && i%2===0)dot(bx-1,by-1,'#efc76b',2,2);
    }
    dot(ox-2,oy,'#478c76',7,5);dot(ox+3,oy+2,'#81c991',4,2);
    dot(ox+2,oy+1,'#ffdc80');dot(ox-2,oy-3,'#d7b86a',1,3);
    dot(ox+1,oy-2,'#ffe9a3',1,2);
  }
  if(skin===20 || skin===19 || skin===22){
    for(let i=0;i<4;i++){
      const t=(frame+i*6)%24;
      const x=cx+(i%2?1:-1)*(11+i%3)+Math.sin(a+i)*2;
      const y=skin===22?hip-t:head+t;
      dot(x,y,skin===20?'#ef9ebb':skin===19?'#85dee5':'#b4caff',2,2);
      if(skin===20)dot(x+1,y-1,'#ffd6d9');
      if(skin===22)spark(x,y,'#dae8ff',i);
    }
  }
  if(accessory===11){
    for(const d of [-1,1]){
      const spread=7+4*wave;
      for(let j=0;j<10;j++){
        const x=cx+d*(8+j*spread/9), y=neck+5-j*.9+lift*2;
        dot(x,y,'#508b84',3,3+Math.floor((9-j)/2));
        dot(x,y+1,'#a5e5cc',2,2);
        dot(x,y+7,'#78bba5',2,2);
      }
      spark(cx+d*(12+spread),neck+3+wave*4,'#e6ffc0',d);
    }
  }
  g.restore();
  switch(accessory){
    case 1:spark(cx+1,neck+5,'#fff1ac');break;
    case 2:line(cx+5,head-3,-.45,-1,4,'#81cbb7');dot(cx+3+wave*2,head-7,'#f6d382',2,2);break;
    case 3:for(const x of [cx-5,cx+1])dot(x+frame%5,head+4,'#c6fff5');break;
    case 4:for(let i=0;i<3;i++)dot(cx+9+i*2,head+7-Math.abs(Math.sin(a+i))*3,'#75ded6',1,2);break;
    case 5:line(cx+10,head,1,wave*.5,4,'#f9a6be');break;
    case 6:curl(cx-14,neck+3,11,2,'#eb8d5b');break;
    case 7:for(const d of [-1,1])spark(cx+d*7+wave,head+12,'#bcffd6',d);break;
    case 8:spark(cx-5,head-3,'#ffb3c9');break;
    case 9:dot(cx+6+wave,hip-5,'#e9bd7d',2,2);dot(cx+6+wave*2,hip-3,'#d39d6b',1,3);break;
    case 10:for(const dx of [-6,0,6])spark(cx+dx,head-5,'#fff3a5',dx*.4);break;
    case 12:
      g.save();g.shadowColor='#ffd577';g.shadowBlur=3;
      for(let i=0;i<4;i++){const t=a+i*Math.PI/2;spark(cx+11*Math.cos(t),head-6+3*Math.sin(t),'#ffe6a1',i);}
      g.restore();break;
  }
  const tx=hand, ty=palm;
  switch(gear){
    case 2:for(let i=0;i<2;i++)curl(tx-6+wave*3,ty-20+i*5,14-i*3,2,'#bff8ce',i*2);break;
    case 3:for(let i=0;i<3;i++){const t=(frame+i*8)%24;dot(tx-4+i*4+Math.sin(a+i)*2,ty-29+t*.55,'#76dfea',2,2);dot(tx-4+i*4+Math.sin(a+i)*2,ty-30+t*.55,'#d4ffff');}break;
    case 4:dot(tx+1,ty-3+Math.floor(frame/8),'#d5fff9',2);break;
    case 5:case 9:case 11:spark(tx+3+wave*4,ty-16+lift*3,gear===9?'#96edff':gear===11?'#dae3ff':'#ffe493');break;
    case 6:spark(tx+2+wave*3,ty-5+lift*3,'#ffe3a0');break;
    case 7:dot(tx,ty+6,'#ffcc70',2,2+Math.round(1+wave));break;
    case 8:curl(tx+1,ty-8,7,1,'#e8b4ff');break;
    case 10:line(tx-3,ty-11+lift,1,1,3,'#cfb3ff');break;
    case 12:curl(tx-6,ty-11,8,1,'#b6d77d');break;
    case 13:case 14:curl(tx+2,ty-8,7,2,gear===13?'#ffb8ae':'#9fdbee');break;
    case 15:for(let i=0;i<3;i++)dot(tx+i-1,ty-10-(frame+i*7)%8,i%2?'#ff8e42':'#ffe088');break;
    case 16:dot(tx+2+wave,ty-1+lift,'#84efe6');break;
    case 17:dot(tx+4+wave*2,ty-7-frame%8,'#ffc792',2);dot(tx+6+wave*2,ty-10-frame%8,'#ffc792',1,4);break;
    case 18:case 19:spark(tx+3,ty-4,gear===19?'#caedff':'#ffe89e');break;
    case 20:dot(tx+2+frame%5,ty-2,'#efdf8e');break;
    case 21:case 22:case 23:case 24:curl(tx+1,ty+2,5,1,gearColors[gear][1]);break;
  }
}
