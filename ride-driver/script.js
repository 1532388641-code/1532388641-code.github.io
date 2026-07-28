const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (a, b, amount) => a + (b - a) * amount;

const canvas = $('#navCanvas');
const ctx = canvas.getContext('2d');
const stage = $('#mapStage');
const mapImage = new Image();
mapImage.src = './assets/city-map-ai.png';

const WORLD = { width: 945, height: 1680 };
const DURATION = 20000;
const routeDefs = {
  pickup: { km: 2.1, minutes: 6, destination: '艺术学院南门', points: [[454,1327],[465,1270],[482,1205],[501,1138],[520,1060]] },
  normal1: { km: 6.3, minutes: 12, destination: '北城隧道东口', points: [[520,1060],[515,1000],[499,930],[475,850],[449,775],[430,700]] },
  normal2: { km: 3.2, minutes: 8, destination: '星河公寓', points: [[430,700],[416,630],[406,550],[412,470],[436,400],[481,330],[550,260],[650,200],[760,160]] },
  priority1: { km: 5.6, minutes: 12, destination: '星河公寓', points: [[520,1060],[508,990],[485,900],[455,805],[430,700],[411,590],[412,470],[450,375],[520,285],[620,215],[760,160]] },
  priority2: { km: 4.1, minutes: 10, destination: '北城隧道东口', points: [[760,160],[670,190],[585,235],[515,300],[458,375],[420,470],[408,560],[416,630],[430,700]] }
};

const state = {
  phase: 'accepted', digits: '', priority: false, sound: true,
  follow: true, zoom: 1, driving: false, progress: 0,
  route: null, startedAt: 0, pausedAt: 0, hiddenAt: 0,
  current: { x: 454, y: 1327, heading: -1.38 },
  camera: { x: 454, y: 1327, rotation: 0 },
  manual: { x: 454, y: 1327, rotation: 0 }
};

let view = { width: innerWidth, height: innerHeight, ratio: 1, scale: 1, anchorX: innerWidth / 2, anchorY: innerHeight * .43 };
let toastTimer;
const pointers = new Map();
let lastPinchDistance = 0;
let lastPinchMid = null;
let mouseDragging = false;
let mouseLast = null;

function smoothPath(points, steps = 12) {
  const output = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let step = 0; step < steps; step++) {
      const t = step / steps, t2 = t * t, t3 = t2 * t;
      output.push({
        x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2 + (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3),
        y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2 + (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3)
      });
    }
  }
  output.push(points[points.length - 1]);
  return output;
}

function makeRoute(def, customPoints) {
  const rawPoints = (customPoints || def.points).map(([x, y]) => ({ x: x <= 1 ? x * WORLD.width : x, y: y <= 1 ? y * WORLD.height : y }));
  const points = smoothPath(rawPoints);
  const cumulative = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    cumulative.push(total);
  }
  return { ...def, points, cumulative, total };
}

function pointAt(route, progress) {
  const target = clamp(progress, 0, 1) * route.total;
  let index = 1;
  while (index < route.cumulative.length - 1 && route.cumulative[index] < target) index++;
  const start = route.points[index - 1];
  const end = route.points[index];
  const startDistance = route.cumulative[index - 1];
  const segmentLength = Math.max(1, route.cumulative[index] - startDistance);
  const local = clamp((target - startDistance) / segmentLength, 0, 1);
  return { x: lerp(start.x, end.x, local), y: lerp(start.y, end.y, local), heading: Math.atan2(end.y - start.y, end.x - start.x), index, local };
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1500);
}

function syncModalLock() {
  const modalOpen = Boolean(document.querySelector('.modal-layer.is-open'));
  document.body.classList.toggle('modal-open', modalOpen);
  $('#mapStage').toggleAttribute('inert', modalOpen);
  $('#orderSheet').toggleAttribute('inert', modalOpen);
}

function openModal(id) {
  const modal = typeof id === 'string' ? document.getElementById(id) : id;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  syncModalLock();
}

function closeModal(id) {
  const modal = typeof id === 'string' ? document.getElementById(id) : id;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  syncModalLock();
}

function resizeCanvas() {
  const rect = stage.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  const sheetTop = $('#orderSheet').getBoundingClientRect().top;
  view = {
    width: rect.width, height: rect.height, ratio,
    scale: Math.max(rect.width / WORLD.width, rect.height / WORLD.height) * (rect.width >= 600 ? 2.18 : 1.58) * state.zoom,
    anchorX: rect.width / 2,
    anchorY: Math.min(rect.height * .43, sheetTop - 48)
  };
  $('#fixedVehicle').style.left = `${view.anchorX}px`;
  $('#fixedVehicle').style.top = `${view.anchorY}px`;
}

function roundedLabel(text, x, y, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.font = `${11 / view.scale}px Microsoft YaHei`;
  const width = ctx.measureText(text).width + 10 / view.scale;
  const height = 20 / view.scale;
  ctx.fillStyle = '#f8f8f1d9';
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.fillStyle = '#75818b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

function drawPin(point, label, color = '#1677ff') {
  const r = 15 / view.scale;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(0, 0, r + 3 / view.scale, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `800 ${12 / view.scale}px Microsoft YaHei`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0);
  ctx.restore();
}

function drawVehicle(point) {
  const size = 18 / view.scale;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(point.heading + Math.PI / 2);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, size * .9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#173a63';
  ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(size * .62, size * .75); ctx.lineTo(0, size * .48); ctx.lineTo(-size * .62, size * .75); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function traceRoute(route, until = 1) {
  if (!route) return;
  const endDistance = route.total * until;
  ctx.beginPath();
  ctx.moveTo(route.points[0].x, route.points[0].y);
  for (let i = 1; i < route.points.length; i++) {
    const segStart = route.cumulative[i - 1];
    const segEnd = route.cumulative[i];
    if (segEnd <= endDistance) ctx.lineTo(route.points[i].x, route.points[i].y);
    else if (segStart < endDistance) {
      const t = (endDistance - segStart) / (segEnd - segStart);
      ctx.lineTo(lerp(route.points[i - 1].x, route.points[i].x, t), lerp(route.points[i - 1].y, route.points[i].y, t));
      break;
    } else break;
  }
}

function renderMap() {
  ctx.setTransform(view.ratio, 0, 0, view.ratio, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  const followRotation = -Math.PI / 2 - state.current.heading;
  const targetCenter = state.follow ? state.current : state.manual;
  const targetRotation = state.follow ? followRotation : state.manual.rotation;
  state.camera.x = lerp(state.camera.x, targetCenter.x, state.follow ? .11 : .25);
  state.camera.y = lerp(state.camera.y, targetCenter.y, state.follow ? .11 : .25);
  let diff = targetRotation - state.camera.rotation;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  state.camera.rotation += diff * .1;

  const anchorX = state.follow ? view.anchorX : view.width / 2;
  const anchorY = state.follow ? view.anchorY : view.height / 2;
  ctx.save();
  ctx.translate(anchorX, anchorY);
  ctx.rotate(state.camera.rotation);
  ctx.scale(view.scale, view.scale);
  ctx.translate(-state.camera.x, -state.camera.y);

  if (mapImage.complete && mapImage.naturalWidth) ctx.drawImage(mapImage, 0, 0, WORLD.width, WORLD.height);
  else { ctx.fillStyle = '#e4e7df'; ctx.fillRect(0, 0, WORLD.width, WORLD.height); }

  roundedLabel('松江路', WORLD.width * .28, WORLD.height * .62, -.12);
  roundedLabel('北城大道', WORLD.width * .56, WORLD.height * .47, .35);
  roundedLabel('滨河路', WORLD.width * .82, WORLD.height * .49, 1.48);

  if (state.route) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    traceRoute(state.route, 1); ctx.strokeStyle = '#fff'; ctx.lineWidth = 13 / view.scale; ctx.stroke();
    traceRoute(state.route, 1); ctx.strokeStyle = '#1677ff'; ctx.lineWidth = 7 / view.scale; ctx.stroke();
    if (state.progress > 0) { traceRoute(state.route, state.progress); ctx.strokeStyle = '#aeb7bf'; ctx.lineWidth = 7 / view.scale; ctx.stroke(); }
    drawPin(state.route.points[state.route.points.length - 1], state.phase.includes('pickup') ? '接' : '终');
  } else {
    const preview = makeRoute(routeDefs.pickup);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    traceRoute(preview, 1); ctx.strokeStyle = '#fff'; ctx.lineWidth = 13 / view.scale; ctx.stroke();
    traceRoute(preview, 1); ctx.strokeStyle = '#1677ff'; ctx.lineWidth = 7 / view.scale; ctx.stroke();
    drawPin(preview.points[preview.points.length - 1], '接');
  }
  if (!state.follow) drawVehicle(state.current);
  ctx.restore();

  $('#fixedVehicle').classList.toggle('is-map-mode', !state.follow);
  $('#freeView').classList.toggle('show', !state.follow);
  $('#recenterButton').classList.toggle('active', !state.follow);
}

function distanceText(km) {
  if (km < 1) return `${Math.max(10, Math.round(km * 1000 / 10) * 10)}米`;
  return `${km.toFixed(1)}公里`;
}

function instructionFor(progress) {
  if (progress < .22) return ['沿当前道路直行', '↑', '保持当前车道'];
  if (progress < .52) return ['前方路口右转', '↱', '保持右侧车道'];
  if (progress < .82) return ['进入北城大道', '↗', '沿主路继续行驶'];
  return ['目的地在道路右侧', '◎', '注意提前减速'];
}

function updateDrivingUI() {
  if (!state.route) return;
  const remaining = state.route.km * (1 - state.progress);
  const minutes = Math.max(1, Math.ceil(state.route.minutes * (1 - state.progress)));
  const [instruction, icon, lane] = instructionFor(state.progress);
  $('#navInstruction').textContent = state.driving ? instruction : `已到达${state.route.destination}附近`;
  $('#turnIcon').textContent = state.driving ? icon : '◎';
  $('#navDistance').textContent = state.driving ? distanceText(remaining) : '已到达';
  $('#navTime').textContent = state.driving ? `预计${minutes}分钟到达` : '请确认乘客状态';
  $('#laneHint').textContent = state.driving ? lane : '已到达目的地附近';
  $('#roadName').textContent = state.progress < .48 ? '松江路' : '北城大道';
}

function startRoute(def) {
  state.route = makeRoute(def);
  state.progress = 0;
  state.current = pointAt(state.route, 0);
  state.camera.x = state.current.x; state.camera.y = state.current.y;
  state.driving = true;
  state.startedAt = performance.now();
  state.pausedAt = 0;
  state.follow = true;
  state.zoom = 1;
  updateDrivingUI();
}

function finishRoute() {
  if (!state.route) return;
  state.progress = 1;
  state.current = pointAt(state.route, 1);
  state.driving = false;
  updateDrivingUI();
}

function animate(time) {
  if (state.driving && !document.hidden) {
    state.progress = clamp((time - state.startedAt) / DURATION, 0, 1);
    state.current = pointAt(state.route, state.progress);
    if (state.progress >= 1) state.driving = false;
    updateDrivingUI();
  }
  renderMap();
  requestAnimationFrame(animate);
}

function resetVerification() {
  state.digits = '';
  $('#verifyError').textContent = '';
  $('#verifyForm').style.display = '';
  $('#verifySuccess').classList.remove('is-visible');
  $$('#digitBoxes span').forEach((box) => { box.textContent = ''; box.classList.remove('filled'); });
}

function renderDigits() {
  $$('#digitBoxes span').forEach((box, index) => {
    box.textContent = state.digits[index] || '';
    box.classList.toggle('filled', Boolean(state.digits[index]));
  });
}

function handleKey(key) {
  if (key === 'back') { state.digits = state.digits.slice(0, -1); $('#verifyError').textContent = ''; renderDigits(); return; }
  if (state.digits.length >= 4) return;
  state.digits += key; renderDigits();
  if (state.digits.length !== 4) return;
  if (state.digits !== '0513') {
    $('#verifyError').textContent = '手机尾号不正确，请重新确认';
    setTimeout(() => { state.digits = ''; renderDigits(); }, 650);
    return;
  }
  $('#verifyForm').style.display = 'none';
  $('#verifySuccess').classList.add('is-visible');
  setTimeout(() => {
    closeModal('verifyModal');
    state.phase = 'ready';
    $('#primaryAction').textContent = '乘客已上车 · 开始行程';
    $('#orderEyebrow').textContent = '接驾完成 · 拼车订单 · 2位乘客';
    $('#orderTitle').textContent = '尾号验证成功，准备出发';
    $('#passengerStatus').textContent = '丁磊 · 已核验上车';
    renderStops();
  }, 800);
}

function stopMarkup(type, title, subtitle, time, active = false) {
  return `<div class="stop ${active ? 'active' : ''}"><i class="${type === 'square' ? 'square' : ''}"></i><div><small>${active ? '当前任务' : '后续站点'}</small><strong>${title}</strong><p>${subtitle}</p></div><b>${time}</b></div>`;
}

function renderStops() {
  let html = '';
  if (state.phase === 'accepted' || state.phase === 'pickup-driving' || state.phase === 'ready') {
    html = stopMarkup('circle','松江路88号 · 艺术学院南门','丁磊 · 尾号0513','2分钟',true) + '<div class="stop-line blue"></div>' + stopMarkup('square','北城隧道东口','丁磊 · 第1位送达','12分钟') + '<div class="stop-line"></div>' + stopMarkup('circle','星河公寓','李刚 · 第2位送达','18分钟');
  } else if (state.priority) {
    html = stopMarkup('circle','星河公寓','李刚 · 加价¥5优先送达','12分钟',state.phase === 'trip1') + '<div class="stop-line blue"></div>' + stopMarkup('square','北城隧道东口','丁磊 · 随后送达','20分钟',state.phase === 'trip2');
  } else {
    html = stopMarkup('square','北城隧道东口','丁磊 · 第1位送达','12分钟',state.phase === 'trip1') + '<div class="stop-line blue"></div>' + stopMarkup('circle','星河公寓','李刚 · 第2位送达','18分钟',state.phase === 'trip2');
  }
  $('#stopsList').innerHTML = html;
}

function beginTrip1() {
  state.phase = 'trip1';
  startRoute(state.priority ? routeDefs.priority1 : routeDefs.normal1);
  $('#orderEyebrow').textContent = '行程中 · 拼车订单 · 2位乘客';
  $('#orderTitle').textContent = state.priority ? '正在优先送李刚' : '正在送第1位乘客';
  $('#passengerStatus').textContent = '丁磊、李刚 · 均已上车';
  $('#primaryAction').textContent = state.priority ? '到达星河公寓' : '到达北城隧道东口';
  $('#platformNote').textContent = state.priority ? '已收到乘客加价¥5，路线已调整。' : '请按平台规划顺序送达两位乘客。';
  renderStops();
}

function beginTrip2() {
  state.phase = 'trip2';
  startRoute(state.priority ? routeDefs.priority2 : routeDefs.normal2);
  $('#orderTitle').textContent = '正在送最后1位乘客';
  $('#primaryAction').textContent = state.priority ? '到达北城隧道东口' : '到达星河公寓';
  renderStops();
}

function applyPriority() {
  if (state.phase === 'trip2' || state.phase === 'complete') { closeModal('messageModal'); showToast('当前行程顺序已确认'); return; }
  state.priority = true;
  $('#fareText').textContent = '预估¥28.60';
  $('#finalIncome').textContent = '¥28.60';
  $('#platformNote').textContent = '已收到乘客加价¥5，路线将优先送李刚。';
  if (state.phase === 'trip1') beginTrip1();
  renderStops(); closeModal('messageModal'); showToast('已切换优先送达路线');
}

$('#primaryAction').addEventListener('click', () => {
  if (state.phase === 'accepted') {
    state.phase = 'pickup-driving'; startRoute(routeDefs.pickup);
    $('#orderEyebrow').textContent = '接驾中 · 拼车订单 · 2位乘客';
    $('#orderTitle').textContent = '正在前往乘客上车点';
    $('#primaryAction').textContent = '我已到达上车点';
    renderStops(); showToast('接驾导航已开始');
  } else if (state.phase === 'pickup-driving') {
    finishRoute(); resetVerification(); openModal('verifyModal');
  } else if (state.phase === 'ready') beginTrip1();
  else if (state.phase === 'trip1') {
    finishRoute(); state.phase = 'between';
    $('#orderTitle').textContent = state.priority ? '李刚已送达' : '丁磊已送达';
    $('#primaryAction').textContent = '继续送第2位乘客'; renderStops();
  } else if (state.phase === 'between') beginTrip2();
  else if (state.phase === 'trip2') {
    finishRoute(); state.phase = 'complete'; state.driving = false;
    $('#orderEyebrow').textContent = '行程结束 · 两位乘客均已送达';
    $('#orderTitle').textContent = '订单已完成';
    $('#primaryAction').textContent = '查看本单收入';
    openModal('completeModal');
  } else if (state.phase === 'complete') openModal('completeModal');
});

$('#keypad').addEventListener('click', (event) => { if (event.target.dataset.key !== undefined) handleKey(event.target.dataset.key); });
$$('[data-close]').forEach((button) => button.addEventListener('click', () => closeModal(button.dataset.close)));
$$('.modal-layer').forEach((modal) => modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); }));

$('#audioButton').addEventListener('click', () => {
  state.sound = !state.sound;
  $('#audioButton').classList.toggle('is-on', state.sound);
  $('#audioButton').setAttribute('aria-label', state.sound ? '关闭语音导航' : '开启语音导航');
  showToast(state.sound ? '语音导航已开启' : '语音导航已关闭');
});

$('#callButton').addEventListener('click', () => openModal('callModal'));
$('#dialButton').addEventListener('click', () => { closeModal('callModal'); showToast('正在使用虚拟号码呼叫丁磊…'); });
$('#messageButton').addEventListener('click', () => openModal('messageModal'));
$('#keepRoute').addEventListener('click', () => { closeModal('messageModal'); showToast('继续按平台路线行驶'); });
$('#priorityRoute').addEventListener('click', applyPriority);
$$('[data-reply]').forEach((button) => button.addEventListener('click', () => { closeModal('messageModal'); showToast(`已发送：${button.dataset.reply}`); }));
$('#resetButton').addEventListener('click', () => location.reload());

function setZoom(next) { state.zoom = clamp(next, .78, 1.55); resizeCanvas(); }
$('#zoomInButton').addEventListener('click', () => setZoom(state.zoom + .12));
$('#zoomOutButton').addEventListener('click', () => setZoom(state.zoom - .12));
$('#recenterButton').addEventListener('click', () => {
  const restoreFollow = () => {
    mouseDragging = false;
    mouseLast = null;
    pointers.clear();
    state.follow = true;
    state.zoom = 1;
    $('#fixedVehicle').classList.remove('is-map-mode');
    $('#freeView').classList.remove('show');
    $('#recenterButton').classList.remove('active');
    resizeCanvas();
  };
  restoreFollow();
  setTimeout(restoreFollow, 80);
  showToast('已恢复车头朝上跟随');
});

function enterFreeMode() {
  if (!state.follow) return;
  state.follow = false;
  state.manual.x = state.camera.x; state.manual.y = state.camera.y; state.manual.rotation = state.camera.rotation;
}

function panBy(dx, dy) {
  enterFreeMode();
  const scale = view.scale;
  const cos = Math.cos(-state.manual.rotation), sin = Math.sin(-state.manual.rotation);
  const worldDx = (cos * dx - sin * dy) / scale;
  const worldDy = (sin * dx + cos * dy) / scale;
  state.manual.x = clamp(state.manual.x - worldDx, 0, WORLD.width);
  state.manual.y = clamp(state.manual.y - worldDy, 0, WORLD.height);
}

stage.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button') || event.target.closest('.navigation-card') || event.target.closest('.road-progress')) return;
  stage.setPointerCapture(event.pointerId);
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 2) {
    const [a,b] = [...pointers.values()];
    lastPinchDistance = Math.hypot(a.x-b.x,a.y-b.y);
    lastPinchMid = { x:(a.x+b.x)/2, y:(a.y+b.y)/2 };
  }
});

stage.addEventListener('pointermove', (event) => {
  const previous = pointers.get(event.pointerId);
  if (!previous) return;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  if (pointers.size === 1) panBy(event.clientX - previous.x, event.clientY - previous.y);
  else if (pointers.size === 2) {
    enterFreeMode();
    const [a,b] = [...pointers.values()];
    const distance = Math.hypot(a.x-b.x,a.y-b.y);
    const mid = { x:(a.x+b.x)/2, y:(a.y+b.y)/2 };
    if (lastPinchDistance) setZoom(state.zoom * distance / lastPinchDistance);
    if (lastPinchMid) panBy(mid.x-lastPinchMid.x, mid.y-lastPinchMid.y);
    lastPinchDistance = distance; lastPinchMid = mid;
  }
});

function releasePointer(event) {
  pointers.delete(event.pointerId);
  if (pointers.size < 2) { lastPinchDistance = 0; lastPinchMid = null; }
}
stage.addEventListener('pointerup', releasePointer);
stage.addEventListener('pointercancel', releasePointer);
stage.addEventListener('wheel', (event) => { event.preventDefault(); enterFreeMode(); setZoom(state.zoom + (event.deltaY < 0 ? .1 : -.1)); }, { passive:false });

stage.addEventListener('mousedown', (event) => {
  if (pointers.size || event.target.closest('button') || event.target.closest('.navigation-card') || event.target.closest('.road-progress')) return;
  mouseDragging = true;
  mouseLast = { x: event.clientX, y: event.clientY };
});
window.addEventListener('mousemove', (event) => {
  if (!mouseDragging || pointers.size || !mouseLast) return;
  panBy(event.clientX - mouseLast.x, event.clientY - mouseLast.y);
  mouseLast = { x: event.clientX, y: event.clientY };
});
window.addEventListener('mouseup', () => { mouseDragging = false; mouseLast = null; });

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.driving) state.hiddenAt = performance.now();
  else if (state.hiddenAt && state.driving) { state.startedAt += performance.now() - state.hiddenAt; state.hiddenAt = 0; }
});
window.addEventListener('resize', resizeCanvas);
mapImage.addEventListener('load', resizeCanvas);

renderStops();
resizeCanvas();
requestAnimationFrame(animate);
