const asset = (name) => `./assets/avatars/${name}`;

const conversations = [
  { name: "沈栀", preview: "我把最后一版参数调好了，准确率又高了一点。", avatarSrc: asset("shen-zhi.webp"), unread: 3 },
  { name: "陈昊然", preview: "知道了明天就去弄", avatarSrc: asset("male-a.webp"), unread: 1 },
  { name: "林子程", preview: "你发我的那段代码我跑通了，日志也整理好了。", avatarSrc: asset("male-b.webp") },
  { name: "周叙白", preview: "晚上把新数据再过一遍？我这边可以配合你。", avatarSrc: asset("male-c.webp") },
  { name: "张景尧", preview: "资料我发你邮箱了，你看完给我回个话。", avatarSrc: asset("male-d.webp") },
  { name: "李明哲", preview: "论文修改意见我整理好了，待会儿一起对一下。", avatarSrc: asset("male-e.webp") },
  { name: "王嘉树", preview: "明天的会议资料我发群里了，记得看一下。", avatarSrc: asset("male-f.webp") },
  { name: "项目组 (8)", preview: "陈昊然：大家明天十点开会，别迟到哈。", tone: "group", muted: true, members: [asset("male-a.webp"), asset("male-b.webp"), asset("male-c.webp"), asset("male-d.webp")] },
  { name: "订阅号消息", preview: "[36条] 科技前沿：AI 大模型最新进展盘点", avatar: "subscription", unread: 1, href: "./forum.html" },
];

const conversationList = document.querySelector("#conversation-list");
const notice = document.querySelector("#push-notice");
const closeNotice = document.querySelector("#close-notice");
let noticeTimer;

function buildAvatar(item) {
  if (item.tone === "group") {
    return `<span class="list-avatar group"><span class="group-grid">${item.members.map((src) => `<img src="${src}" alt="">`).join("")}</span></span>`;
  }
  if (item.avatar === "subscription") {
    return `<span class="list-avatar subscription"><span class="doc-icon"></span><i></i></span>`;
  }
  return `<span class="list-avatar"><img src="${item.avatarSrc}" alt=""></span>`;
}

function buildMeta(item) {
  if (item.unread) return `<span class="badge">${item.unread}</span>`;
  if (item.muted) return `<span class="muted" aria-label="已静音">🔕</span>`;
  return `<span class="meta-empty"></span>`;
}

conversationList.innerHTML = conversations.map((item) => {
  const tag = item.href ? 'a' : 'button';
  const attrs = item.href ? `href="${item.href}"` : 'type="button"';
  return `<${tag} class="conversation" ${attrs} aria-label="打开${item.name}">
    ${buildAvatar(item)}
    <span class="conversation-copy"><strong>${item.name}</strong><small>${item.preview}</small></span>
    <span class="conversation-meta">${buildMeta(item)}</span>
  </${tag}>`;
}).join("");

function hideNotice() {
  window.clearTimeout(noticeTimer);
  notice.hidden = true;
  notice.setAttribute("aria-hidden", "true");
}

function showNotice() {
  if (!notice || document.hidden) return;
  notice.hidden = false;
  notice.removeAttribute("hidden");
  notice.setAttribute("aria-hidden", "false");
  notice.classList.remove("is-visible");
  void notice.offsetWidth;
  notice.classList.add("is-visible");
}

function scheduleNotice(delay = 1100) {
  hideNotice();
  noticeTimer = window.setTimeout(showNotice, delay);
}

function openArticle() {
  hideNotice();
  window.location.assign("./forum.html");
}

notice?.addEventListener("click", openArticle);
notice?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openArticle();
  }
});
closeNotice?.addEventListener("click", (event) => {
  event.stopPropagation();
  hideNotice();
});
window.addEventListener("pageshow", () => scheduleNotice(1100));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && notice.hidden) scheduleNotice(650);
});
scheduleNotice(1100);
