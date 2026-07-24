
let floor = document.querySelectorAll('.comment').length;
let idx = 0;
let pending = 0;
const list = document.getElementById('commentList');
const toast = document.getElementById('newToast');
const total = document.getElementById('commentTotal');
const reply = document.getElementById('replyCount');
const views = document.getElementById('viewCount');
const liveText = document.getElementById('liveText');
const colors = [18,44,76,112,146,184,218,252,286,322];

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function nearComments(){
  const r=document.getElementById('comments').getBoundingClientRect();
  return r.top < innerHeight*0.74;
}
function addComment(data){
  floor++;
  const el=document.createElement('div');
  el.className='comment';
  const hue=colors[floor%colors.length];
  el.innerHTML=`<div class="avatar" style="background:linear-gradient(145deg,hsl(${hue} 45% 48%),hsl(${hue+35} 45% 34%))">${esc(data.name[0])}</div>
  <div><div class="comment-head"><span class="comment-name">${esc(data.name)}</span>${data.badge?'<span class="badge mod">版务</span>':''}<span class="comment-time">刚刚</span><span class="floor">${floor}L</span></div>
  <div class="comment-text">${esc(data.text)}</div><div class="comment-actions"><span>👍 ${data.like||0}</span><span>回复</span><span>举报</span></div></div>`;
  list.appendChild(el);
  total.textContent=floor; reply.textContent=floor;
  const v=parseInt(views.textContent.replace(/,/g,''),10)+Math.floor(Math.random()*18+7);
  views.textContent=v.toLocaleString('zh-CN');
  if(nearComments()){
    el.scrollIntoView({behavior:'smooth',block:'center'});
    pending=0; toast.classList.remove('show');
  }else{
    pending++; document.getElementById('newCount').textContent=pending; toast.classList.add('show');
  }
}
function tick(){
  if(idx>=window.DYNAMIC_COMMENTS.length){liveText.textContent='本轮刷新完成';return}
  addComment(window.DYNAMIC_COMMENTS[idx++]);
  setTimeout(tick, 850 + Math.random()*650);
}
window.focusComments=function(){
  document.getElementById('comments').scrollIntoView({behavior:'smooth',block:'start'});
  pending=0;toast.classList.remove('show');
}
document.addEventListener('DOMContentLoaded',()=>{
  const shot=new URLSearchParams(location.search).get('shot');
  if(shot==='comments') setTimeout(()=>focusComments(),700);
  setTimeout(tick,1800);
});
