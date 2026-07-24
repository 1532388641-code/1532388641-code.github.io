
const money = document.getElementById('balanceAmount');
const eye = document.getElementById('eyeBtn');
let hidden = false;

if (eye && money) {
  eye.addEventListener('click', () => {
    hidden = !hidden;
    money.innerHTML = hidden
      ? '<span class="currency">¥</span>••••••••'
      : '<span class="currency">¥</span>7,200,000.00';
    eye.textContent = hidden ? '显示' : '隐藏';
  });
}

const notice = document.getElementById('largeNewsNotice');

function showNewsNotice(){
  if(notice) notice.classList.add('show');
}
function closeNewsNotice(){
  if(notice) notice.classList.remove('show');
}
window.showNewsNotice = showNewsNotice;
window.closeNewsNotice = closeNewsNotice;

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(showNewsNotice, 5000);
});
