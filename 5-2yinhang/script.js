const loginScreen = document.getElementById('loginScreen');
const verifyScreen = document.getElementById('verifyScreen');
const systemScreen = document.getElementById('systemScreen');
const loginBtn = document.getElementById('loginBtn');
const enterAccountBtn = document.getElementById('enterAccountBtn');
const backVerifyBtn = document.getElementById('backVerifyBtn');
const progressBar = document.getElementById('progressBar');
const verifyStatus = document.getElementById('verifyStatus');
const steps = [...document.querySelectorAll('#verifyList li')];

function showScreen(screen) {
  [loginScreen, verifyScreen, systemScreen].forEach(el => el.classList.remove('active'));
  screen.classList.add('active');
}

function runLogin() {
  loginBtn.disabled = true;
  loginBtn.textContent = '正在登录...';
  showScreen(verifyScreen);
  progressBar.style.width = '0%';
  steps.forEach(step => step.classList.remove('done'));

  const messages = [
    '正在校验操作员身份...',
    '正在验证数字证书...',
    '正在加载账户查询权限...',
    '正在连接资金清算专线...',
    '验证通过，正在进入系统...'
  ];

  let index = 0;
  const timer = setInterval(() => {
    if (index < 4) steps[index].classList.add('done');
    progressBar.style.width = `${Math.min((index + 1) * 24, 100)}%`;
    verifyStatus.textContent = messages[Math.min(index + 1, messages.length - 1)];
    index++;
    if (index >= 5) {
      clearInterval(timer);
      setTimeout(() => {
        showScreen(systemScreen);
        loginBtn.disabled = false;
        loginBtn.textContent = '登 录 系 统';
      }, 450);
    }
  }, 520);
}

loginBtn.addEventListener('click', runLogin);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && loginScreen.classList.contains('active')) runLogin();
});

function switchView(targetId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');
}

if (enterAccountBtn) enterAccountBtn.addEventListener('click', () => switchView('detailView'));
if (backVerifyBtn) backVerifyBtn.addEventListener('click', () => switchView('accountView'));

document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    btn.classList.add('active');
    const map = {
      home: 'homeView',
      customer: 'customerView',
      account: 'accountView',
      settlement: 'settlementView',
      risk: 'riskView'
    };
    switchView(map[btn.dataset.view]);
  });
});
