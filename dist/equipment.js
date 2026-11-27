'use strict';
const newOutfits=[
 ['Baju zirah','armor','#a3aebc'],['Hoodie malam','hood','#685689'],['Seragam sekolah','tie','#f3e6d8'],
 ['Jaket varsity','jacket','#9e5157'],['Jubah penyihir','robe','#65528b'],['Seragam pramuka','tie','#c4a477'],
 ['Mantel hujan','hood','#d9ad44'],['Zirah samudra','armor','#478996'],['Kimono sakura','robe','#d09aab'],
 ['Jas laboratorium','jacket','#d5e3df'],['Pakaian astronaut','helmet','#ddd6ca'],['Jersey lapangan','sport','#55a484'],
 ['Jaket pilot','jacket','#997255'],['Hoodie mint','hood','#82bbaa'],['Setelan detektif','hat','#ab997c'],
 ['Zirah kerajaan','armor','#b9a35d'],['Seragam pelaut','tie','#92b6cc'],['Jubah penjaga gurun','robe','#d19b6b']
];
for(const [name,,color] of newOutfits){outfits.push(name);colors.push(color);gates.push(0)}
const items=[
 ['Tangan kosong',''],['Pedang kesatria','...a/..aa/.aa./.a../bbb./.c..'],
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
 ['Gulungan peta','cccccc/abbbba/ababba/abbaba/cccccc']
];
function drawEquipment(canvas,skin,gear){
  sprite(canvas,skin);
  const g=canvas.getContext('2d');
  function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
  if(skin>=12){
    const [,cut,color]=newOutfits[skin-12], trim='#f1dfb9', ink='#48415a';
    switch(cut){
      case 'armor':rect(3,14,6,4,color);rect(14,14,6,4,color);rect(6,18,10,1,trim);rect(7,4,10,3,color);rect(9,3,6,1,trim);break;
      case 'hood':rect(4,4,14,4,color);rect(4,7,3,8,color);rect(15,7,3,8,color);rect(8,15,1,4,trim);rect(13,15,1,4,trim);break;
      case 'tie':rect(7,15,8,2,trim);rect(10,16,2,5,'#9a4649');rect(6,21,10,2,ink);break;
      case 'jacket':rect(9,15,4,7,trim);rect(4,16,2,5,color);rect(16,16,2,5,color);rect(13,17,3,1,ink);break;
      case 'robe':rect(5,20,13,4,color);for(let j=0;j<6;j++)rect(7+j,15+j,2,1,trim);rect(6,20,10,1,ink);break;
      case 'helmet':rect(3,3,16,12,color);rect(5,5,12,8,'#4a768d');rect(6,6,5,2,'#a5d9db');rect(8,17,6,3,ink);break;
      case 'sport':rect(4,15,4,2,trim);rect(14,15,4,2,trim);rect(10,17,3,1,trim);rect(12,18,1,3,trim);break;
      case 'hat':rect(6,2,10,5,color);rect(3,6,16,2,ink);rect(8,16,6,2,trim);break;
    }
  }
  if(!gear)return;
  const palette={a:['#b4d6df','#a7c9ec','#7cc5cc','#51475f'][((gear-1)%4)],b:'#f4d079',c:'#977455'};
  items[gear][1].split('/').forEach((row,y)=>[...row].forEach((pixel,x)=>{
    if(pixel!=='.')rect(18+x,11+y,1,1,palette[pixel]);
  }));
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
      tr.insertCell().textContent='#'+p.place;tr.insertCell().textContent=p.name+(p.me?' (kamu)':'');
      tr.insertCell().append(rankBadge(p.rank));tr.insertCell().textContent=p.rp;
    }
    host.append(table);
    if(offset)host.append(btn('← Sebelumnya',()=>globalBoard(offset-25)));
    if(offset+25<data.total)host.append(btn('Berikutnya →',()=>globalBoard(offset+25)));
  }catch(err){host.append(heading('p',err.message),btn('Coba lagi',()=>globalBoard(offset)))}
}
