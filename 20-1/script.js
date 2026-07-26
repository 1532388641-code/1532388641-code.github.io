const loginScreen = document.getElementById('loginScreen');
const verifyScreen = document.getElementById('verifyScreen');
const appScreen = document.getElementById('appScreen');
const loginBtn = document.getElementById('loginBtn');
const progressBar = document.getElementById('progressBar');
const verifyStatus = document.getElementById('verifyStatus');
const verifyItems = [...document.querySelectorAll('#verifyList li')];
const views = [...document.querySelectorAll('.view')];
const navBtns = [...document.querySelectorAll('.nav-btn')];
const quickBtns = [...document.querySelectorAll('.quick-btn')];
const toDetailBtn = document.getElementById('toDetailBtn');

function showScreen(screen){
  [loginScreen, verifyScreen, appScreen].forEach(el => el.classList.remove('active'));
  screen.classList.add('active');
}

function showView(viewId){
  views.forEach(v => v.classList.toggle('active', v.id === viewId));
  navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.view === viewId));
}

function runLogin(){
  loginBtn.disabled = true;
  loginBtn.textContent = '正在登录...';
  showScreen(verifyScreen);
  progressBar.style.width = '0%';
  verifyItems.forEach(item => item.classList.remove('done'));
  const messages = [
    '正在校验操作员身份...',
    '正在验证数字证书...',
    '正在加载业务权限...',
    '正在连接资金专线...',
    '验证完成，正在进入系统...'
  ];
  let i = 0;
  const timer = setInterval(() => {
    if (i < 4) verifyItems[i].classList.add('done');
    progressBar.style.width = `${Math.min((i + 1) * 24, 100)}%`;
    verifyStatus.textContent = messages[Math.min(i + 1, messages.length - 1)];
    i++;
    if (i >= 5){
      clearInterval(timer);
      setTimeout(() => {
        showScreen(appScreen);
        showView('homeView');
        loginBtn.disabled = false;
        loginBtn.textContent = '登录系统';
      }, 350);
    }
  }, 520);
}

loginBtn.addEventListener('click', runLogin);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && loginScreen.classList.contains('active')) runLogin();
});
navBtns.forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
quickBtns.forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.target)));
toDetailBtn.addEventListener('click', () => showView('accountView'));
