'use strict';
function studio() {
  main.append(heading('h1','Studio Guru'),heading('p','Pilih wilayah untuk menyunting materi yang dimainkan siswa.'));
  main.append(btn('+ Buat map',()=>mapForm(worlds.length),'gold'));
  for(const [wid,world] of worlds.entries()) {
    const section=document.createElement('section');section.className='box editorSection';
    section.append(heading('h2',world.title),heading('p',world.theme),
      btn('Ubah map',()=>mapForm(wid)),btn('+ Buat quest',()=>questForm(wid)),btn('Hapus map',()=>deleteMapForm(wid)));
    const list=document.createElement('div');list.className='editorList';
    for(const q of world.quests){
      const row=document.createElement('div');row.className='questTools';
      row.append(btn(q.lesson[0]+' · '+q.questions.length+' soal',()=>questForm(wid,q)),btn('Hapus quest',()=>{
        const body=editor('Hapus quest '+q.lesson[0]+'?',()=>({kind:'deleteQuest',world:wid,quest:q.id}),'Hapus quest');
        body.append(heading('p',q.questions.length+' soal dalam quest ini akan dihapus dari '+world.title+'. XP yang sudah diperoleh tetap tersimpan.'),btn('Batal',()=>dialog.close()));
      }));list.append(row);
    }
    section.append(list);main.append(section);
  }
}
function editor(title, fields, submitText='Terbitkan') {
  show(title);
  const form=document.createElement('form');form.className='accountForm';panel.append(form);
  const submit=document.createElement('button');submit.className='gold';submit.textContent=submitText;
  const status=heading('p','');status.setAttribute('role','status');
  form.onsubmit=async e=>{
    e.preventDefault();submit.disabled=true;status.textContent='Menyimpan…';
    try {
      const data=await requestAccount('publish',{version,...fields()});
      setCatalog(data);

      dialog.close();render();message(submitText==='Hapus quest'?'Quest telah dihapus.':submitText==='Hapus map'?'Map telah dihapus.':'Terbit. Muat ulang untuk melihat perubahan di perangkat lain.');
    } catch(err){status.textContent=err.message} finally {submit.disabled=false}
  };
  form.append(submit,status);
  const body=document.createElement('div');body.className='editorBody';form.prepend(body);
  return body;
}
function deleteMapForm(wid) {
  const world=worlds[wid];
  const body=editor('Hapus '+world.title+'?',()=>({kind:'deleteMap',world:wid}),'Hapus map');
  body.append(heading('p','Map dan '+world.quests.length+' quest di dalamnya akan dihapus. XP dan skin yang sudah diperoleh siswa tetap tersimpan.'),
    btn('Batal',()=>dialog.close()));
}
function mapForm(wid) {
  const w=worlds[wid];
  const form=editor(w?'Ubah map':'Buat map',()=>({kind:'map',world:wid,title:title.value,theme:theme.value,visual:Number(visual.value)}));
  const title=fieldInput(form,'Nama map',w?.title,{required:true,maxLength:100});
  const label=heading('label','Tema visual map'), visual=document.createElement('select');
  visualThemes.forEach((name,index)=>visual.add(new Option(name,index)));
  visual.value=w?.visual??0;label.append(visual);form.append(label);
  const theme=fieldInput(form,'Tema pembelajaran',w?.theme,{required:true,maxLength:300});
}
function questForm(wid,q) {
  const items=[];
  const form=editor(q?'Ubah quest':'Buat quest',()=>({kind:'quest',world:wid,quest:q?.id??null,
    lesson:lessonFields.map(el=>el.value),questions:items.map(item=>item.inputs.map(el=>el.value))}));
  const lessonFields=['Judul quest','Contoh bahasa Arab','Arti contoh','Cara membaca','Catatan materi'].map(
    (label,j)=>fieldInput(form,label,q?.lesson[j],{required:j===0,maxLength:j===0?100:1000}));
  const rows=document.createElement('div');
  const add=btn('+ Tambah soal',()=>appendRow([]));form.append(rows,add);
  function refresh() {
    items.forEach((item,j)=>{item.legend.textContent='Soal '+(j+1);item.remove.disabled=items.length===1});
    add.disabled=items.length>=30;
  }
  function appendRow(values) {
    const row=document.createElement('fieldset'),legend=document.createElement('legend');row.append(legend);
    const inputs=['Pertanyaan','Jawaban benar','Pilihan salah 1','Pilihan salah 2','Pembahasan (opsional)'].map(
      (label,j)=>fieldInput(row,label,values[j],{required:j<4,maxLength:600}));
    const remove=btn('Hapus soal ini',()=>{items.splice(items.indexOf(item),1);row.remove();refresh()});
    const item={legend,inputs,remove};items.push(item);row.append(remove);rows.append(row);refresh();
  }
  for(const values of q?.questions||[[]])appendRow(values);
}
