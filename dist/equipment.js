'use strict';
const newOutfits=[
 ['Baju zirah','armor','#a3aebc'],['Hoodie malam','hood','#685689'],['Seragam sekolah','tie','#f3e6d8'],
 ['Jaket varsity','jacket','#9e5157'],['Jubah penyihir','robe','#65528b'],['Seragam pramuka','tie','#c4a477'],
 ['Mantel hujan','hood','#d9ad44'],['Zirah samudra','armor','#478996'],['Kimono sakura','robe','#d09aab'],
 ['Jas laboratorium','jacket','#d5e3df'],['Pakaian astronaut','helmet','#ddd6ca'],['Jersey lapangan','sport','#55a484'],
 ['Jaket pilot','jacket','#997255'],['Hoodie mint','hood','#82bbaa'],['Setelan detektif','hat','#ab997c'],
 ['Zirah kerajaan','armor','#b9a35d'],['Seragam pelaut','tie','#92b6cc'],['Jubah penjaga gurun','robe','#d19b6b'],
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
  ['Sari','Petani','Perempuan',15,15,8,'straw','#bd815d','#533733'],
  ['Bayu','Petani','Laki-laki',19,15,7,'strawbeard','#a66d51','#413331'],
  ['Nisa','Siswi','Perempuan',11,13,7,'braids','#e4aa83','#43333c'],
  ['Arif','Siswa','Laki-laki',11,15,9,'glasses','#bc8461','#3a3341'],
  ['Laras','Penyihir','Perempuan',11,18,11,'witch','#d59677','#744f69'],
  ['Damar','Penyihir','Laki-laki',16,16,8,'sage','#ad795a','#ded4c0'],
  ['Ayu','Pelaut','Perempuan',13,17,10,'bandana','#ab7052','#483246'],
  ['Bima','Pandai besi','Laki-laki',20,17,8,'beard','#b37b60','#533e34'],
  ['Ratih','Pustakawan','Perempuan',13,16,9,'bun','#d59a72','#553c37'],
  ['Fajar','Kurir','Laki-laki',11,17,11,'cap','#c38569','#473a32'],
  ['Intan','Perajin','Perempuan',17,14,7,'curls','#9c664c','#392d32']
];
const vintageCuts=['jacket','robe','robe','armor','sport','tie','jacket','hood','robe','jacket','robe','sport'];
const vintageNames=['Rompi desa','Jubah senja','Kaftan emas','Zirah oasis','Kemeja kebun','Blus pelaut','Jas juru tulis','Tunik giok','Mantel astronom','Jaket mercusuar','Jubah ahli nahwu','Jersey bintang'];
outfits.splice(0,12,...vintageNames);
function drawEquipment(canvas,skin,gear,character=0,accessory=0,frame=0){
  const [, , ,w,body,legs,hair,tone,hairColor]=characters[character]||characters[0];
  const g=canvas.getContext('2d'),ink='#382f3d',white='#f1dfbf',cx=36,base=54;
  const x=cx-Math.floor(w/2), hip=base-legs, y=hip-body, head=y-10;
  const cut=newOutfits[skin-12]?.[1]||vintageCuts[skin], color=colors[skin];
  const r=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h)};
  g.clearRect(0,0,canvas.width,canvas.height);
  if(accessory===11){
    for(const dir of [-1,1])for(let k=0;k<7;k++){
      r(cx+dir*(10+k)-2,y-4+k,4,13-k,'#508b84');
      r(cx+dir*(10+k)-1,y-2+k,2,7-k,'#b3eed5');
    }
  }
  // Boots and legs stay on the same ground line for tall and short avatars.
  for(const foot of [x+2,x+w-6]){r(foot,hip-1,4,legs,ink);r(foot-1,base-2,6,2,'#5e463b')}
  r(cx-5,head,10,10,tone);r(cx-6,head+4,12,3,tone);
  r(cx-5,head-2,10,4,hairColor);r(cx-5,head+1,2,4,hairColor);
  r(cx-2,head+4,1,2,ink);r(cx+3,head+4,1,2,ink);r(cx,head+8,3,1,'#915e53');
  if(['braids','witch','bandana'].includes(hair))for(const dx of [-6,5])r(cx+dx,head+2,2,10,hairColor);
  if(['beard','strawbeard','sage'].includes(hair)){r(cx-4,head+8,9,3,hairColor);r(cx-2,head+11,5,2,hairColor)}
  if(['straw','strawbeard'].includes(hair)){r(cx-9,head-1,19,2,'#ad7b41');r(cx-5,head-4,11,3,'#e2bd6f');r(cx-4,head-5,8,1,'#eacc8b')}
  if(hair==='sage'||hair==='witch'){for(let i=0;i<6;i++)r(cx-5+i,head-2-i,11-i*2,1,'#685274');r(cx-8,head-1,17,2,'#886885')}
  if(hair==='glasses'||hair==='bun'){r(cx-4,head+3,4,3,'#414354');r(cx+1,head+3,4,3,'#414354');r(cx,head+4,1,1,ink);r(cx-3,head+4,2,1,'#bdc5be');r(cx+2,head+4,2,1,'#bdc5be')}
  if(hair==='bun')r(cx-6,head-5,6,5,hairColor);
  if(hair==='curls')for(const [dx,dy] of [[-6,0],[-5,-3],[-1,-4],[3,-3],[5,0]])r(cx+dx,head+dy,4,4,hairColor);
  if(hair==='cap'||hair==='bandana'){r(cx-5,head-2,11,4,hair==='cap'?'#46747a':'#ae584e');r(cx+(hair==='cap'?4:-8),head+1,5,2,hair==='cap'?'#355d60':'#963f3b')}
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
  if(hair==='bandana'){ // Ayu: side braid, coral ties and a knotted sailor scarf.
    for(let i=0;i<5;i++){const bx=cx-10+(i%2);r(bx,head+5+i*3,5,4,hairColor);r(bx+1,head+6+i*3,2,1,'#7c5862')}
    r(cx-9,head+19,4,2,'#f1a17e');r(cx-8,head+21,2,2,hairColor);
    r(cx-9,head,4,3,'#eb896c');r(cx-12,head+2,4,2,'#c66658');r(cx-4,y,8,2,'#d36e60');r(cx+1,y+2,3,4,'#eb896c');
  }
  if(hair==='bun'){ // Ratih: low chignon, gold hairpin and a loose face-framing lock.
    r(cx-11,head-2,6,7,hairColor);r(cx-12,head,7,4,hairColor);
    r(cx-10,head,4,2,'#855d50');r(cx-12,head-3,7,1,'#f1c877');
    r(cx-13,head-4,2,3,'#e6a8ab');r(cx+4,head+1,3,9,hairColor);r(cx+5,head+9,3,3,hairColor);
    r(cx-6,head+8,2,2,'#f1c877');
  }
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
