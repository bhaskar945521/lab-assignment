const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;
const LAB_ROOT = ROOT;
const PORT = process.env.PORT || 5050;

function esc(value = '') {
  return String(value).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
}

function getLabs() {
  if (!fs.existsSync(LAB_ROOT)) return [];
  return fs.readdirSync(LAB_ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && /^Lab-\d+$/i.test(e.name))
    .sort((a,b) => Number(a.name.split('-')[1]) - Number(b.name.split('-')[1]))
    .map(e => {
      const dir = path.join(LAB_ROOT, e.name);
      const json = path.join(dir, 'lab.json');
      if (fs.existsSync(json)) {
        try { return { folder: e.name, ...JSON.parse(fs.readFileSync(json, 'utf8')) }; } catch (_) {}
      }
      return { folder: e.name, labNo: Number(e.name.split('-')[1]), title: e.name, description: 'Node.js laboratory assignment', technologies: ['Node.js'], status: 'Completed', files: fs.readdirSync(dir).filter(f => !f.startsWith('.')) };
    });
}

function json(res, data, status=200) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});
  res.end(JSON.stringify(data));
}

function sendFile(res, file, contentType) {
  if (!fs.existsSync(file)) return json(res, {error:'Not found'},404);
  res.writeHead(200, {'Content-Type': contentType});
  fs.createReadStream(file).pipe(res);
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Node.js Lab Portfolio — Bhaskar Mall</title><style>
:root{--bg:#07111f;--panel:#0d1b2e;--panel2:#10233b;--text:#e8f0fb;--muted:#91a4bd;--accent:#6ee7ff;--accent2:#8b5cf6;--line:#1d3553;--shadow:0 18px 50px #0005}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 15% 0,#17355b 0,#07111f 38%),var(--bg);color:var(--text);font:15px/1.6 Inter,system-ui,-apple-system,Segoe UI,Arial,sans-serif}.wrap{max-width:1180px;margin:auto;padding:28px}.hero{padding:34px 0 22px;display:flex;justify-content:space-between;gap:25px;align-items:end}.eyebrow{color:var(--accent);font-weight:800;letter-spacing:.12em;text-transform:uppercase;font-size:12px}.hero h1{font-size:clamp(32px,5vw,58px);line-height:1.02;margin:8px 0}.hero p{color:var(--muted);max-width:700px;margin:0}.student{background:#ffffff08;border:1px solid var(--line);padding:16px 18px;border-radius:18px;min-width:280px;box-shadow:var(--shadow)}.student b{display:block;font-size:20px}.student span{color:var(--muted)}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:22px 0}.stat,.card{background:linear-gradient(180deg,#10243cdd,#0b192add);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow)}.stat{padding:18px}.stat strong{display:block;font-size:28px}.stat small{color:var(--muted)}.toolbar{display:flex;gap:10px;flex-wrap:wrap;margin:24px 0}.toolbar input,.toolbar button{background:#081626;color:var(--text);border:1px solid var(--line);border-radius:12px;padding:11px 14px}.toolbar input{flex:1;min-width:240px;outline:none}.toolbar button{cursor:pointer}.toolbar button.active{border-color:var(--accent);color:var(--accent)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{padding:20px;display:flex;flex-direction:column;min-height:290px}.num{font-size:12px;color:var(--accent);font-weight:800;letter-spacing:.08em}.card h2{margin:7px 0 9px;font-size:22px}.card p{color:var(--muted);margin:0 0 15px}.tags{display:flex;gap:7px;flex-wrap:wrap;margin:auto 0 18px}.tag{font-size:12px;border:1px solid #294766;border-radius:999px;padding:4px 8px;color:#c4d6eb}.actions{display:flex;gap:8px}.btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;color:#06111e;background:var(--accent);font-weight:800;padding:9px 13px;border-radius:11px;border:0;cursor:pointer}.btn.alt{background:#162a43;color:var(--text);border:1px solid var(--line)}.detail{display:none}.detail.active{display:block}.detailTop{display:flex;justify-content:space-between;gap:20px;align-items:start;margin:25px 0}.detail h2{font-size:36px;margin:4px 0}.back{margin-bottom:15px}.section{background:#0b192a;border:1px solid var(--line);border-radius:18px;padding:20px;margin:13px 0}.section h3{margin-top:0}.section ul{padding-left:20px}.file{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;background:#07111f;border:1px solid #18304b;padding:7px 10px;border-radius:9px;display:inline-block;margin:4px}.shot{max-width:100%;border-radius:14px;border:1px solid var(--line);margin:8px 0}.empty{text-align:center;color:var(--muted);padding:50px}.footer{color:#6f839d;text-align:center;padding:40px 0}.hidden{display:none!important}@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr)}.hero{align-items:start;flex-direction:column}.stats{grid-template-columns:repeat(2,1fr)}}@media(max-width:600px){.wrap{padding:18px}.grid{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}.student{width:100%}}
</style></head><body><main class="wrap"><section id="home"><div class="hero"><div><div class="eyebrow">Node.js Laboratory Portfolio</div><h1>Build. Learn. Run.</h1><p>A live, auto-discovered portfolio of Node.js practicals by Bhaskar Mall. Add a new <b>Lab-XX</b> folder and the dashboard can discover it automatically.</p></div><div class="student"><b>Bhaskar Mall</b><span>BCA · 7th Semester</span><br><span>ID: 23145005 · Subject: Node.js</span></div></div><div class="stats" id="stats"></div><div class="toolbar"><input id="search" placeholder="Search labs, topics, technologies…"><button class="active" data-filter="all">All</button><button data-filter="Completed">Completed</button><button data-filter="Node.js">Node.js</button><button onclick="location.reload()">↻ Refresh</button></div><div class="grid" id="grid"></div></section><section id="detail" class="detail"><button class="btn alt back" onclick="showHome()">← Back to all labs</button><div id="detailContent"></div></section><div class="footer">Node.js Lab Portfolio · Bhaskar Mall · Auto-discovery enabled</div></main><script>
let labs=[];let filter='all';const $=s=>document.querySelector(s);function tags(x){return (x.technologies||[]).map(t=>'<span class="tag">'+t+'</span>').join('')}function render(){let q=$('#search').value.toLowerCase();let list=labs.filter(x=>{let ok=filter==='all'||x.status===filter||(x.technologies||[]).includes(filter);return ok&&JSON.stringify(x).toLowerCase().includes(q)});$('#grid').innerHTML=list.length?list.map(x=>'<article class="card"><div class="num">LAB '+String(x.labNo).padStart(2,'0')+'</div><h2>'+x.title+'</h2><p>'+(x.description||'')+'</p><div class="tags">'+tags(x)+'</div><div class="actions"><button class="btn" onclick="openLab('+x.labNo+')">Open Lab</button><a class="btn alt" href="/api/labs/'+x.labNo+'/files" target="_blank">Files</a></div></article>').join(''):'<div class="empty">No matching labs found.</div>'}function openLab(no){let x=labs.find(a=>a.labNo===no);if(!x)return;let shots=(x.screenshots||[]).map(s=>'<img class="shot" src="/api/labs/'+x.labNo+'/asset/'+encodeURIComponent(s)+'" alt="'+s+'">').join('')||'<p>No screenshot listed for this lab.</p>';let steps=(x.steps||[]).map(s=>'<li>'+s+'</li>').join('');let files=(x.files||[]).map(f=>'<span class="file">'+f+'</span>').join('');$('#home').style.display='none';$('#detail').classList.add('active');$('#detailContent').innerHTML='<div class="detailTop"><div><div class="num">LAB '+String(x.labNo).padStart(2,'0')+'</div><h2>'+x.title+'</h2><p>'+(x.description||'')+'</p></div><div class="tags">'+tags(x)+'</div></div><div class="section"><h3>Objective</h3><p>'+(x.objective||'Practical implementation of Node.js concepts.')+'</p></div><div class="section"><h3>Theory & Concepts</h3><p>'+(x.theory||'See the lab files and README for the complete theory and implementation notes.')+'</p></div><div class="section"><h3>Steps</h3><ol>'+steps+'</ol></div><div class="section"><h3>Files</h3>'+files+'</div><div class="section"><h3>Output / Screenshots</h3>'+shots+'</div><div class="section"><h3>Status</h3><p><b>'+(x.status||'Completed')+'</b></p></div>';window.scrollTo({top:0,behavior:'smooth'})}function showHome(){$('#detail').classList.remove('active');$('#home').style.display='block';window.scrollTo({top:0,behavior:'smooth'})}async function init(){labs=await fetch('/api/labs').then(r=>r.json());let tech=new Set(labs.flatMap(x=>x.technologies||[]));$('#stats').innerHTML='<div class="stat"><strong>'+labs.length+'</strong><small>Total Labs</small></div><div class="stat"><strong>'+labs.filter(x=>x.status==='Completed').length+'</strong><small>Completed</small></div><div class="stat"><strong>'+tech.size+'</strong><small>Technologies / Modules</small></div><div class="stat"><strong>'+labs.reduce((n,x)=>n+(x.files||[]).length,0)+'</strong><small>Project Files</small></div>';render()}$('#search').addEventListener('input',render);document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;render()});init();
</script></body></html>`;

const mime = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.txt':'text/plain; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8'};

const server = http.createServer((req,res)=>{
  const parsed=url.parse(req.url,true);
  if(parsed.pathname==='/') return res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}),res.end(html);
  if(parsed.pathname==='/api/labs') return json(res,getLabs());
  const m=parsed.pathname.match(/^\/api\/labs\/(\d+)\/asset\/(.+)$/);
  if(m){const lab=getLabs().find(x=>x.labNo===Number(m[1])); if(!lab)return json(res,{error:'Lab not found'},404); const file=path.join(LAB_ROOT,lab.folder,decodeURIComponent(m[2])); const safe=path.resolve(file).startsWith(path.resolve(path.join(LAB_ROOT,lab.folder))); if(!safe)return json(res,{error:'Forbidden'},403); return sendFile(res,file,mime[path.extname(file).toLowerCase()]||'application/octet-stream')}
  if(/^\/api\/labs\/\d+\/files$/.test(parsed.pathname)){const no=Number(parsed.pathname.split('/')[3]);const lab=getLabs().find(x=>x.labNo===no);return lab?json(res,{lab:lab.labNo,title:lab.title,files:lab.files||[]}):json(res,{error:'Lab not found'},404)}
  return json(res,{error:'Not found'},404);
});
server.listen(PORT,()=>console.log(`Node.js Lab Portfolio running at http://localhost:${PORT}`));
