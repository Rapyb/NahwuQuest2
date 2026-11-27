'use strict';
const regionSites=[
  [['Rumah penyalin','house'],['Sumur desa','well'],['Balai musyawarah','pavilion'],['Rak naskah desa','shelf'],['Gerbang desa','gate']],
  [['Lapak rempah','spices'],['Kios kain','cloth'],['Timbangan saudagar','scale']],
  [['Mata air biru','spring'],['Kemah kafilah','tent'],['Batu penunjuk arah','sign']],
  [['Pohon kurma','palm'],['Saung bibit','nursery'],['Kincir kebun','mill'],['Keranjang panen','fruit'],['Bedeng sayur','beds']],
  [['Perahu layar','boat'],['Gudang dermaga','warehouse'],['Mercusuar','beacon']],
  [['Gerbang benteng','gate'],['Ruang naskah','shelf'],['Menara pengamatan','tower']]
];
function siteAt(theme,index){const row=regionSites[theme];return row[index%row.length]}
const barriers=[
  ['batu jalan','rock'],['peti dagangan','crate'],['batu pasir','sand'],
  ['batang tumbang','log'],['tong muatan','barrel'],['batu benteng','wall']
];
function drawSite(symbol){
  if(['house','palm','well'].includes(symbol))return landmark(['house','palm','well'].indexOf(symbol));
  const c=document.createElement('canvas');c.width=88;c.height=70;
  const g=c.getContext('2d');
  const wood='#765346',light='#c29464',sand='#dfbd88',stone='#938895',dark='#4a4255',leaf='#527e59',sea='#477c87',gold='#e0ab50',red='#a65651';
  function r(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h)}
  function p(points,color){g.fillStyle=color;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()}
  function roof(y,color){p([[5,y],[24,y-15],[63,y-15],[83,y]],color);r(5,y,78,3,wood)}
  function poles(){r(13,26,5,39,wood);r(69,26,5,39,wood)}
  function crate(x,y){r(x,y,19,14,wood);r(x+2,y+2,15,10,light);r(x+8,y,3,14,wood)}
  function sprout(x,y){r(x,y,2,8,leaf);r(x-4,y-2,5,4,'#81a36a');r(x+2,y-4,5,4,leaf)}
  function books(x,y){for(let i=0;i<9;i++)r(x+i*5,y+i%3,4,9-i%3,[red,leaf,sea,sand][i%4])}
  r(6,65,76,4,'#806953');
  switch(symbol){
    case 'pavilion':poles();roof(28,sea);r(16,55,56,4,wood);r(23,59,4,7,wood);r(62,59,4,7,wood);break;
    case 'spices':case 'cloth':
      poles();roof(27,red);for(let i=0;i<7;i++)r(7+i*11,24,9,7,i%2?red:sand);
      r(12,52,63,13,wood);
      for(let i=0;i<4;i++){const x=18+i*14,color=[gold,red,sea,leaf][i];if(symbol==='cloth'){r(x,33,11,20,color);r(x,48,11,2,sand)}else{p([[x-2,51],[x+5,40],[x+12,51]],color);r(x-2,51,14,4,sand)}}
      break;
    case 'scale':r(41,19,5,42,wood);r(19,22,50,3,gold);r(29,61,29,5,wood);
      for(const x of [22,65]){p([[x,24],[x-10,46],[x+10,46]],gold);p([[x,29],[x-7,44],[x+7,44]],dark);p([[x-13,45],[x+13,45],[x+7,52],[x-6,52]],sand)}break;
    case 'spring':p([[3,57],[19,47],[53,45],[82,55],[74,65],[18,66]],sea);r(21,53,33,2,'#9adad4');r(47,59,20,2,'#9adad4');for(const x of [11,17,68]){r(x,31,2,23,leaf);r(x-1,28,4,9,wood)}break;
    case 'tent':p([[4,63],[39,18],[51,19],[83,63]],'#cc8464');p([[39,18],[60,63],[18,63]],sand);p([[39,35],[49,63],[29,63]],dark);r(38,14,3,9,wood);break;
    case 'sign':p([[19,65],[27,35],[32,17],[54,13],[65,42],[72,65]],'#ba916c');p([[54,13],[65,42],[72,65],[55,65]],wood);r(32,33,21,4,dark);p([[50,28],[59,35],[50,42]],dark);break;
    case 'nursery':poles();roof(28,leaf);r(13,54,62,5,wood);for(const x of [23,40,57]){r(x,47,10,7,red);sprout(x+4,40)}break;
    case 'mill':p([[30,64],[38,24],[52,24],[59,64]],sand);for(let i=0;i<4;i++){g.save();g.translate(45,28);g.rotate(i*Math.PI/2);r(0,-3,26,3,wood);r(10,-10,16,7,light);g.restore()}r(42,54,8,11,wood);break;
    case 'fruit':for(let i=0;i<9;i++)r(21+i%5*9,43-Math.floor(i/5)*7,8,8,i%2?gold:red);p([[12,49],[75,49],[65,65],[21,65]],light);break;
    case 'beds':for(let j=0;j<2;j++){r(9,48+j*13,70,6,wood);for(let i=0;i<5;i++)sprout(16+i*13,40+j*13)}break;
    case 'boat':r(41,8,3,47,wood);p([[39,11],[12,47],[39,47]],sand);p([[46,17],[68,46],[46,46]],'#f2d7ae');p([[4,52],[84,52],[69,65],[18,65]],wood);r(17,65,54,2,sea);break;
    case 'warehouse':r(11,30,64,35,light);roof(29,sea);r(18,40,24,25,wood);crate(49,51);crate(61,38);break;
    case 'beacon':p([[29,66],[37,25],[51,25],[58,66]],sand);r(34,43,21,8,red);r(32,18,24,13,dark);r(36,21,16,7,gold);p([[29,18],[44,7],[59,18]],red);break;
    case 'gate':for(const x of [12,60]){r(x,21,17,44,stone);for(let i=0;i<3;i++)r(x+i*6,16,4,7,stone)}r(26,29,37,10,stone);r(31,39,4,26,wood);r(54,39,4,26,wood);break;
    case 'shelf':r(13,24,62,41,wood);for(const y of [31,48]){books(21,y);r(16,y+10,56,3,light)}r(10,21,68,5,sand);break;
    case 'tower':r(27,27,36,38,stone);r(21,17,47,11,stone);for(let i=0;i<5;i++)r(21+i*10,11,7,8,stone);r(42,34,7,12,dark);r(44,0,2,14,wood);r(46,0,14,6,red);break;
  }
  return c;
}
