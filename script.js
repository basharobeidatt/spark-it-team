
const sidebar=document.getElementById('sidebar');
const mobileToggle=document.getElementById('mobileToggle');
const langBtn=document.getElementById('langBtn');
let currentLang=localStorage.getItem('spark-language') || 'en';
if(mobileToggle && sidebar) mobileToggle.addEventListener('click',()=>{const isOpen=sidebar.classList.toggle('open');mobileToggle.setAttribute('aria-expanded',String(isOpen));});
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>{sidebar.classList.remove('open');if(mobileToggle)mobileToggle.setAttribute('aria-expanded','false');}));
if(sidebar) document.addEventListener('keydown',e=>{if(e.key==='Escape'){sidebar.classList.remove('open');if(mobileToggle)mobileToggle.setAttribute('aria-expanded','false');}});
// Close the sidebar when clicking outside it.
document.addEventListener('click',e=>{if(sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !mobileToggle.contains(e.target)){sidebar.classList.remove('open');if(mobileToggle)mobileToggle.setAttribute('aria-expanded','false');}});
function setLanguage(lang){
 currentLang=lang; localStorage.setItem('spark-language',lang); document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 document.querySelectorAll('[data-en][data-ar]').forEach(el=>el.innerHTML=el.dataset[lang]);
 if(langBtn)langBtn.textContent=lang==='en'?'العربية':'English';
}
if(langBtn)langBtn.addEventListener('click',()=>setLanguage(currentLang==='en'?'ar':'en'));
// Apply the saved language on every page load.
setLanguage(currentLang);
document.querySelectorAll('form[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault(); const n=form.querySelector('.notice'); if(n){n.style.display='block';n.textContent=currentLang==='en'?'Demo only: no information was sent or saved yet. We will connect Supabase before publishing.':'هذه معاينة فقط؛ لم يتم إرسال أو حفظ أي معلومات. سنربط Supabase قبل النشر.';}
}));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
