"use client";

import { useMemo, useState } from "react";

type View = "dashboard" | "children" | "mail" | "monitor" | "logs" | "evidence";
type ChildRecord = {
  id: string;
  name: string;
  gender: "女" | "男";
  age: number;
  grade: string;
  location: string;
  guardian: string;
  family: string;
  income: number;
  workers: number;
  distance: string;
  rank: string;
  status: "匹配成功" | "异常拒绝";
  company?: string;
  sheet: "a" | "b" | "c";
  photoIndex: number;
};

const children: ChildRecord[] = [
  { id: "GZ-2026-0417", name: "李小雨", gender: "女", age: 14, grade: "初二", location: "黔云省青禾苗族自治州", guardian: "祖母 李桂兰", family: "父母双亡，与奶奶共同生活", income: 2860, workers: 3, distance: "每日步行十一里", rank: "年级第 3 名", status: "匹配成功", company: "深蓝科技", sheet: "a", photoIndex: 0 },
  { id: "GZ-2026-0418", name: "杨竹青", gender: "女", age: 13, grade: "初一", location: "黔云省云桥县", guardian: "父亲 杨守福", family: "父亲务农，母亲长期患病", income: 3180, workers: 4, distance: "8.6 公里", rank: "年级第 8 名", status: "异常拒绝", sheet: "a", photoIndex: 1 },
  { id: "YN-2026-0182", name: "周阿木", gender: "男", age: 15, grade: "初三", location: "云岭省昭河县", guardian: "祖父 周有才", family: "父母外出失联，与祖父母生活", income: 2730, workers: 3, distance: "6.2 公里", rank: "年级第 12 名", status: "异常拒绝", sheet: "a", photoIndex: 2 },
  { id: "GX-2026-0921", name: "韦小晴", gender: "女", age: 12, grade: "初一", location: "桂川省河清族自治县", guardian: "母亲 韦秀珍", family: "单亲家庭，母亲季节性务工", income: 3010, workers: 3, distance: "4.9 公里", rank: "班级第 2 名", status: "异常拒绝", sheet: "a", photoIndex: 3 },
  { id: "SC-2026-0674", name: "何嘉树", gender: "男", age: 14, grade: "初二", location: "川南省凉谷自治州", guardian: "祖母 阿依曲木", family: "父亲病故，母亲外出务工", income: 3340, workers: 5, distance: "7.1 公里", rank: "年级第 19 名", status: "异常拒绝", sheet: "a", photoIndex: 4 },
  { id: "GZ-2026-0442", name: "吴苗苗", gender: "女", age: 14, grade: "初二", location: "黔云省紫溪县", guardian: "母亲 吴玉梅", family: "低保家庭，母亲独自抚养三名子女", income: 2610, workers: 4, distance: "5.4 公里", rank: "年级第 6 名", status: "异常拒绝", sheet: "a", photoIndex: 5 },
  { id: "CQ-2026-0316", name: "谭长河", gender: "男", age: 13, grade: "初一", location: "渝州市彭河县", guardian: "父亲 谭兴国", family: "父亲残疾，祖母照料", income: 2950, workers: 3, distance: "3.8 公里", rank: "班级第 5 名", status: "异常拒绝", sheet: "a", photoIndex: 6 },
  { id: "HN-2026-0528", name: "龙星月", gender: "女", age: 15, grade: "初三", location: "湘林省西岭自治州", guardian: "祖父 龙大勇", family: "父母离异，均无固定联系", income: 3210, workers: 3, distance: "9.2 公里", rank: "年级第 11 名", status: "异常拒绝", sheet: "a", photoIndex: 7 },
  { id: "YN-2026-0214", name: "赵小川", gender: "男", age: 12, grade: "初一", location: "云岭省怒水县", guardian: "母亲 赵春花", family: "母亲务农，父亲因病失去劳动能力", income: 2490, workers: 5, distance: "6.7 公里", rank: "班级第 7 名", status: "异常拒绝", sheet: "a", photoIndex: 8 },
  { id: "GZ-2026-0471", name: "蒋禾", gender: "女", age: 14, grade: "初二", location: "黔云省松河县", guardian: "祖母 蒋桂香", family: "留守儿童，与祖母生活", income: 3090, workers: 3, distance: "5.8 公里", rank: "年级第 15 名", status: "异常拒绝", sheet: "a", photoIndex: 9 },
  { id: "AH-2026-0139", name: "陈远", gender: "男", age: 15, grade: "初三", location: "皖岭省金山县", guardian: "母亲 陈慧", family: "单亲家庭，母亲临时务工", income: 3420, workers: 3, distance: "4.2 公里", rank: "年级第 9 名", status: "异常拒绝", sheet: "b", photoIndex: 0 },
  { id: "JX-2026-0246", name: "罗念", gender: "女", age: 13, grade: "初一", location: "赣川省宁溪县", guardian: "父亲 罗建军", family: "父亲务农，需照顾患病祖父", income: 2810, workers: 4, distance: "3.6 公里", rank: "班级第 3 名", status: "异常拒绝", sheet: "b", photoIndex: 1 },
  { id: "HB-2026-0742", name: "杜晨风", gender: "男", age: 14, grade: "初二", location: "楚江省恩河自治州", guardian: "祖母 杜金凤", family: "父母外出务工，收入不稳定", income: 3250, workers: 4, distance: "7.5 公里", rank: "年级第 21 名", status: "异常拒绝", sheet: "b", photoIndex: 2 },
  { id: "HN-2026-0835", name: "宋新芽", gender: "女", age: 12, grade: "初一", location: "中原省嵩山县", guardian: "母亲 宋琴", family: "父亲病故，母亲务农", income: 2670, workers: 3, distance: "2.9 公里", rank: "班级第 6 名", status: "异常拒绝", sheet: "b", photoIndex: 3 },
  { id: "SX-2026-0357", name: "韩石头", gender: "男", age: 15, grade: "初三", location: "晋北省临河县", guardian: "父亲 韩保民", family: "低保家庭，父亲季节性务工", income: 3100, workers: 5, distance: "8.1 公里", rank: "年级第 16 名", status: "异常拒绝", sheet: "b", photoIndex: 4 },
  { id: "GS-2026-0611", name: "马小芸", gender: "女", age: 13, grade: "初一", location: "陇西省岷山县", guardian: "祖父 马成山", family: "父母常年在外，与祖父生活", income: 2790, workers: 3, distance: "5.1 公里", rank: "班级第 4 名", status: "异常拒绝", sheet: "b", photoIndex: 5 },
  { id: "SN-2026-0143", name: "段安", gender: "男", age: 14, grade: "初二", location: "秦岭省安南县", guardian: "母亲 段兰", family: "单亲家庭，母亲务农", income: 2990, workers: 3, distance: "6.4 公里", rank: "年级第 13 名", status: "异常拒绝", sheet: "b", photoIndex: 6 },
  { id: "HB-2026-0778", name: "向小满", gender: "女", age: 15, grade: "初三", location: "楚江省郧川县", guardian: "父亲 向国富", family: "父母务农，家中两名老人需照料", income: 3370, workers: 6, distance: "4.7 公里", rank: "年级第 10 名", status: "异常拒绝", sheet: "b", photoIndex: 7 },
  { id: "SC-2026-0723", name: "叶青松", gender: "男", age: 13, grade: "初一", location: "川北省通河县", guardian: "祖父 叶茂林", family: "父亲去世，母亲外出务工", income: 2550, workers: 3, distance: "7.8 公里", rank: "班级第 8 名", status: "异常拒绝", sheet: "b", photoIndex: 8 },
  { id: "GX-2026-0966", name: "黄秋月", gender: "女", age: 14, grade: "初二", location: "桂川省百林市", guardian: "母亲 黄玉兰", family: "母亲独自抚养，收入来自零工", income: 2880, workers: 4, distance: "5.6 公里", rank: "年级第 7 名", status: "异常拒绝", sheet: "b", photoIndex: 9 },
  { id: "QH-2026-0115", name: "才让多杰", gender: "男", age: 15, grade: "初三", location: "青原省星湖自治州", guardian: "父亲 扎西", family: "牧区低收入家庭", income: 3190, workers: 5, distance: "寄宿学校 42 公里", rank: "年级第 18 名", status: "异常拒绝", sheet: "c", photoIndex: 0 },
  { id: "NX-2026-0312", name: "白雪", gender: "女", age: 13, grade: "初一", location: "宁川省固山县", guardian: "母亲 白秀兰", family: "父亲患病，母亲务农", income: 2720, workers: 4, distance: "6.1 公里", rank: "班级第 5 名", status: "异常拒绝", sheet: "c", photoIndex: 1 },
  { id: "XJ-2026-0087", name: "阿依努尔", gender: "女", age: 14, grade: "初二", location: "西岭省喀云地区", guardian: "父亲 艾山", family: "多子女低收入家庭", income: 3410, workers: 6, distance: "4.5 公里", rank: "年级第 14 名", status: "异常拒绝", sheet: "c", photoIndex: 2 },
  { id: "GS-2026-0652", name: "魏小山", gender: "男", age: 12, grade: "初一", location: "陇西省宕河县", guardian: "祖母 魏桂英", family: "父母外出失联，与祖母生活", income: 2380, workers: 3, distance: "8.9 公里", rank: "班级第 9 名", status: "异常拒绝", sheet: "c", photoIndex: 3 },
  { id: "YN-2026-0291", name: "木呷阿果", gender: "男", age: 15, grade: "初三", location: "云岭省宁湖县", guardian: "母亲 阿果木则", family: "单亲务农家庭", income: 2920, workers: 5, distance: "寄宿学校 31 公里", rank: "年级第 23 名", status: "异常拒绝", sheet: "c", photoIndex: 4 },
  { id: "GZ-2026-0509", name: "石榴", gender: "女", age: 12, grade: "初一", location: "黔云省水城县", guardian: "父亲 石庆明", family: "父亲工伤，母亲务农", income: 2640, workers: 4, distance: "7.3 公里", rank: "班级第 1 名", status: "异常拒绝", sheet: "c", photoIndex: 5 },
  { id: "SC-2026-0784", name: "吉克木沙", gender: "男", age: 14, grade: "初二", location: "川南省凉谷自治州", guardian: "祖父 吉克阿木", family: "父母在外务工，与祖父母生活", income: 3060, workers: 5, distance: "6.9 公里", rank: "年级第 20 名", status: "异常拒绝", sheet: "c", photoIndex: 6 },
  { id: "XZ-2026-0046", name: "央金拉姆", gender: "女", age: 15, grade: "初三", location: "雪原省昌川市", guardian: "母亲 德吉", family: "牧区单亲家庭", income: 3290, workers: 4, distance: "寄宿学校 55 公里", rank: "年级第 17 名", status: "异常拒绝", sheet: "c", photoIndex: 7 },
  { id: "GX-2026-1014", name: "蓝小路", gender: "男", age: 13, grade: "初一", location: "桂川省崇岭市", guardian: "祖母 蓝金秀", family: "父亲病故，母亲外出务工", income: 2460, workers: 3, distance: "5.3 公里", rank: "班级第 10 名", status: "异常拒绝", sheet: "c", photoIndex: 8 },
  { id: "YN-2026-0338", name: "和春苗", gender: "女", age: 14, grade: "初二", location: "云岭省澜川县", guardian: "父亲 和建平", family: "低收入务农家庭，家中五名子女", income: 2770, workers: 7, distance: "8.2 公里", rank: "年级第 5 名", status: "异常拒绝", sheet: "c", photoIndex: 9 },
];

const menu: { id: View; label: string; mark: string; badge?: string }[] = [
  { id: "dashboard", label: "总览", mark: "⌂" },
  { id: "children", label: "申请档案", mark: "▦", badge: "30" },
  { id: "mail", label: "系统邮箱", mark: "✉", badge: "2" },
  { id: "monitor", label: "系统监控", mark: "◉", badge: "!" },
  { id: "logs", label: "访问日志", mark: "≡" },
  { id: "evidence", label: "加密证据库", mark: "◆" },
];

function Photo({ person, className = "" }: { person: ChildRecord; className?: string }) {
  const photoNumber = person.photoIndex.toString().padStart(2, "0");
  return <img className={`photo ${className}`} src={`/child-photos/${person.sheet}-${photoNumber}.jpg`} alt={`${person.name}的资料照片`} />;
}

function downloadCsv() {
  const anchor = document.createElement("a");
  anchor.href = "/child-dossiers-30.pdf";
  anchor.download = "助学申请档案_30页.pdf";
  anchor.click();
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ChildRecord | null>(null);
  const [successOpen, setSuccessOpen] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [incidentRevealed, setIncidentRevealed] = useState(false);
  const [toast, setToast] = useState("");
  const [mailStep, setMailStep] = useState<"company" | "child" | "done">("company");
  const [mailRecipient, setMailRecipient] = useState("深蓝科技项目负责人 <support@deepblue-tech.cn>");
  const [mailSubject, setMailSubject] = useState("关于贵司资助对象李小雨的情况说明");
  const [mailBody, setMailBody] = useState("");

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return children;
    return children.filter((item) => [item.name, item.id, item.location, item.status, item.company].join(" ").toLowerCase().includes(value));
  }, [query]);

  const title: Record<View, string> = {
    dashboard: "系统总览",
    children: "助学申请档案",
    mail: "系统内置邮箱",
    monitor: "实时安全监控",
    logs: "后台访问日志",
    evidence: "加密证据库",
  };

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const openMailFor = (target: "company" | "child") => {
    setView("mail");
    setSelected(null);
    if (target === "company") {
      setMailStep("company");
      setMailRecipient("深蓝科技项目负责人 <support@deepblue-tech.cn>");
      setMailSubject("关于贵司资助对象李小雨的情况说明");
      setMailBody("");
    } else {
      setMailStep("child");
      setMailRecipient("李小雨 <student.GZ20260417@edu-aid.cn>");
      setMailSubject("给李小雨同学的一封信");
      setMailBody("");
    }
  };

  const sendMail = () => {
    if (mailStep === "company") {
      notify("邮件已发送至深蓝科技项目负责人");
      window.setTimeout(() => openMailFor("child"), 500);
      return;
    }
    setMailStep("done");
    notify("邮件已发送至李小雨");
    window.setTimeout(() => {
      setIncidentRevealed(true);
      setAlertOpen(true);
    }, 900);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">援</div>
          <div><strong>助学金匹配系统</strong><span>EDU-AID / TEST BUILD</span></div>
        </div>
        <div className="environment"><span className="pulse-dot" />测试环境 · 数据同步中</div>
        <nav>
          <p className="nav-label">工作台</p>
          {menu.filter((item) => incidentRevealed || item.id === "dashboard" || item.id === "mail").map((item) => (
            <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => setView(item.id)}>
              <span className="nav-mark">{item.mark}</span><span>{item.label}</span>{item.badge && <em className={item.badge === "!" ? "danger-badge" : ""}>{item.badge}</em>}
            </button>
          ))}
        </nav>
        <div className="side-footer">
          <div className="avatar">沈</div>
          <div><strong>沈栀</strong><span>超级管理员</span></div>
          <button aria-label="设置">⋮</button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <span className="crumb">工作台 / {title[view]}</span>
            <h1>{title[view]}</h1>
          </div>
          <div className="top-actions">
            <label className="global-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索姓名、编号、地区…" /></label>
            {incidentRevealed && <button className="icon-button" onClick={() => setAlertOpen(true)} aria-label="查看异常通知">♢<i /></button>}
            {incidentRevealed && <a className="export-button" href="/child-dossiers-30.pdf" download="助学申请档案_30页.pdf" onClick={() => notify("已导出30页儿童申请档案")}><span>⇩</span> 导出30页档案
            </a>}
          </div>
        </header>

        <div className="content">
          {view === "dashboard" && <Dashboard incidentRevealed={incidentRevealed} onOpenRecord={() => setSelected(children[0])} onViewChange={setView} />}
          {view === "children" && <ChildrenTable records={filtered} onSelect={setSelected} />}
          {view === "mail" && <MailBox recipient={mailRecipient} subject={mailSubject} body={mailBody} setRecipient={setMailRecipient} setSubject={setMailSubject} setBody={setMailBody} sendMail={sendMail} step={mailStep} openMailFor={openMailFor} />}
          {view === "monitor" && <Monitor onAlert={() => setAlertOpen(true)} onLogs={() => setView("logs")} />}
          {view === "logs" && <Logs onExport={() => { downloadCsv(); notify("异常申请资料已导出"); }} />}
          {view === "evidence" && <Evidence onLogs={() => setView("logs")} />}
        </div>
      </section>

      {successOpen && (
        <div className="modal-backdrop success-backdrop">
          <section className="match-modal">
            <button className="modal-close" onClick={() => setSuccessOpen(false)} aria-label="关闭">×</button>
            <div className="success-check"><span>✓</span></div>
            <p className="eyebrow green">SMART MATCH / 匹配完成</p>
            <h2>匹配成功</h2>
            <div className="match-person">
              <Photo person={children[0]} className="match-photo" />
              <div><strong>李小雨</strong><span>黔云省青禾苗族自治州 · 初二</span></div>
            </div>
            <div className="match-company"><span>匹配企业</span><strong><i>深</i>深蓝科技</strong><em>匹配度 96.8%</em></div>
            <button className="primary-button" onClick={() => { setSuccessOpen(false); setSelected(children[0]); }}>打开李小雨资料 <span>→</span></button>
            <small>系统已于 22:41:08 完成自动匹配</small>
          </section>
        </div>
      )}

      {selected && <RecordDrawer person={selected} onClose={() => setSelected(null)} onMail={openMailFor} />}
      {alertOpen && <ErrorModal onClose={() => setAlertOpen(false)} onLogs={() => { setAlertOpen(false); setView("logs"); }} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </main>
  );
}

function Dashboard({ incidentRevealed, onOpenRecord, onViewChange }: { incidentRevealed: boolean; onOpenRecord: () => void; onViewChange: (view: View) => void }) {
  return <>
    {incidentRevealed && <div className="alert-strip"><span>!</span><div><strong>检测到匹配模块异常</strong><p>过去24小时出现 37 条异常拒绝记录，建议立即查看访问日志。</p></div><button onClick={() => onViewChange("monitor")}>查看详情 →</button></div>}
    <section className="metric-grid">
      <article><div className="metric-icon blue">人</div><p>累计申请</p><strong>12,846</strong><span className="up">↑ 12.4%</span><small>较上月</small></article>
      <article><div className="metric-icon green">✓</div><p>成功匹配</p><strong>9,372</strong><span className="up">↑ 8.7%</span><small>匹配率 72.96%</small></article>
      <article><div className="metric-icon amber">⌛</div><p>等待审核</p><strong>1,208</strong><span>今日 +86</span><small>平均 2.4 天</small></article>
      {incidentRevealed ? <article className="danger-card"><div className="metric-icon red">!</div><p>异常拒绝</p><strong>37</strong><span className="down">↑ 37</span><small>需立即处理</small></article> : <article><div className="metric-icon blue">企</div><p>合作企业</p><strong>864</strong><span className="up">↑ 5.2%</span><small>本月新增 18 家</small></article>}
    </section>
    <section className="dashboard-grid">
      <article className="panel match-card">
        <div className="panel-head"><div><p className="eyebrow">最新匹配结果</p><h3>李小雨 ↔ 深蓝科技</h3></div><span className="status success">● 匹配成功</span></div>
        <div className="featured-record">
          <Photo person={children[0]} className="featured-photo" />
          <div className="featured-info"><h4>李小雨 <span>GZ-2026-0417</span></h4><p>黔云省青禾苗族自治州</p><div className="mini-tags"><span>初二</span><span>年级前三</span><span>父母双亡</span></div><p className="story">与奶奶共同生活，每天步行十一里上学。系统综合评估困难指数 91.4，教育潜力指数 94.2。</p></div>
          <div className="match-score"><span>AI 匹配度</span><strong>96.8<em>%</em></strong><div><i style={{ width: "96.8%" }} /></div><small>教育支持方向高度契合</small></div>
        </div>
        <div className="company-row"><div className="company-logo">深</div><div><strong>深蓝科技有限公司</strong><span>科技创新 · 教育公益计划</span></div><div className="company-meta"><span>年度资助额度</span><strong>¥ 18,000</strong></div><button onClick={onOpenRecord}>查看完整档案 →</button></div>
      </article>
      <article className="panel activity-card"><div className="panel-head"><div><p className="eyebrow">系统动态</p><h3>实时处理队列</h3></div><span className="live"><i /> LIVE</span></div><div className="activity-list">
        <div><span className="activity-dot green">✓</span><p><strong>李小雨</strong> 已完成企业匹配<small>22:41:08</small></p></div>
        {incidentRevealed && <div><span className="activity-dot red">!</span><p>批量申请出现异常拒绝<small>22:44:16 · 37 条</small></p></div>}
        {incidentRevealed && <div><span className="activity-dot amber">↻</span><p>规则引擎正在重新校验<small>处理中 · 30 / 37</small></p></div>}
        <div><span className="activity-dot blue">↗</span><p>深蓝科技资助确认回执<small>22:45:39</small></p></div>
      </div>{incidentRevealed && <button className="ghost-full" onClick={() => onViewChange("logs")}>查看全部系统日志</button>}</article>
    </section>
    {incidentRevealed && <section className="panel queue-panel"><div className="panel-head"><div><p className="eyebrow">异常队列预览</p><h3>劳动力参数规则命中异常</h3></div><button onClick={() => onViewChange("children")}>查看30份完整档案 →</button></div><div className="queue-list">
      {children.slice(1, 6).map(person => <button key={person.id} onClick={() => onViewChange("children")}><Photo person={person} /><span><strong>{person.name}</strong><small>{person.location}</small></span><em>{person.workers} 名劳动力</em><b>年均 ¥{person.income.toLocaleString()}</b><i>异常拒绝</i></button>)}
    </div></section>}
  </>;
}

function ChildrenTable({ records, onSelect }: { records: ChildRecord[]; onSelect: (person: ChildRecord) => void }) {
  return <section className="panel records-panel">
    <div className="records-toolbar"><div><p className="eyebrow">APPLICATION DATABASE</p><h3>当前显示 {records.length} / 30 份档案</h3></div><div><button className="filter active">全部</button><button className="filter">异常拒绝 29</button><button className="filter">匹配成功 1</button></div></div>
    <div className="table-wrap"><table><thead><tr><th>申请人</th><th>档案编号</th><th>地区 / 年级</th><th>家庭信息</th><th>年人均收入</th><th>审核状态</th><th /></tr></thead><tbody>
      {records.map(person => <tr key={person.id} onClick={() => onSelect(person)}><td><div className="person-cell"><Photo person={person} /><span><strong>{person.name}</strong><small>{person.age}岁 · {person.gender}</small></span></div></td><td><code>{person.id}</code></td><td><strong>{person.location.replace(/省|自治区/, " · ")}</strong><small>{person.grade} · {person.rank}</small></td><td><strong>{person.guardian}</strong><small>{person.family}</small></td><td><strong>¥ {person.income.toLocaleString()}</strong><small>{person.workers} 名家庭劳动力</small></td><td><span className={person.status === "匹配成功" ? "status success" : "status error"}>● {person.status}</span></td><td><button className="row-button">→</button></td></tr>)}
    </tbody></table></div>
  </section>;
}

function MailBox(props: { recipient: string; subject: string; body: string; setRecipient: (v: string) => void; setSubject: (v: string) => void; setBody: (v: string) => void; sendMail: () => void; step: "company" | "child" | "done"; openMailFor: (v: "company" | "child") => void }) {
  return <section className="mail-layout">
    <aside className="mail-side panel"><button className="compose">＋ 写邮件</button><nav><button className="active"><span>▣</span>草稿箱<em>{props.step === "done" ? 0 : 1}</em></button><button><span>✉</span>收件箱<em>4</em></button><button><span>↗</span>已发送<em>{props.step === "done" ? 6 : props.step === "child" ? 5 : 4}</em></button><button><span>◇</span>星标邮件</button><button><span>⌫</span>回收站</button></nav><div className="mail-storage"><span>邮箱空间 18%</span><div><i /></div><small>1.8 GB / 10 GB</small></div></aside>
    <article className="panel composer"><div className="composer-head"><div><p className="eyebrow">新邮件</p><h3>{props.step === "company" ? "致资助企业负责人" : props.step === "child" ? "致受助学生" : "邮件已发送"}</h3></div><div className="draft-switch"><button className={props.step === "company" ? "active" : ""} onClick={() => props.openMailFor("company")}>深蓝科技</button><button className={props.step === "child" ? "active" : ""} onClick={() => props.openMailFor("child")}>李小雨</button></div></div>
      <label className="mail-field"><span>收件人</span><input value={props.recipient} onChange={(e) => props.setRecipient(e.target.value)} /></label>
      <label className="mail-field"><span>主题</span><input value={props.subject} onChange={(e) => props.setSubject(e.target.value)} /></label>
      <div className="mail-tools"><span>B</span><i>I</i><u>U</u><span>≡</span><span>↗</span><span>⌕</span></div>
      <textarea value={props.body} onChange={(e) => props.setBody(e.target.value)} aria-label="邮件正文" placeholder="请在此输入邮件正文……" />
      <footer><div><button>⌕ 添加附件</button><button>◇ 保存草稿</button></div><button className="send-button" onClick={props.sendMail} disabled={props.step === "done"}>发送邮件 <span>↗</span></button></footer>
    </article>
    <aside className="panel mail-context"><p className="eyebrow">关联档案</p><Photo person={children[0]} className="context-photo" /><h3>李小雨</h3><span>GZ-2026-0417</span><dl><div><dt>匹配企业</dt><dd>深蓝科技</dd></div><div><dt>匹配度</dt><dd className="green">96.8%</dd></div><div><dt>当前状态</dt><dd>资助待确认</dd></div></dl><p className="mail-note">系统邮件将同步保存至该申请人的沟通记录。</p></aside>
  </section>;
}

function Monitor({ onAlert, onLogs }: { onAlert: () => void; onLogs: () => void }) {
  return <>
    <div className="critical-banner"><span className="critical-icon">!</span><div><p>CRITICAL INCIDENT · #INC-2026-0721</p><h2>匹配规则遭到异常数据注入</h2><span>攻击仍在分析中 · 已自动隔离受影响队列</span></div><button onClick={onAlert}>重现红色警报</button></div>
    <section className="monitor-grid">
      <article className="panel attack-map"><div className="panel-head"><div><p className="eyebrow">攻击溯源</p><h3>异常流量路径</h3></div><span className="status error">● 高危</span></div><div className="trace"><div><span>外部网络</span><strong>202.xxx.xx.137</strong><small>裕农科技企业网段</small></div><i>137<br /><small>数据包</small></i><div><span>网关层</span><strong>API-GW-02</strong><small>02:04:11 首次命中</small></div><i>↯</i><div className="infected"><span>规则引擎</span><strong>MATCH-RULE-07</strong><small>劳动力权重漏洞</small></div></div><button className="ghost-full" onClick={onLogs}>调出完整访问日志</button></article>
      <article className="panel incident-stats"><div className="panel-head"><div><p className="eyebrow">影响范围</p><h3>事件摘要</h3></div></div><div className="big-stat"><strong>37</strong><span>份申请被错误拒绝</span></div><dl><div><dt>攻击时段</dt><dd>02:04 — 04:17</dd></div><div><dt>异常数据包</dt><dd>137 条</dd></div><div><dt>受影响规则</dt><dd>劳动力数量 ≥ 3</dd></div><div><dt>数据泄露</dt><dd className="green">未发现</dd></div></dl></article>
    </section>
    <section className="panel terminal-panel"><div className="terminal-head"><span><i className="r" /><i className="y" /><i className="g" /></span><strong>security-monitor / realtime</strong><em>● LIVE</em></div><pre>{`22:44:11.042  [WARN]  request signature anomaly detected\n22:44:11.087  [TRACE] src_ip=202.xxx.xx.137 gateway=API-GW-02\n22:44:12.204  [ERROR] labor_weight rule forced: family_workers >= 3\n22:44:12.284  [ERROR] valid applicant rejected  id=YN-2026-0182\n22:44:12.301  [ERROR] valid applicant rejected  id=GX-2026-0921\n22:44:13.725  [CRITICAL] batch rejection threshold exceeded  count=37\n22:44:14.008  [SECURITY] isolating queue MATCH-RULE-07\n22:44:15.317  [TRACE] device fingerprint acquired: YNTECH-WS-071\n22:44:16.001  [ALERT] manual review required`}</pre></section>
  </>;
}

const logs = [
  ["04:17:09.884", "202.xxx.xx.137", "POST /api/v2/match/batch", "500", "payload_sig=YR-137-0AF"],
  ["04:16:52.116", "202.xxx.xx.137", "PATCH /rules/labor_weight", "403", "token scope mismatch"],
  ["04:15:31.702", "202.xxx.xx.137", "POST /api/v2/match/batch", "500", "37 records rejected"],
  ["03:48:06.441", "202.xxx.xx.137", "GET /internal/rules", "403", "repeated scan"],
  ["03:21:19.087", "202.xxx.xx.137", "POST /api/v2/match/batch", "422", "abnormal packet #089"],
  ["02:44:58.307", "202.xxx.xx.137", "POST /api/v2/match/batch", "422", "abnormal packet #041"],
  ["02:04:11.042", "202.xxx.xx.137", "POST /api/v2/match/batch", "401", "first anomaly"],
  ["01:58:42.990", "10.24.17.6", "GET /health", "200", "normal probe"],
];

function Logs({ onExport }: { onExport: () => void }) {
  return <>
    <section className="log-summary"><article><span>来源 IP</span><strong>202.xxx.xx.137</strong><small>归属：裕农科技有限公司</small></article><article><span>操作终端</span><strong>YNTECH-WS-071</strong><small>设备指纹：78:B4:2D:••:A1</small></article><article><span>攻击窗口</span><strong>02:04 — 04:17</strong><small>持续 2小时13分</small></article><article className="red"><span>风险等级</span><strong>CRITICAL</strong><small>需人工介入</small></article></section>
    <section className="panel log-panel"><div className="panel-head"><div><p className="eyebrow">ACCESS LOG / 2026-07-18</p><h3>后台访问日志</h3></div><div><button>筛选：异常请求</button><button onClick={onExport}>⇩ 导出关联档案</button></div></div><div className="log-table"><div className="log-row head"><span>时间</span><span>来源 IP</span><span>请求</span><span>状态</span><span>说明</span></div>{logs.map((log, i) => <div className={i < 7 ? "log-row suspicious" : "log-row"} key={log[0]}><span>{log[0]}</span><span>{log[1]}</span><span>{log[2]}</span><span><b className={`http h${log[3]}`}>{log[3]}</b></span><span>{log[4]}</span></div>)}</div></section>
    <section className="panel fingerprint"><div><p className="eyebrow">设备指纹提取结果</p><h3>已锁定操作终端</h3><p>通过数据校验算法提取，工作站地址、序列号与裕农科技登记表一致，可作为安全评审的直接证据。</p></div><code>workstation_id: YNTECH-WS-071<br />serial: CN-YR-4F2A-071<br />packet_feature: yr_script_v4::labor_weight<br />confidence: 99.72%</code></section>
  </>;
}

function Evidence({ onLogs }: { onLogs: () => void }) {
  const files = [
    ["后台访问日志_20260718.log", "4.8 MB", "SHA256 已校验"],
    ["异常申请截图_37份.zip", "28.4 MB", "加密归档"],
    ["攻击溯源图表_v3.pdf", "6.2 MB", "评估会材料"],
    ["IP备案查询文件_盖章版.pdf", "2.1 MB", "通信管理局"],
    ["设备指纹提取结果.json", "184 KB", "可信度 99.72%"],
    ["数据包特征码_137条.pcap", "17.6 MB", "只读证据"],
  ];
  return <section className="panel vault"><div className="vault-head"><div className="vault-lock">◆</div><div><p className="eyebrow">ENCRYPTED VAULT / AES-256</p><h2>系统异常证据包</h2><span>创建者：沈栀 · 最后更新 2026-07-18 05:02</span></div><button onClick={onLogs}>打开关联日志 →</button></div><div className="vault-path">加密证据库 <span>/</span> INC-2026-0721 <span>/</span> system_attack</div><div className="file-grid">{files.map((file, index) => <article key={file[0]}><div className={`file-icon f${index}`}>▤</div><strong>{file[0]}</strong><span>{file[1]}</span><small>● {file[2]}</small><button>⋮</button></article>)}</div><div className="audit-note"><span>✓</span><div><strong>证据完整性校验通过</strong><p>所有文件已生成哈希摘要，任何修改都会触发安全告警。</p></div><code>VAULT-ID: EV-72A9-F013</code></div></section>;
}

function RecordDrawer({ person, onClose, onMail }: { person: ChildRecord; onClose: () => void; onMail: (target: "company" | "child") => void }) {
  return <div className="drawer-backdrop" onMouseDown={(e) => { if (e.currentTarget === e.target) onClose(); }}><aside className="record-drawer"><header><div><p className="eyebrow">申请人完整档案</p><h2>{person.name}</h2></div><button onClick={onClose}>×</button></header><Photo person={person} className="drawer-photo" /><div className="photo-caption"><span>现场资料照片 · 非证件照</span><code>{person.id}</code></div><div className="record-status"><span className={person.status === "匹配成功" ? "status success" : "status error"}>● {person.status}</span>{person.company && <span>匹配企业：<strong>{person.company}</strong></span>}</div><dl className="record-details"><div><dt>姓名 / 性别 / 年龄</dt><dd>{person.name} · {person.gender} · {person.age}岁</dd></div><div><dt>年级 / 成绩</dt><dd>{person.grade} · {person.rank}</dd></div><div><dt>所在地</dt><dd>{person.location}</dd></div><div><dt>监护人</dt><dd>{person.guardian}</dd></div><div className="wide"><dt>家庭情况</dt><dd>{person.family}</dd></div><div><dt>年人均收入</dt><dd>¥ {person.income.toLocaleString()}</dd></div><div><dt>家庭劳动力</dt><dd>{person.workers} 人</dd></div><div><dt>上学距离</dt><dd>{person.distance}</dd></div></dl>{person.name === "李小雨" && <blockquote>“她七岁没了父母，现在初二，成绩年级前三。她需要的不只是钱，她需要有人告诉她，她不是一个人。”</blockquote>}<footer>{person.name === "李小雨" ? <><button onClick={() => onMail("company")}>给深蓝科技写信</button><button className="primary-button" onClick={() => onMail("child")}>给李小雨写信</button></> : <button className="primary-button" onClick={() => onMail("child")}>创建沟通记录</button>}</footer></aside></div>;
}

function ErrorModal({ onClose, onLogs }: { onClose: () => void; onLogs: () => void }) {
  return <div className="modal-backdrop error-backdrop"><section className="error-modal"><header><div><span className="error-symbol">!</span><div><p>SYSTEM ERROR · CODE E-MATCH-507</p><h2>匹配申请被拒绝</h2></div></div><button onClick={onClose}>×</button></header><div className="error-count"><strong>37</strong><span>个符合资助条件的孩子被系统错误拒绝</span></div><p className="error-reason">错误模式异常：家庭劳动力数量 ≥ 3，但年人均收入仍低于贫困线。检测到同一网段的重复自动化请求，疑似人为触发。</p><div className="red-code"><div><span>error-stream / MATCH-RULE-07</span><em>● LIVE</em></div><pre>{`[02:04:11.042] ERROR inject packet signature=YR-137-001\n[02:04:11.087] WARN  labor_weight override detected\n[02:04:12.284] REJECT applicant=YN-2026-0182 reason=E507\n[02:04:12.301] REJECT applicant=GX-2026-0921 reason=E507\n[03:21:19.087] ERROR packet_count=89 source=202.xxx.xx.137\n[04:15:31.702] CRITICAL rejected_total=37 threshold_exceeded\n[04:17:09.884] TRACE device=YNTECH-WS-071 fingerprint=LOCKED`}</pre></div><footer><button onClick={onClose}>暂时关闭</button><button className="danger-button" onClick={onLogs}>调出错误日志 <span>→</span></button></footer></section></div>;
}
