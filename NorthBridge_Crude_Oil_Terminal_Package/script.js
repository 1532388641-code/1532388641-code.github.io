(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const fmt = (n, d = 2) => Number(n).toLocaleString('en-US', {minimumFractionDigits:d, maximumFractionDigits:d});
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const rand = (min, max) => min + Math.random() * (max - min);

  const state = {
    symbol: 'CL',
    title: 'WTI Crude Oil Futures',
    last: 82.63,
    prevClose: 81.50,
    open: 81.54,
    high: 83.08,
    low: 80.96,
    volume: 284631,
    openInterest: 1824906,
    trend: 0.012,
    volatility: 0.18,
    scene: 'normal',
    ticksInCandle: 0,
    tapePaused: false,
    grid: true,
    animation: true,
    marker: true,
    selectedTimeframe: '5m',
    selectedSide: 'BUY',
    positionsClosed: false,
    hiddenValues: false,
    nextOrderId: 1058,
    orders: [
      {id:'1049', status:'filled', side:'BUY', contract:'CL Front Month', type:'Limit', qty:20, price:79.82, note:'Filled'},
      {id:'1050', status:'filled', side:'BUY', contract:'CL Front Month', type:'Limit', qty:25, price:80.16, note:'Filled'},
      {id:'1051', status:'filled', side:'BUY', contract:'CL Front Month', type:'Limit', qty:25, price:80.74, note:'Filled'},
      {id:'1052', status:'filled', side:'SELL', contract:'CL Front Month', type:'Limit', qty:15, price:82.12, note:'Partial Exit'},
      {id:'1053', status:'working', side:'SELL', contract:'CL Front Month', type:'Limit', qty:15, price:83.60, note:'Working'},
      {id:'1054', status:'working', side:'SELL', contract:'CL Front Month', type:'Stop Limit', qty:10, price:81.72, note:'Protective Stop'}
    ],
    positions: [
      {contract:'CL Front Month', side:'LONG', qty:90, avg:80.74, last:82.63, margin:5168000, pnl:8420000, status:'Open'},
      {contract:'Brent Front Month', side:'LONG', qty:12, avg:85.22, last:86.14, margin:698000, pnl:426000, status:'Open'}
    ],
    watchSets: {
      futures:[
        ['CL','82.63','+1.38%'],['BZ','86.14','+1.02%'],['GC','2,391.30','+0.48%'],['SI','31.26','+0.31%'],['NG','2.74','-0.92%'],['HG','4.62','+0.66%'],['ZC','448.75','-0.18%'],['ZW','579.25','+0.39%']
      ],
      indices:[
        ['ES','5,511.25','+0.91%'],['NQ','19,824.50','+1.26%'],['YM','39,882','+0.84%'],['RTY','2,228.9','-0.14%'],['DAX','18,642','+0.58%'],['NK','39,318','+0.72%']
      ],
      fx:[
        ['DXY','103.42','-0.16%'],['EURUSD','1.0874','+0.22%'],['USDJPY','154.36','-0.18%'],['USDCNH','7.1182','-0.07%'],['GBPUSD','1.2816','+0.11%'],['AUDUSD','0.6678','+0.31%']
      ]
    }
  };

  function makeInitialCandles(count = 94) {
    const arr = [];
    let close = 78.90;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      let drift = 0.045;
      if (i > 42 && i < 57) drift = -0.23;
      if (i >= 57 && i < 80) drift = 0.19;
      if (i >= 80) drift = 0.08;
      const open = close + rand(-0.13, 0.13);
      close = open + drift + Math.sin(i * .41) * .10 + rand(-.13, .13);
      const high = Math.max(open, close) + rand(.08, .34);
      const low = Math.min(open, close) - rand(.08, .32);
      const volume = Math.round(rand(900, 4200) * (1 + Math.abs(close-open) * 1.8));
      arr.push({open, high, low, close, volume});
    }
    const delta = state.last - arr[arr.length-1].close;
    arr.forEach(c => { c.open += delta; c.high += delta; c.low += delta; c.close += delta; });
    return arr;
  }

  state.candles = makeInitialCandles();
  state.equityCurve = Array.from({length:90}, (_,i)=> 7000000 + i*68000 + Math.sin(i*.25)*310000 + Math.max(0,i-45)*115000);

  const canvases = {
    main: $('#mainCanvas'), sub: $('#subCanvas'), flow: $('#flowCanvas'), pnl: $('#pnlCanvas'), multi1: $('#multiCanvas1'), multi2: $('#multiCanvas2')
  };

  function setupCanvas(canvas) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * ratio));
    canvas.height = Math.max(1, Math.floor(rect.height * ratio));
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio,0,0,ratio,0,0);
    return {ctx, width:rect.width, height:rect.height};
  }

  function ma(data, period) {
    return data.map((_,i)=>{
      if (i < period-1) return null;
      let sum = 0;
      for (let j=i-period+1;j<=i;j++) sum += data[j].close;
      return sum/period;
    });
  }

  function drawGrid(ctx,w,h,rows=6,cols=10){
    if(!state.grid) return;
    ctx.strokeStyle='rgba(100,132,168,.15)'; ctx.lineWidth=1;
    for(let i=0;i<=rows;i++){ const y=h/rows*i; ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke(); }
    for(let i=0;i<=cols;i++){ const x=w/cols*i; ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke(); }
  }

  function drawPriceChart(canvas, data, compact=false){
    if(!canvas) return;
    const setup=setupCanvas(canvas); if(!setup) return;
    const {ctx,width:w,height:h}=setup;
    ctx.clearRect(0,0,w,h); drawGrid(ctx,w,h, compact?4:6, compact?8:12);
    const pad={l:8,r:50,t:8,b:18};
    const min=Math.min(...data.map(d=>d.low))-.28;
    const max=Math.max(...data.map(d=>d.high))+.28;
    const cw=(w-pad.l-pad.r)/data.length;
    const body=Math.max(1.5,cw*.64);
    const yOf=v=>pad.t+(max-v)/(max-min)*(h-pad.t-pad.b);
    data.forEach((d,i)=>{
      const x=pad.l+i*cw+cw/2;
      const isUp=d.close>=d.open;
      const color=isUp?'#ff5656':'#22c784';
      ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x,yOf(d.high));ctx.lineTo(x,yOf(d.low));ctx.stroke();
      const y1=yOf(d.open),y2=yOf(d.close),top=Math.min(y1,y2),bh=Math.max(1.4,Math.abs(y2-y1));
      ctx.fillRect(x-body/2,top,body,bh);
    });
    [[5,'#f4c34e'],[10,'#5dd7ff'],[20,'#c176ff']].forEach(([p,color])=>{
      const vals=ma(data,p);ctx.beginPath();let started=false;
      vals.forEach((v,i)=>{if(v==null)return;const x=pad.l+i*cw+cw/2,y=yOf(v);if(!started){ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y)});
      ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.stroke();
    });
    ctx.fillStyle='#7488a4';ctx.font='9px Arial';ctx.textAlign='right';
    for(let i=0;i<=5;i++){const v=max-(max-min)/5*i;ctx.fillText(v.toFixed(2),w-5,pad.t+(h-pad.t-pad.b)/5*i+3)}
    const last=data[data.length-1].close,y=yOf(last);
    if(state.marker){ctx.strokeStyle='rgba(255,86,86,.45)';ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.setLineDash([])}
  }

  function drawSubChart(){
    const data=state.candles, setup=setupCanvas(canvases.sub); if(!setup)return;
    const {ctx,width:w,height:h}=setup;ctx.clearRect(0,0,w,h);drawGrid(ctx,w,h,3,12);
    const maxV=Math.max(...data.map(d=>d.volume));const cw=w/data.length;
    data.forEach((d,i)=>{const bh=d.volume/maxV*(h*.48);ctx.fillStyle=d.close>=d.open?'rgba(255,86,86,.75)':'rgba(34,199,132,.75)';ctx.fillRect(i*cw+cw*.18,h-bh,cw*.64,bh)});
    const fast=ma(data,6),slow=ma(data,13);ctx.beginPath();let started=false;
    data.forEach((d,i)=>{if(fast[i]==null||slow[i]==null)return;const macd=(fast[i]-slow[i]);const x=i*cw+cw/2,y=h*.42-macd*24;if(!started){ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y)});ctx.strokeStyle='#d787ff';ctx.lineWidth=1.2;ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.12)';ctx.beginPath();ctx.moveTo(0,h*.42);ctx.lineTo(w,h*.42);ctx.stroke();
  }

  function drawFlow(){
    const setup=setupCanvas(canvases.flow);if(!setup)return;const{ctx,width:w,height:h}=setup;ctx.clearRect(0,0,w,h);drawGrid(ctx,w,h,3,8);
    const pts=Array.from({length:40},(_,i)=>h*.66 - i*.55 + Math.sin(i*.52)*8 + rand(-2,2));
    ctx.beginPath();pts.forEach((y,i)=>{const x=i/(pts.length-1)*w;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.strokeStyle='#ff6464';ctx.lineWidth=2;ctx.stroke();
    ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle='rgba(255,86,86,.08)';ctx.fill();
  }

  function drawEquity(){
    const setup=setupCanvas(canvases.pnl);if(!setup)return;const{ctx,width:w,height:h}=setup;ctx.clearRect(0,0,w,h);drawGrid(ctx,w,h,4,10);
    const arr=state.equityCurve,min=Math.min(...arr)-400000,max=Math.max(...arr)+400000;
    const y=v=>h-10-(v-min)/(max-min)*(h-22);ctx.beginPath();arr.forEach((v,i)=>{const x=8+i/(arr.length-1)*(w-16);i?ctx.lineTo(x,y(v)):ctx.moveTo(x,y(v))});ctx.strokeStyle='#5dd7ff';ctx.lineWidth=2;ctx.stroke();ctx.lineTo(w-8,h-10);ctx.lineTo(8,h-10);ctx.closePath();ctx.fillStyle='rgba(93,215,255,.08)';ctx.fill();
  }

  function drawAll(){
    drawPriceChart(canvases.main,state.candles);
    drawSubChart();drawFlow();drawEquity();
    if($('#chartPanel').classList.contains('active')){drawPriceChart(canvases.multi1,state.candles);drawPriceChart(canvases.multi2,state.candles.slice(-60));}
  }

  function renderWatch(type='futures'){
    const rows=state.watchSets[type];
    $('#watchTable').innerHTML=`<div class="dense-row header"><span>Code</span><span>Last</span><span>Move</span></div>`+rows.map((r,i)=>`<div class="dense-row ${r[0]===state.symbol?'selected':''}" data-watch-symbol="${r[0]}"><button>${r[0]}</button><span>${r[1]}</span><span class="${r[2].startsWith('+')?'up':'down'}">${r[2]}</span></div>`).join('');
    $$('[data-watch-symbol]').forEach(row=>row.onclick=()=>selectSymbol(row.dataset.watchSymbol));
  }

  function renderBook(){
    const base=state.last;
    const asks=[],bids=[];
    for(let i=10;i>=1;i--){asks.push({lvl:`Ask ${i}`,price:base+i*.02+rand(-.004,.004),size:Math.round(rand(40,980))})}
    for(let i=1;i<=10;i++){bids.push({lvl:`Bid ${i}`,price:base-i*.02+rand(-.004,.004),size:Math.round(rand(50,1200))})}
    const max=Math.max(...asks.map(x=>x.size),...bids.map(x=>x.size));
    $('#askBook').innerHTML=asks.map(x=>`<div class="book-row" style="--depth:${x.size/max*100}%"><span>${x.lvl}</span><b class="down">${x.price.toFixed(2)}</b><em>${x.size}</em></div>`).join('');
    $('#bidBook').innerHTML=bids.map(x=>`<div class="book-row" style="--depth:${x.size/max*100}%"><span>${x.lvl}</span><b class="up">${x.price.toFixed(2)}</b><em>${x.size}</em></div>`).join('');
    $('#bookMidPrice').textContent=state.last.toFixed(2);$('#bookMidMove').textContent=`${state.last>=state.prevClose?'+':''}${((state.last-state.prevClose)/state.prevClose*100).toFixed(2)}%`;
  }

  function addTape(){
    if(state.tapePaused)return;
    const side=Math.random()>.45?'BUY':'SELL';
    const price=state.last+rand(-.04,.04);const size=Math.round(rand(2,96))*10;
    const row=document.createElement('div');row.className=`tape-row ${side==='BUY'?'up':'down'}`;row.innerHTML=`<span>${side}</span><span>${price.toFixed(2)}</span><span>${size}</span><span>${Math.round(rand(18,99))}%</span>`;
    const list=$('#tapeList');list.prepend(row);while(list.children.length>13)list.lastElementChild.remove();
  }

  function renderPositions(){
    const active=state.positions.filter(p=>p.status==='Open');
    $('#miniPositions').innerHTML=`<div class="position-row header"><span>Contract</span><span>Side</span><span>Qty</span><span>Avg</span><span>P/L</span></div>`+active.map(p=>`<div class="position-row"><span>${p.contract}</span><span class="up">${p.side}</span><span>${p.qty}</span><span>${p.avg.toFixed(2)}</span><span class="up">CNY +${fmt(p.pnl,0)}</span></div>`).join('');
    $('#largePositionTable').innerHTML=`<div class="large-position-row header"><span></span><span>Contract</span><span>Side</span><span>Qty</span><span>Avg Entry</span><span>Last</span><span>Unrealized P/L</span><span>Status</span></div>`+state.positions.map((p,i)=>`<div class="large-position-row"><input class="row-check" type="checkbox" data-position-index="${i}"><span>${p.contract}</span><span class="${p.side==='LONG'?'up':'down'}">${p.side}</span><span>${p.qty}</span><span>${p.avg.toFixed(2)}</span><span>${p.last.toFixed(2)}</span><span class="${p.pnl>=0?'up':'down'}">CNY ${p.pnl>=0?'+':''}${fmt(p.pnl,0)}</span><span>${p.status}</span></div>`).join('');
    const cl=state.positions[0];$('#openContracts').textContent=active.reduce((s,p)=>s+p.qty,0);$('#avgEntry').textContent=cl?cl.avg.toFixed(2):'—';$('#unrealizedPnl').textContent=`CNY ${cl&&cl.pnl>=0?'+':''}${fmt(cl?.pnl||0,0)}`;$('#marginUtil').textContent=state.positionsClosed?'0.0%':'41.6%';
  }

  function renderOrders(filter='all'){
    const list=state.orders.filter(o=>filter==='all'||o.status===filter);
    $('#orderHistory').innerHTML=`<div class="order-history-row header"><span></span><span>ID</span><span>Contract</span><span>Side</span><span>Type</span><span>Qty</span><span>Price</span><span>Status</span></div>`+list.map(o=>`<div class="order-history-row"><input class="row-check order-check" type="checkbox" data-order-id="${o.id}"><span>${o.id}</span><span>${o.contract}</span><span class="${o.side==='BUY'?'up':'down'}">${o.side}</span><span>${o.type}</span><span>${o.qty}</span><span>${Number(o.price).toFixed(2)}</span><span>${o.note}</span></div>`).join('');
  }

  function updateMetrics(){
    state.positions.forEach((p,i)=>{
      if(p.status!=='Open')return;
      if(i===0){p.last=state.last;p.pnl=Math.round((p.last-p.avg)*p.qty*50000)}
    });
    const cl=state.positions[0];
    if(cl&&cl.status==='Open'){
      $('#unrealizedPnl').textContent=`CNY ${cl.pnl>=0?'+':''}${fmt(cl.pnl,0)}`;
      $('#unrealizedPnl').className=cl.pnl>=0?'up':'down';
    }
  }

  function updatePriceUI(){
    const move=state.last-state.prevClose,pct=move/state.prevClose*100,cls=move>=0?'up':'down';
    $('#lastPrice').textContent=state.last.toFixed(2);$('#priceMove').textContent=`${move>=0?'+':''}${move.toFixed(2)}  ${pct>=0?'+':''}${pct.toFixed(2)}%`;$('#priceMove').className=cls;
    $('#openVal').textContent=state.open.toFixed(2);$('#highVal').textContent=state.high.toFixed(2);$('#lowVal').textContent=state.low.toFixed(2);$('#volumeVal').textContent=fmt(state.volume,0);$('#oiVal').textContent=fmt(state.openInterest,0);
    $('#bookMidPrice').textContent=state.last.toFixed(2);$('#bookMidMove').textContent=`${pct>=0?'+':''}${pct.toFixed(2)}%`;$('#bookMidMove').className=cls;$('#priceMarker').textContent=state.last.toFixed(2);$('#priceMarker').style.background=move>=0?'#ff5656':'#22c784';$('#priceMarker').style.display=state.marker?'block':'none';
    $('#crosshairLabel').textContent=`${state.symbol}  O ${state.open.toFixed(2)}  H ${state.high.toFixed(2)}  L ${state.low.toFixed(2)}  C ${state.last.toFixed(2)}`;
    $('#tickerCL').textContent=state.last.toFixed(2);$('#tickerCLMove').textContent=`${pct>=0?'+':''}${pct.toFixed(2)}%`;$('#tickerCLMove').className=cls;
    const lastWatch=state.watchSets.futures[0];lastWatch[1]=state.last.toFixed(2);lastWatch[2]=`${pct>=0?'+':''}${pct.toFixed(2)}%`;
    const liveWatchRow=document.querySelector('[data-watch-symbol="CL"]');
    if(liveWatchRow){
      const cells=liveWatchRow.querySelectorAll('span');
      if(cells[0]) cells[0].textContent=state.last.toFixed(2);
      if(cells[1]){cells[1].textContent=lastWatch[2];cells[1].className=cls;}
    }
    updateMetrics();
  }

  function tickMarket(){
    if(!state.animation)return;
    let drift=state.trend;
    if(state.scene==='dip') drift=-.075;
    if(state.scene==='rebound') drift=.095;
    if(state.scene==='volatile') drift=Math.sin(Date.now()/850)*.07;
    const change=drift+rand(-state.volatility,state.volatility);
    state.last=clamp(state.last+change,71,98);
    state.high=Math.max(state.high,state.last);state.low=Math.min(state.low,state.last);state.volume+=Math.round(rand(90,870));state.openInterest+=Math.round(rand(-180,260));
    const c=state.candles[state.candles.length-1];c.close=state.last;c.high=Math.max(c.high,state.last);c.low=Math.min(c.low,state.last);c.volume+=Math.round(rand(60,420));state.ticksInCandle++;
    if(state.ticksInCandle>=8){state.ticksInCandle=0;const next={open:state.last,high:state.last+rand(.03,.16),low:state.last-rand(.03,.16),close:state.last,volume:Math.round(rand(500,1400))};state.candles.push(next);if(state.candles.length>110)state.candles.shift();state.equityCurve.push((state.equityCurve.at(-1)||7000000)+change*520000+rand(-70000,95000));if(state.equityCurve.length>100)state.equityCurve.shift()}
    updatePriceUI();drawPriceChart(canvases.main,state.candles);drawSubChart();
  }

  function selectSymbol(symbol){
    const map={CL:['WTI Crude Oil Futures',82.63],BZ:['Brent Crude Oil Futures',86.14],GC:['Gold Futures',2391.30],ES:['S&P 500 E-mini Futures',5511.25],NQ:['Nasdaq 100 E-mini Futures',19824.50],DXY:['U.S. Dollar Index',103.42],USDCNH:['U.S. Dollar / Offshore Yuan',7.1182],NEVA:['Nevata Robotics Group',92.18],QTRN:['Quarton Data Systems',141.09]};
    const item=map[symbol]||['Global Market Instrument',rand(40,180)];state.symbol=symbol;state.title=item[0];state.last=item[1];state.prevClose=state.last*(1-rand(-.008,.018));state.open=state.prevClose+rand(-.4,.4);state.high=Math.max(state.open,state.last)+rand(.1,.6);state.low=Math.min(state.open,state.last)-rand(.1,.6);state.candles=makeInitialCandles();
    $('#symbolCode').textContent=symbol;$('#symbolTitle').textContent=item[0];$('#symbolSearch').value=`${symbol} · ${item[0]}`;renderWatch($('.watch-tab.active')?.dataset.watch||'futures');updatePriceUI();drawAll();toast(`${symbol} loaded`);
  }

  function switchPage(panelId){
    $$('.page').forEach(p=>p.classList.toggle('active',p.id===panelId));$$('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===panelId));$('#sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});setTimeout(drawAll,40);
  }

  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),1600)}
  function openModal(id){$('#'+id).classList.remove('hidden')}
  function closeModals(){$$('.modal-backdrop').forEach(m=>m.classList.add('hidden'))}

  function previewOrder(){
    const side=state.selectedSide,qty=Math.max(1,parseInt($('#orderQty').value)||1),price=parseFloat($('#orderPrice').value)||state.last,type=$('#orderType').value,contract=$('#contractSelect').value;
    $('#orderPreview').innerHTML=[['Side',side],['Contract',contract],['Order Type',type],['Quantity',qty],['Limit Price',price.toFixed(2)],['Estimated Margin',$('#marginEstimate').textContent],['Take Profit',$('#takeProfit').value],['Stop Loss',$('#stopLoss').value]].map(([a,b])=>`<div><span>${a}</span><strong>${b}</strong></div>`).join('');openModal('orderModal');
  }

  function placeOrder(){
    const side=state.selectedSide,qty=Math.max(1,parseInt($('#orderQty').value)||1),price=parseFloat($('#orderPrice').value)||state.last,type=$('#orderType').value,contract=$('#contractSelect').value;
    const id=String(state.nextOrderId++);state.orders.unshift({id,status:type==='Market'?'filled':'working',side,contract,type,qty,price,note:type==='Market'?'Executed':'Working'});renderOrders($('.order-filter.active').dataset.orderFilter);closeModals();toast(`${side} order ${id} submitted`);
    if(type==='Market'){
      const p=state.positions.find(x=>x.contract===contract&&x.status==='Open');
      if(p){const total=p.avg*p.qty+price*qty;p.qty+=qty;p.avg=total/p.qty}else state.positions.push({contract,side:side==='BUY'?'LONG':'SHORT',qty,avg:price,last:state.last,margin:qty*58000,pnl:0,status:'Open'});
      state.positionsClosed=false;renderPositions();
    }
  }

  function closeAll(){
    if(state.positionsClosed){toast('No open positions');return}
    state.positions.forEach(p=>{p.status='Closed';p.qty=0;p.pnl=0});state.positionsClosed=true;state.orders=state.orders.map(o=>o.status==='working'?{...o,status:'cancelled',note:'Cancelled'}:o);renderPositions();renderOrders();$('#settlementCard').classList.remove('hidden');toast('All positions closed and settlement prepared');
  }

  async function runScenario(){
    const btn=$('#runScenarioBtn');if(btn.disabled)return;btn.disabled=true;const log=$('#scenarioLog');log.innerHTML='';
    const steps=[
      ['stage1Status','Price washout detected. Waiting for support confirmation.','dip',1700],
      ['stage2Status','First tranche filled near lower support. Additional orders staged.','volatile',1700],
      ['stage2Status','Second and third tranches filled. Average entry improved.','rebound',1700],
      ['stage3Status','Momentum expanded. Partial profit orders executed.','rebound',1700],
      ['stage4Status','Final contracts closed. Settlement statement is available.','calm',1700]
    ];
    for(let i=0;i<steps.length;i++){
      const [id,msg,scene,delay]=steps[i];state.scene=scene==='calm'?'normal':scene;$('#'+id).textContent=i===steps.length-1?'Completed':'Active';$('#'+id).className=i===steps.length-1?'good':'up';const line=document.createElement('div');line.textContent=`[${String(i+1).padStart(2,'0')}] ${msg}`;log.append(line);log.scrollTop=log.scrollHeight;await new Promise(r=>setTimeout(r,delay));
    }
    closeAll();switchPage('accountPanel');$('#settlementCard').classList.remove('hidden');btn.disabled=false;
  }

  function applyScene(scene){
    state.scene=scene==='calm'?'normal':scene;
    const map={dip:['Sharp dip mode active',-.075,.23],rebound:['Fast rebound mode active',.095,.20],volatile:['High volatility mode active',0,.34],calm:['Normal market mode active',.012,.18]};const [msg,tr,vol]=map[scene];state.trend=tr;state.volatility=vol;toast(msg);
  }

  function initEvents(){
    $$('[data-panel]').forEach(b=>b.addEventListener('click',()=>switchPage(b.dataset.panel)));
    $('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
    $$('[data-scene]').forEach(b=>b.onclick=()=>applyScene(b.dataset.scene));
    $$('.watch-tab').forEach(b=>b.onclick=()=>{$$('.watch-tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderWatch(b.dataset.watch)});
    $$('.timeframes button').forEach(b=>b.onclick=()=>{$$('.timeframes button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.selectedTimeframe=b.dataset.tf;toast(`Timeframe changed to ${b.dataset.tf}`)});
    $$('[data-indicator]').forEach(b=>b.onclick=()=>{b.classList.toggle('active');toast(`${b.dataset.indicator.toUpperCase()} ${b.classList.contains('active')?'enabled':'disabled'}`)});
    $$('.buy-sell-toggle button').forEach(b=>b.onclick=()=>{$$('.buy-sell-toggle button').forEach(x=>x.classList.remove('active'));b.classList.add('active');state.selectedSide=b.dataset.side;$('#placeOrderBtn').textContent=`Place ${b.dataset.side==='BUY'?'Buy':'Sell'} Order`;$('#placeOrderBtn').className=`primary ${b.dataset.side==='BUY'?'buy-primary':'sell-primary'}`});
    $('#previewOrderBtn').onclick=previewOrder;$('#placeOrderBtn').onclick=previewOrder;$('#confirmOrderBtn').onclick=placeOrder;
    $$('[data-open-modal]').forEach(b=>b.onclick=()=>openModal(b.dataset.openModal));$$('[data-close-modal]').forEach(b=>b.onclick=closeModals);$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModals()}));
    $('#pauseTapeBtn').onclick=()=>{state.tapePaused=!state.tapePaused;$('#pauseTapeBtn').textContent=state.tapePaused?'Resume':'Pause'};
    $('#depthToggle').onclick=()=>{$('#depthToggle').textContent=$('#depthToggle').textContent==='Depth 10'?'Depth 5':'Depth 10';toast('Order book depth changed')};
    $('#fullscreenBtn').onclick=()=>{const el=$('#chartStage');if(document.fullscreenElement)document.exitFullscreen();else el.requestFullscreen?.()};
    $('#gridToggle').onchange=e=>{state.grid=e.target.checked;drawAll()};$('#animationToggle').onchange=e=>{state.animation=e.target.checked};$('#markerToggle').onchange=e=>{state.marker=e.target.checked;updatePriceUI()};
    $('#searchBtn').onclick=()=>{const q=$('#symbolSearch').value.trim().split(/\s|·/)[0].toUpperCase();selectSymbol(q||'CL')};$('#symbolSearch').addEventListener('keydown',e=>{if(e.key==='Enter')$('#searchBtn').click()});
    $$('[data-symbol]').forEach(b=>b.onclick=()=>selectSymbol(b.dataset.symbol));
    $('#addSymbolBtn').onclick=()=>{if(!state.watchSets.futures.some(x=>x[0]==='RB'))state.watchSets.futures.push(['RB','2.86','+0.24%']);renderWatch('futures');toast('RB added to futures watchlist')};
    $('#orderQty').oninput=()=>{const q=Math.max(1,parseInt($('#orderQty').value)||1);$('#marginEstimate').textContent=`CNY ${fmt(q*57440,0)}`};
    $$('.order-filter').forEach(b=>b.onclick=()=>{$$('.order-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderOrders(b.dataset.orderFilter)});
    $('#cancelSelectedBtn').onclick=()=>{const ids=$$('.order-check:checked').map(x=>x.dataset.orderId);if(!ids.length){toast('Select at least one order');return}state.orders=state.orders.map(o=>ids.includes(o.id)&&o.status==='working'?{...o,status:'cancelled',note:'Cancelled'}:o);renderOrders($('.order-filter.active').dataset.orderFilter);toast(`${ids.length} order(s) updated`)};
    $('#exportOrdersBtn').onclick=()=>toast('Order report prepared');
    $('#reduceBtn').onclick=()=>{const p=state.positions.find(x=>x.status==='Open');if(!p){toast('No open position');return}p.qty=Math.max(0,p.qty-15);p.pnl=Math.round(p.pnl*.82);renderPositions();toast('Position reduced by 15 contracts')};
    $('#closeAllBtn').onclick=closeAll;$('#runScenarioBtn').onclick=runScenario;
    $('#statementBtn').onclick=()=>{$('#settlementCard').classList.toggle('hidden');toast($('#settlementCard').classList.contains('hidden')?'Statement hidden':'Settlement statement displayed')};
    $('#hideBalanceBtn').onclick=()=>{state.hiddenValues=!state.hiddenValues;$$('.maskable').forEach(x=>x.classList.toggle('mask',state.hiddenValues));$('#hideBalanceBtn').textContent=state.hiddenValues?'Show Values':'Hide Values'};
    $('#layout1Btn').onclick=()=>{$('#multiChartGrid').classList.remove('two');$('#multiChart2').classList.add('hidden');$('#layout1Btn').classList.add('active');$('#layout2Btn').classList.remove('active');setTimeout(drawAll,30)};
    $('#layout2Btn').onclick=()=>{$('#multiChartGrid').classList.add('two');$('#multiChart2').classList.remove('hidden');$('#layout2Btn').classList.add('active');$('#layout1Btn').classList.remove('active');setTimeout(drawAll,30)};
    $('#resetChartBtn').onclick=()=>{state.candles=makeInitialCandles();drawAll();toast('Chart reset')};
    $('#mainCanvas').addEventListener('mousemove',e=>{const r=e.target.getBoundingClientRect();const idx=Math.floor((e.clientX-r.left)/r.width*state.candles.length);const c=state.candles[clamp(idx,0,state.candles.length-1)];$('#crosshairLabel').textContent=`${state.symbol}  O ${c.open.toFixed(2)} H ${c.high.toFixed(2)} L ${c.low.toFixed(2)} C ${c.close.toFixed(2)} V ${fmt(c.volume,0)}`});
    $('#mainCanvas').addEventListener('mouseleave',updatePriceUI);
  }

  function init(){
    renderWatch();renderBook();for(let i=0;i<10;i++)addTape();renderPositions();renderOrders();drawAll();updatePriceUI();initEvents();
    setInterval(tickMarket,620);setInterval(renderBook,760);setInterval(addTape,540);setInterval(()=>{drawFlow();drawEquity();const s=clamp(64+Math.sin(Date.now()/5000)*12+rand(-3,3),20,91);$('#sentimentFill').style.width=`${s}%`;$('#sentimentText').textContent=s>65?'Risk-On':s<42?'Risk-Off':'Balanced';},1350);
    setInterval(()=>{['tickerBZ','tickerGC','tickerES','tickerNQ','tickerDXY','tickerCNH'].forEach(id=>{const el=$('#'+id);if(!el)return;const raw=parseFloat(el.textContent.replaceAll(',',''));const next=raw*(1+rand(-.00035,.00035));el.textContent=next>1000?fmt(next,2):next.toFixed(4>next?4:2)});},1100);
  }

  window.addEventListener('resize',()=>setTimeout(drawAll,50));
  init();
})();
