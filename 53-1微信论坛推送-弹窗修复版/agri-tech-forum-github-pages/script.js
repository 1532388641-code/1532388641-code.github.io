const asset = (name) => `./assets/avatars/${name}`;

const conversations = [
  { name: "文件传输助手", preview: "system-audit_0718.log", time: "22:18", avatar: "↗", tone: "green", unread: 0 },
  { name: "沈栀", preview: "你那边还好吗？", time: "22:17", avatarSrc: asset("shen-zhi.webp"), tone: "photo", unread: 0 },
  { name: "智能系统实验室", preview: "季教授：今晚先停掉测试环境", time: "22:08", tone: "group", unread: 4, members: [asset("professor.webp"), asset("fu-shinian.webp"), asset("student-male.webp"), asset("student-female.webp")] },
  { name: "助学金系统测试组", preview: "[12条] RULE-07 的日志谁在看？", time: "21:56", tone: "group", unread: 12, members: [asset("fu-shinian.webp"), asset("student-female.webp"), asset("student-male.webp"), asset("professor.webp")] },
  { name: "季教授", preview: "上线评审改到明天下午", time: "21:43", avatarSrc: asset("professor.webp"), tone: "photo", unread: 0 },
  { name: "算法课题组", preview: "傅时年：模型权重已经重新跑完", time: "20:31", tone: "group", unread: 3, members: [asset("student-male.webp"), asset("fu-shinian.webp"), asset("professor.webp"), asset("student-female.webp")] },
  { name: "许峻", preview: "接口文档已经发你邮箱了", time: "20:08", avatarSrc: asset("student-male.webp"), tone: "photo", unread: 0 },
  { name: "工业大学技术协会", preview: "[5条] 周五安全技术分享会安排", time: "19:45", tone: "group", unread: 5, members: [asset("student-female.webp"), asset("professor.webp"), asset("student-male.webp"), asset("fu-shinian.webp")] },
  { name: "软件工程 2023级", preview: "[8条] 班长：实验报告今晚截止", time: "18:22", tone: "group", unread: 8, members: [asset("student-female.webp"), asset("shen-zhi.webp"), asset("fu-shinian.webp"), asset("student-male.webp")] },
  { name: "深度学习竞赛组", preview: "训练结果已同步到共享目录", time: "昨天", tone: "group", unread: 0, members: [asset("fu-shinian.webp"), asset("student-male.webp"), asset("student-female.webp"), asset("professor.webp")] },
];

const totalUnread = conversations.reduce((sum, item) => sum + item.unread, 0);
const conversationList = document.querySelector("#conversation-list");
const titleUnread = document.querySelector("#title-unread");
const tabUnread = document.querySelector("#tab-unread");
const chatScreen = document.querySelector("#chat-screen");
const articleScreen = document.querySelector("#article-screen");
const notice = document.querySelector("#push-notice");
const closeNotice = document.querySelector("#close-notice");
const backButton = document.querySelector("#back-to-wechat");
let noticeTimer;

titleUnread.textContent = `(${totalUnread})`;
tabUnread.textContent = totalUnread;

conversationList.innerHTML = conversations.map((item) => {
  const avatar = item.members
    ? `<span class="group-grid">${item.members.map((src) => `<img src="${src}" alt="">`).join("")}</span>`
    : item.avatarSrc
      ? `<img src="${item.avatarSrc}" alt="">`
      : item.avatar;
  const unread = item.unread ? `<b>${item.unread}</b>` : "";

  return `<button class="conversation" type="button" aria-label="打开与${item.name}的会话">
    <span class="list-avatar ${item.tone}">${avatar}${unread}</span>
    <span class="conversation-copy"><strong>${item.name}</strong><small>${item.preview}</small></span>
    <time>${item.time}</time>
  </button>`;
}).join("");

function hideNotice() {
  window.clearTimeout(noticeTimer);
  notice.hidden = true;
  notice.setAttribute("aria-hidden", "true");
}

function showNotice() {
  if (!notice || chatScreen.hidden || document.hidden) return;
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
  chatScreen.hidden = true;
  articleScreen.hidden = false;
}

function openWechat() {
  articleScreen.hidden = true;
  chatScreen.hidden = false;
  scheduleNotice();
}

notice.addEventListener("click", openArticle);
notice.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openArticle();
  }
});
closeNotice.addEventListener("click", (event) => {
  event.stopPropagation();
  hideNotice();
});
backButton.addEventListener("click", openWechat);

function bootNotice() {
  if (!articleScreen.hidden) return;
  scheduleNotice(1100);
}

window.addEventListener("pageshow", bootNotice);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden && !articleScreen.hidden && notice.hidden) {
    scheduleNotice(650);
  }
});
document.addEventListener("keydown", (event) => {
  if ((event.key === "p" || event.key === "P") && !chatScreen.hidden) {
    showNotice();
  }
});

bootNotice();
