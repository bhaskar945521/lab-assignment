const MAX_LABS = 50;
let labs = [];

async function discoverLabs(){
  const jobs = Array.from({length:MAX_LABS},(_,i)=>{
    const no=String(i+1).padStart(2,'0');
    return fetch(`Lab-${no}/lab.json`,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null);
  });
  const found=(await Promise.all(jobs)).filter(Boolean);
  return found.sort((a,b)=>(a.labNo||999)-(b.labNo||999));
}

function card(lab){
  const chips=(lab.technologies||[]).slice(0,4).map(t=>`<span class="chip">${esc(t)}</span>`).join('');
  return `<article class="lab-card"><div class="lab-top"><span class="lab-no">LAB ${String(lab.labNo).padStart(2,'0')}</span><span class="status">${esc(lab.status||'Completed')}</span></div><h3>${esc(lab.title||'Untitled Lab')}</h3><p>${esc(lab.description||'Node.js practical experiment')}</p><div class="chips">${chips}</div><a class="view" href="lab.html?lab=${encodeURIComponent(lab.folder||`Lab-${String(lab.labNo).padStart(2,'0')}`)}">View Lab →</a></article>`;
}
function esc(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function render(){
  const q=document.getElementById('search').value.toLowerCase().trim();
  const filtered=labs.filter(l=>JSON.stringify(l).toLowerCase().includes(q));
  document.getElementById('labsGrid').innerHTML=filtered.map(card).join('');
  document.getElementById('empty').classList.toggle('hidden',filtered.length>0);
}
(async()=>{
  labs=await discoverLabs();
  document.getElementById('totalLabs').textContent=labs.length;
  document.getElementById('completedLabs').textContent=labs.filter(l=>(l.status||'').toLowerCase()==='completed').length;
  document.getElementById('techCount').textContent=new Set(labs.flatMap(l=>l.technologies||[])).size;
  render();
  document.getElementById('search').addEventListener('input',render);
})();
