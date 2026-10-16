(() => {
 const url=window.SPARK_SUPABASE_URL,key=window.SPARK_SUPABASE_ANON_KEY;
 if(!url||!key||url.includes('PASTE_')||key.includes('PASTE_')) return;
 const sb=window.supabase.createClient(url,key);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function render(table,id,kind){const root=document.getElementById(id);if(!root)return;const {data,error}=await sb.from(table).select('*').order('created_at',{ascending:false}).limit(50);if(error){root.innerHTML='<p class="admin-status">تعذر تحميل المحتوى. تأكد من إعداد Supabase والجداول والصلاحيات.</p>';return;}if(!data?.length)return;root.innerHTML='<div class="grid">'+data.map(x=>{const title=x.title||'';const sub=x.role||x.category||x.subject||'';const desc=x.description||x.body||'';const img=x.image_url;return `<article class="card" style="background:#10182b;border:1px solid #263653;border-radius:14px;padding:18px;margin:10px 0">${img?`<img src="${esc(img)}" alt="" style="max-width:100%;max-height:240px;object-fit:cover;border-radius:10px">`:''}<h2>${esc(title)}</h2>${sub?`<p class="eyebrow">${esc(sub)}</p>`:''}<p>${esc(desc)}</p></article>`}).join('')+'</div>';
 if(table==='members'){const placeholder=document.querySelector('.member-placeholder');if(placeholder)placeholder.style.display='none';}
}
 render('members','dynamic-members','members');render('games','dynamic-games','games');render('announcements','dynamic-announcements','announcements');
})();
