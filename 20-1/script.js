const records=[
{id:1,type:'fund',title:'保证金账户入金',tag:'入金',date:'06-01 09:12',amount:'-¥680,000.00',status:'已入账',meta:'财富交易账户 · 国际能源交易子账户',detail:{业务类型:'保证金入金',交易账户:'国际能源交易子账户',转入金额:'¥680,000.00',状态:'已入账',说明:'建立国际原油交易初始底仓。'}},
{id:2,type:'buy',title:'买入开仓 · WTI原油主连',tag:'买入',date:'06-01 09:48',amount:'-¥182,400.00',status:'成交',meta:'12手 · 成交价 74.18 · 首次试仓',detail:{业务类型:'买入开仓',合约:'WTI原油主连',数量:'12手',成交价格:'74.18',占用保证金:'¥182,400.00',说明:'小额底仓试探性建仓。'}},
{id:3,type:'buy',title:'买入加仓 · WTI原油主连',tag:'买入',date:'06-02 14:16',amount:'-¥247,600.00',status:'成交',meta:'16手 · 成交价 72.64 · 震荡低位加仓',detail:{业务类型:'买入加仓',合约:'WTI原油主连',数量:'16手',成交价格:'72.64',占用保证金:'¥247,600.00',说明:'震荡洗盘阶段低位吸入。'}},
{id:4,type:'settlement',title:'盯市结算 · 日内收益转结',tag:'结算',date:'06-03 15:29',amount:'+¥268,200.00',status:'完成',meta:'结算权益 ¥948,200.00 · 主升启动',detail:{业务类型:'盯市结算',结算收益:'+¥268,200.00',结算权益:'¥948,200.00',说明:'底仓开始产生明显收益。'}},
{id:5,type:'buy',title:'买入加仓 · WTI原油主连',tag:'买入',date:'06-04 10:08',amount:'-¥325,000.00',status:'成交',meta:'18手 · 成交价 73.05 · 急跌加仓',detail:{业务类型:'买入加仓',合约:'WTI原油主连',数量:'18手',成交价格:'73.05',占用保证金:'¥325,000.00',说明:'急跌节点继续扩大仓位。'}},
{id:6,type:'settlement',title:'盯市结算 · 日内收益转结',tag:'结算',date:'06-05 15:33',amount:'+¥1,426,500.00',status:'完成',meta:'结算权益 ¥2,374,700.00 · 行情加速',detail:{业务类型:'盯市结算',结算收益:'+¥1,426,500.00',结算权益:'¥2,374,700.00',说明:'波动扩大，盈利明显增加。'}},
{id:7,type:'buy',title:'买入加仓 · 布伦特原油',tag:'买入',date:'06-06 11:21',amount:'-¥688,000.00',status:'成交',meta:'28手 · 成交价 77.12 · 关联品种加仓',detail:{业务类型:'买入加仓',合约:'布伦特原油',数量:'28手',成交价格:'77.12',占用保证金:'¥688,000.00',说明:'切入强势关联品种，放大收益弹性。'}},
{id:8,type:'sell',title:'卖出平仓 · WTI原油主连',tag:'卖出',date:'06-07 14:42',amount:'+¥2,108,400.00',status:'成交',meta:'14手 · 成交价 79.38 · 第一轮止盈',detail:{业务类型:'卖出平仓',合约:'WTI原油主连',数量:'14手',成交价格:'79.38',实现收益:'+¥2,108,400.00',说明:'第一轮反弹中分批止盈。'}},
{id:9,type:'settlement',title:'盯市结算 · 累计权益更新',tag:'结算',date:'06-08 15:31',amount:'+¥3,860,200.00',status:'完成',meta:'结算权益 ¥8,343,300.00 · 趋势延续',detail:{业务类型:'盯市结算',结算收益:'+¥3,860,200.00',结算权益:'¥8,343,300.00',说明:'行情持续上攻，账户权益突破八百万。'}},
{id:10,type:'buy',title:'买入加仓 · WTI原油主连',tag:'买入',date:'06-09 13:07',amount:'-¥1,260,000.00',status:'成交',meta:'36手 · 成交价 76.84 · 二次洗盘加码',detail:{业务类型:'买入加仓',合约:'WTI原油主连',数量:'36手',成交价格:'76.84',占用保证金:'¥1,260,000.00',说明:'二次洗盘低点大幅加码。'}},
{id:11,type:'sell',title:'卖出平仓 · 布伦特原油',tag:'卖出',date:'06-10 15:06',amount:'+¥5,682,000.00',status:'成交',meta:'28手 · 成交价 83.44 · 强势止盈',detail:{业务类型:'卖出平仓',合约:'布伦特原油',数量:'28手',成交价格:'83.44',实现收益:'+¥5,682,000.00',说明:'强势上拉阶段兑现大额利润。'}},
{id:12,type:'settlement',title:'盯市结算 · 累计权益更新',tag:'结算',date:'06-11 15:28',amount:'+¥8,994,600.00',status:'完成',meta:'结算权益 ¥22,019,900.00 · 趋势加速',detail:{业务类型:'盯市结算',结算收益:'+¥8,994,600.00',结算权益:'¥22,019,900.00',说明:'趋势段快速放大账户总权益。'}},
{id:13,type:'sell',title:'卖出平仓 · WTI原油主连',tag:'卖出',date:'06-12 10:56',amount:'+¥7,348,000.00',status:'成交',meta:'30手 · 成交价 84.12 · 分批止盈',detail:{业务类型:'卖出平仓',合约:'WTI原油主连',数量:'30手',成交价格:'84.12',实现收益:'+¥7,348,000.00',说明:'强趋势中继续兑现利润。'}},
{id:14,type:'buy',title:'买入回补 · WTI原油主连',tag:'买入',date:'06-13 11:24',amount:'-¥980,000.00',status:'成交',meta:'20手 · 成交价 81.96 · 回踩确认',detail:{业务类型:'买入回补',合约:'WTI原油主连',数量:'20手',成交价格:'81.96',占用保证金:'¥980,000.00',说明:'回踩确认后再次切入。'}},
{id:15,type:'sell',title:'卖出平仓 · WTI原油主连',tag:'卖出',date:'06-14 14:37',amount:'+¥10,315,660.00',status:'成交',meta:'20手 · 成交价 88.63 · 最终止盈',detail:{业务类型:'卖出平仓',合约:'WTI原油主连',数量:'20手',成交价格:'88.63',实现收益:'+¥10,315,660.00',说明:'尾段加速上涨中完成核心止盈。'}},
{id:16,type:'settlement',title:'期末结算 · 原油交易完成',tag:'结算',date:'06-15 16:00',amount:'+¥38,742,860.00',status:'完成',meta:'期初 ¥680,000.00 · 期末 ¥39,422,860.00',detail:{业务类型:'期末结算',交易周期:'15日',期初资金:'¥680,000.00',已实现收益:'+¥38,742,860.00',期末权益:'¥39,422,860.00',说明:'半个月滚动交易后，账户权益接近四千万。'}}
];
const bankApp=document.getElementById('bankApp');const views=[...document.querySelectorAll('.view')];const navBtns=[...document.querySelectorAll('.nav-btn')];const recordList=document.getElementById('recordList');const filterTabs=[...document.querySelectorAll('.filter-tab')];const detailMask=document.getElementById('detailMask');const detailSheet=document.getElementById('detailSheet');const sheetTitle=document.getElementById('sheetTitle');const sheetBody=document.getElementById('sheetBody');const toast=document.getElementById('toast');let assetsHidden=false;
function showView(id){
  views.forEach(v=>v.classList.toggle('active',v.id===id));
  navBtns.forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  const isSubpage=id!=='homeView';
  bankApp.classList.toggle('subpage-mode',isSubpage);
  closeDetail();
  window.scrollTo(0,0);
} 
document.querySelectorAll('[data-view]').forEach(el=>el.addEventListener('click',()=>showView(el.dataset.view)));
function renderRecords(filter='all'){recordList.innerHTML='';(filter==='all'?records:records.filter(r=>r.type===filter)).forEach(r=>{const el=document.createElement('button');el.className='record-item';el.innerHTML=`<div class="record-top"><div><div class="record-title">${r.title}</div><div class="record-meta">${r.date}<br>${r.meta}</div></div><span class="record-type">${r.tag}</span></div><div class="record-bottom"><span class="record-amount ${r.amount.startsWith('+')?'profit':''}">${r.amount}</span><span class="record-status">${r.status}</span></div>`;el.addEventListener('click',()=>openDetail(r));recordList.appendChild(el);});}
filterTabs.forEach(btn=>btn.addEventListener('click',()=>{filterTabs.forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderRecords(btn.dataset.filter);}));

function openDetail(r){sheetTitle.textContent=r.title;sheetBody.innerHTML=Object.entries(r.detail).map(([k,v])=>`<div class="detail-row"><span>${k}</span><strong class="${String(v).startsWith('+')?'profit':''}">${v}</strong></div>`).join('');detailMask.classList.add('open');detailSheet.classList.add('open')}function closeDetail(){detailMask.classList.remove('open');detailSheet.classList.remove('open')}detailMask.addEventListener('click',closeDetail);document.getElementById('closeSheetBtn').addEventListener('click',closeDetail);
document.getElementById('toggleAssetBtn').addEventListener('click',e=>{assetsHidden=!assetsHidden;document.getElementById('assetTotal').textContent=assetsHidden?'¥ ••••••••':'¥39,422,860.00';document.getElementById('cashBalance').textContent=assetsHidden?'••••••••':'39,422,860.00';e.currentTarget.textContent=assetsHidden?'显示':'隐藏'});
function showToast(text='功能演示'){toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1300)};document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>showToast(b.dataset.action==='transfer'?'转账汇款功能':b.dataset.action==='loan'?'贷款服务功能':'生活缴费功能')));document.getElementById('recordFilterBtn').addEventListener('click',()=>showToast('可按交易类型筛选'));document.getElementById('shareBtn').addEventListener('click',()=>showToast('交割摘要已生成'));
renderRecords();

['openNewsBtn','openNewsBtn2','openNewsBtn3'].forEach(id=>{const el=document.getElementById(id); if(el) el.addEventListener('click',()=>showView('newsView'));});
