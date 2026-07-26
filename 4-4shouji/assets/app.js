
const eyeBtn = document.getElementById('eyeBtn');
const total = document.getElementById('totalProfit');
const principal = document.getElementById('principal');
const equity = document.getElementById('equity');
let hidden = false;

function maskMoney(text){
  return text.replace(/[0-9]/g,'•');
}
if (eyeBtn && total && principal && equity) {
  const real = {
    total: total.textContent,
    principal: principal.textContent,
    equity: equity.textContent
  };
  eyeBtn.addEventListener('click', ()=>{
    hidden = !hidden;
    if(hidden){
      total.textContent = maskMoney(real.total);
      principal.textContent = maskMoney(real.principal);
      equity.textContent = maskMoney(real.equity);
      eyeBtn.textContent = '显示';
    }else{
      total.textContent = real.total;
      principal.textContent = real.principal;
      equity.textContent = real.equity;
      eyeBtn.textContent = '隐藏';
    }
  });
}
