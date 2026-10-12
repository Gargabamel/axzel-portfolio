const defaults = {
  brand: 'AF<span>•</span>', location: 'School of Architecture',
  intro: 'I’m Axzel Fajarillo, an architecture student exploring how drawings, models, and research can shape better places to live and gather.',
  about: 'This portfolio brings together work from my architecture studies: investigations into theory and history, spatial design, and visual communication. Each project is an opportunity to observe, test, and make ideas tangible.',
  email: 'your.email@example.com', footer: '© 2026 Axzel Fajarillo',
  projects: [
    {name:'TOA', type:'Theory of Architecture · 2026', color:'#586c6f'},
    {name:'HOA', type:'History of Architecture · 2026', color:'#9e6049'},
    {name:'VISCOM', type:'Visual Communication · 2026', color:'#bd8b57'},
    {name:'Graphics', type:'Graphics · 2026', color:'#5c7591'}
  ], plates: {
    Graphics: [
      {title:'Plate 1', image:'graphics/plate-01-lettering.png'},
      {title:'Plate 2', image:'graphics/plate-02-patterns.png'},
      {title:'Plate 3', image:'graphics/plate-03-curves.png'},
      {title:'Plate 4', image:'graphics/plate-04-projections.png'},
      {title:'Plate 5', image:'graphics/plate-05-orthographic.png'},
      {title:'Plate 6', image:'graphics/plate-06-security-post.png'},
      {title:'Departmental Plate', image:'graphics/departmental-plate.png'}
    ]
  }
};
let data = JSON.parse(localStorage.getItem('architecturePortfolioDataV5') || 'null') || structuredClone(defaults);
const grid = document.getElementById('projectGrid');
const dialog = document.getElementById('editor');
const subjectDialog = document.getElementById('subjectDialog');
let activeSubject = '', selectedImage = '';
function render(){
  document.querySelector('[data-field="brand"]').innerHTML=data.brand;
  ['location','intro','about','footer'].forEach(k=>document.querySelector(`[data-field="${k}"]`).textContent=data[k]);
  const email=document.querySelector('[data-field="email"]'); email.textContent=data.email+' '; email.insertAdjacentHTML('beforeend','<span>↗</span>'); email.href='mailto:'+data.email;
  grid.innerHTML=data.projects.map((p,i)=>`<article class="project" data-subject="${i}"><div class="project-image" style="background:${p.color}"><span>${p.name}</span></div><div class="project-meta"><strong>${p.type.split(' · ')[0]}</strong><small>${p.type.split(' · ')[1]||''}</small></div></article>`).join('');
  grid.querySelectorAll('.project').forEach(card=>card.onclick=()=>openSubject(Number(card.dataset.subject)));
  localStorage.setItem('architecturePortfolioDataV5',JSON.stringify(data));
}
function openSubject(index){
  activeSubject = data.projects[index].name.replace(/<br\/>/g,' ');
  document.getElementById('subjectTitle').textContent = activeSubject;
  selectedImage = ''; document.getElementById('plateForm').reset();
  document.getElementById('imageStatus').textContent = 'No image selected yet.';
  renderPlates(); subjectDialog.showModal();
}
function renderPlates(){
  const plates = data.plates[activeSubject] || [];
  document.getElementById('plateGallery').innerHTML = plates.length ? plates.map((p,i)=>`<article class="plate"><img src="${p.image}" alt="${p.title}"><p>${p.title}</p><button type="button" data-remove="${i}" aria-label="Remove plate">×</button></article>`).join('') : '<p class="empty-gallery">No plates yet. Add your first project below.</p>';
  document.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{data.plates[activeSubject].splice(Number(button.dataset.remove),1);render();renderPlates();});
}
function useImage(file){if(!file || !file.type.startsWith('image/')) return; const reader=new FileReader();reader.onload=()=>{selectedImage=reader.result;document.getElementById('imageStatus').textContent='Image ready to add.'};reader.readAsDataURL(file)}
document.getElementById('plateImage').onchange=e=>useImage(e.target.files[0]);
document.getElementById('pasteZone').addEventListener('paste',e=>{const image=[...e.clipboardData.items].find(item=>item.type.startsWith('image/'));if(image){e.preventDefault();useImage(image.getAsFile())}});
document.getElementById('plateForm').onsubmit=e=>{e.preventDefault();if(!selectedImage){document.getElementById('imageStatus').textContent='Please paste or choose an image first.';return}const title=document.getElementById('plateName').value.trim();(data.plates[activeSubject] ||= []).push({title,image:selectedImage});render();renderPlates();e.target.reset();selectedImage='';document.getElementById('imageStatus').textContent='Plate added.'};
document.getElementById('subjectClose').onclick=()=>subjectDialog.close();
function showEditor(){
  const form=document.getElementById('editorForm');
  ['brand','location','intro','about','email','footer'].forEach(k=>form.elements[k].value=data[k].replace(/<[^>]*>/g,''));
  document.getElementById('projectFields').innerHTML=data.projects.map((p,i)=>`<div class="project-edit"><label>Project ${i+1} title<input name="project-${i}-name" value="${p.name.replace(/<br\/>/g,' ')}"></label><label>Type & year<input name="project-${i}-type" value="${p.type}"></label></div>`).join('');
  if (!dialog.open) dialog.showModal();
}
document.getElementById('editButton').onclick=showEditor;
document.getElementById('editorForm').addEventListener('submit',()=>{const f=document.getElementById('editorForm');['brand','location','intro','about','email','footer'].forEach(k=>data[k]=f.elements[k].value.trim());data.brand=data.brand.replace(/•?$/,'<span>•</span>');data.projects.forEach((p,i)=>{p.name=f.elements[`project-${i}-name`].value.trim().replace(/ /,'<br/>');p.type=f.elements[`project-${i}-type`].value.trim()});render()});
document.getElementById('resetButton').onclick=()=>{data=structuredClone(defaults);render();showEditor()};
render();
