const categories = [
  { id: "all", name: "全部菜品", icon: "✦" },
  { id: "wagyu", name: "臻选和牛", icon: "牛" },
  { id: "seafood", name: "海鲜刺身", icon: "鲜" },
  { id: "grill", name: "炭火烧烤", icon: "炙" },
  { id: "pot", name: "锅物汤羹", icon: "汤" },
  { id: "hot", name: "中式热菜", icon: "火" },
  { id: "staple", name: "时蔬主食", icon: "食" },
  { id: "dessert", name: "甜品饮品", icon: "茶" }
];

const rawDishes = [
  ["wagyu-slices","A5和牛薄切拼盘","大理石雪花细腻，涮烤皆宜，入口柔嫩丰腴","wagyu","c",0,"镇店必点",true],
  ["foie-gras","法式煎鹅肝","表层焦香，内里细腻丰润，搭配无花果酱","wagyu","c",1,"人气必点",true],
  ["king-crab","整只帝王蟹","整蟹上桌，蟹腿饱满，鲜甜紧实","seafood","c",2,"镇店招牌",true],
  ["sashimi","豪华刺身拼盘","三文鱼、金枪鱼、甜虾等时令鲜切","seafood","c",3,"鲜切推荐",true],
  ["wagyu-cubes","炭烤和牛骰子","炭火焦香，肉汁丰盈，配海盐与现磨黑椒","wagyu","c",4,"主厨推荐"],
  ["lobster","黄油焗龙虾","黄油蒜香衬托龙虾鲜甜，肉质弹嫩","seafood","c",5,"限时鲜活"],
  ["uni","海胆甜虾刺身","海胆绵密鲜甜，甜虾晶莹柔嫩","seafood","c",6,"人气"],
  ["truffle-soup","松露奶油蘑菇汤","菌菇香气浓郁，口感柔滑温润","pot","c",7,""],
  ["sparkling-water","青柠气泡矿泉水","冰爽气泡配鲜切青柠，清新解腻","dessert","c",8,""],
  ["beef-stew","招牌番茄牛腩锅","慢炖牛腩软烂入味，番茄汤底浓郁鲜甜","hot","a",0,"招牌"],
  ["fish","金汤酸菜鱼","鲜嫩鱼片配金汤酸菜，酸香开胃","seafood","a",1,"人气"],
  ["ribs","蒜香烤排骨","外焦里嫩，蒜香与肉汁层层交融","grill","a",2,"招牌"],
  ["beef","黑椒牛肉粒","精选牛里脊，大火快炒锁住鲜嫩","wagyu","a",3,""],
  ["chicken","宫保鸡丁","鸡肉嫩滑，花生酥香，荔枝口回味","hot","a",4,""],
  ["tofu","麻婆豆腐","豆腐嫩滑，麻辣鲜香，红油明亮","hot","a",5,""],
  ["cauliflower","干锅有机花菜","干香爽脆，腊肉提鲜，锅气十足","staple","a",6,""],
  ["cabbage","上汤娃娃菜","高汤慢煨，清爽不失鲜美","staple","a",7,""],
  ["rice","扬州海鲜炒饭","米粒分明，虾仁弹嫩，咸鲜适口","staple","a",8,""],
  ["pigeon","脆皮乳鸽","表皮酥脆，肉质细嫩多汁","grill","b",0,"推荐"],
  ["squirrel-fish","松鼠桂鱼","外酥里嫩，酸甜汁明亮开胃","seafood","b",1,"招牌"],
  ["spicy-beef","小炒黄牛肉","鲜香微辣，牛肉滑嫩，锅气十足","wagyu","b",2,""],
  ["shrimp","香辣大虾","虾肉弹嫩，香辣酥香，越吃越上瘾","seafood","b",3,""],
  ["scallop","蒜蓉粉丝扇贝","蒜香浓郁，粉丝吸足鲜甜汤汁","seafood","b",4,""],
  ["ciba","红糖糍粑","外酥内糯，红糖香甜不腻","dessert","b",5,""],
  ["rice-wine","桂花酒酿圆子","桂花清香，小圆子软糯温润","dessert","b",6,""],
  ["mango","杨枝甘露","芒果香浓，西柚清爽，层次丰富","dessert","b",7,""],
  ["tea","青柠茉莉冰茶","茉莉清香与青柠酸甜清爽平衡","dessert","b",8,""],
  ["oyster","蒜蓉粉丝生蚝","鲜活生蚝覆蒜蓉粉丝，蒸制锁住海味","seafood","d",0,"鲜活"],
  ["abalone","葱油蒸鲍鱼","鲍鱼弹嫩，热葱油激出鲜香","seafood","d",1,"每日限量"],
  ["eel","盐烤海鳗","表皮微焦，鱼肉细嫩，海盐提鲜","grill","d",2,""],
  ["lamb-chop","炭烤法式羊排","香草炭烤，外焦里嫩，肉汁充盈","grill","d",3,"主厨推荐"],
  ["roast-duck","金牌片皮烤鸭","酥皮现片，配薄饼、甜面酱与时蔬","grill","d",4,"招牌"],
  ["smoked-chicken","茶香烟熏鸡","茶香入味，鸡皮紧致，肉质鲜嫩","grill","d",5,""],
  ["egg-custard","松露海鲜蒸蛋","蒸蛋细滑如布丁，松露与海鲜提香","seafood","d",6,"新品"],
  ["asparagus-roll","黑椒芦笋牛肉卷","牛肉包裹鲜嫩芦笋，黑椒香气饱满","wagyu","d",7,""],
  ["tempura","时令蔬菜天妇罗","轻薄酥衣锁住时蔬清甜","staple","d",8,""],
  ["matsutake-soup","松茸清汤","松茸与清鸡汤慢煨，清澈鲜醇","pot","e",0,"养生"],
  ["chawanmushi","海鲜茶碗蒸","鲜虾、鱼籽与嫩滑蒸蛋相融","pot","e",1,""],
  ["wagyu-fried-rice","和牛粒炒饭","和牛脂香包裹米粒，粒粒分明","staple","e",2,"人气"],
  ["crab-noodle","蟹粉拌面","蟹黄蟹肉浓郁鲜香，手工细面筋道","staple","e",3,"时令"],
  ["seafood-congee","砂锅海鲜粥","鲜虾贝类慢熬，米香绵密暖胃","staple","e",4,""],
  ["matcha-tiramisu","抹茶提拉米苏","抹茶微苦平衡奶香，口感轻盈","dessert","e",5,"新品"],
  ["lobster-tail","蒜香粉丝焗龙虾尾","龙虾尾铺蒜香粉丝，高温焗出鲜甜汁水","seafood","new",0,"鲜活新品"],
  ["snow-crab-legs","清蒸雪蟹腿","原味清蒸保留海味，蟹肉细嫩清甜","seafood","new",1,"每日鲜选"],
  ["salmon-salad","三文鱼牛油果沙拉","厚切三文鱼搭配牛油果与清爽油醋汁","seafood","new",2,"轻食"],
  ["grilled-mackerel","日式盐烤青花鱼","海盐慢烤，鱼皮焦脆，肉质丰润","grill","new",3,""],
  ["sukiyaki","和牛寿喜烧锅","和牛、菌菇与时蔬同煮，甜咸醇厚","pot","new",4,"人气锅物"],
  ["seafood-tofu-pot","海鲜豆腐煲","鲜虾贝类与嫩豆腐煨入浓郁高汤","pot","new",5,"暖胃"],
  ["lamb-skewers","孜然羊肉串","炭火现烤，外焦里嫩，孜然香气饱满","grill","new",6,"现烤"],
  ["fried-squid","酥炸鱿鱼圈","薄衣酥脆，鱿鱼弹嫩，搭配自制蘸酱","hot","new",7,"小食"],
  ["truffle-mash","黑松露土豆泥","绵密土豆融入黑松露香气，细腻顺滑","staple","new",8,"新品"],
  ["butter-mushroom","蒜香黄油口蘑","黄油慢煎锁住菌菇汁水，蒜香浓郁","staple","new",9,""],
  ["coconut-pudding","椰香奶冻","椰香清甜，口感柔滑冰凉","dessert","new",10,"清爽"],
  ["strawberry-mille","草莓千层蛋糕","轻盈奶油与鲜草莓层层交叠","dessert","new",11,"限定"]
];

const dishes = rawDishes.map(([id,name,desc,cat,sheet,pos,badge,featured=false]) => ({
  id,name,desc,cat,sheet,pos,badge,featured,
  image: window.TANGQUAN_ASSETS[id]
}));

let activeCat = "all";
let query = "";
let cart = JSON.parse(localStorage.getItem("tangquan-order-cart") || "{}");
let cartOpen = false;
let orderStep = "cart";
let pendingClear = false;
let selectedNotes = new Set();
const app = document.querySelector("#app");

const cartCount = () => Object.values(cart).reduce((sum, n) => sum + n, 0);
const kindCount = () => Object.keys(cart).length;
const persist = () => localStorage.setItem("tangquan-order-cart", JSON.stringify(cart));
const selectedDishes = () => dishes.filter(d => cart[d.id]);

function changeQty(id, delta) {
  cart[id] = Math.max(0, (cart[id] || 0) + delta);
  if (!cart[id]) delete cart[id];
  orderStep = "cart";
  pendingClear = false;
  persist();
  syncCartUI(id);
  showToast(delta > 0 ? "已加入点菜单" : "已调整数量");
}

function removeDish(id) {
  const dish = dishes.find(item => item.id === id);
  delete cart[id];
  orderStep = "cart";
  pendingClear = false;
  persist();
  syncCartUI(id);
  showToast(`${dish?.name || "菜品"}已删除`);
}

function clearCart() {
  cart = {};
  orderStep = "cart";
  pendingClear = false;
  persist();
  syncCartUI();
  showToast("购物车已清空");
}

function showToast(text) {
  const toast = document.querySelector(".toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 1300);
}

function renderQty(d, compact = false) {
  const n = cart[d.id] || 0;
  if (!n && !compact) {
    return `<button class="add-btn" data-add="${d.id}" aria-label="添加${d.name}"><span>＋</span></button>`;
  }
  return `<div class="qty">
    <button data-minus="${d.id}" aria-label="减少${d.name}">−</button>
    <b>${n}</b>
    <button class="plus" data-add="${d.id}" aria-label="增加${d.name}">＋</button>
  </div>`;
}

function syncCartUI(changedId) {
  if (changedId) {
    const dish = dishes.find(item => item.id === changedId);
    if (dish) {
      document.querySelectorAll(`[data-dish="${changedId}"] .dish-foot`).forEach(foot => {
        foot.innerHTML = `<div class="price"><small>尊享</small>不限量</div>${renderQty(dish)}`;
      });
    }
  } else {
    document.querySelectorAll("[data-dish]").forEach(card => {
      const dish = dishes.find(item => item.id === card.dataset.dish);
      const foot = card.querySelector(".dish-foot");
      if (dish && foot) foot.innerHTML = `<div class="price"><small>尊享</small>不限量</div>${renderQty(dish)}`;
    });
  }

  const count = cartCount();
  const kinds = kindCount();
  const cartBadge = document.querySelector(".cart-count");
  const cartLabel = document.querySelector(".cart-label span");
  const total = document.querySelector(".total strong");
  const checkout = document.querySelector(".checkout");
  if (cartBadge) cartBadge.textContent = count;
  if (cartLabel) cartLabel.textContent = count ? `${kinds} 种，共 ${count} 份` : "点击菜品右下角添加";
  if (total) total.innerHTML = `${kinds}<em>种</em> · ${count}<em>份</em>`;
  if (checkout) checkout.disabled = !count;

  if (cartOpen && orderStep === "cart") {
    const content = document.querySelector(".sheet-content");
    const sheetTotal = document.querySelector(".sheet-total");
    const submit = document.querySelector(".sheet-submit");
    if (content) content.innerHTML = renderCartContent();
    if (sheetTotal) sheetTotal.innerHTML = `<span>共 ${kinds} 种菜品</span><strong>${count} <small>份</small></strong>`;
    if (submit) submit.disabled = !count;
  }
}

function renderCartContent() {
  if (orderStep === "success") {
    return `<div class="order-success">
      <div class="success-mark">✓</div>
      <h3>下单成功</h3>
      <p>后厨已收到您的点单<br>餐品将按出餐顺序送至 08 号桌</p>
      <button class="continue-order">继续加菜</button>
    </div>`;
  }
  const rows = selectedDishes();
  if (!rows.length) {
    return `<div class="cart-empty"><i>餐</i><b>还没有选择菜品</b><p>从菜单中挑选喜欢的菜吧</p></div>`;
  }
  if (orderStep === "confirm") {
    return `<div class="confirm-intro">
      <span class="confirm-icon">✓</span>
      <div><b>请确认本次菜单</b><p>确认菜品与份数无误后再提交后厨</p></div>
    </div>
    <div class="confirm-list">${rows.map(d => `<div class="confirm-row">
      <img src="${d.image}" alt="">
      <div><b>${d.name}</b><span>尊享不限量 · 现点现做</span></div>
      <strong>× ${cart[d.id]}</strong>
    </div>`).join("")}</div>
    <div class="confirm-meta">
      <div><span>桌号</span><b>自助区 · 08号牌</b></div>
      <div><span>菜品合计</span><b>${kindCount()} 种 · ${cartCount()} 份</b></div>
      <div><span>用餐备注</span><b>${selectedNotes.size ? [...selectedNotes].join("、") : "无"}</b></div>
    </div>`;
  }
  return `<div class="cart-tools">
      <span>可直接调整份数，减到 0 即删除</span>
      <button class="${pendingClear ? "armed" : ""}" data-clear-cart>${pendingClear ? "再次点击确认清空" : "清空购物车"}</button>
    </div>
    <div class="cart-list">${rows.map(d => `<div class="cart-row">
    <img src="${d.image}" alt="">
    <div class="cart-dish-copy"><b>${d.name}</b><span>尊享不限量 · 现点现做</span></div>
    <div class="cart-actions">${renderQty(d, true)}<button class="remove-dish" data-remove="${d.id}" aria-label="删除${d.name}">删除</button></div>
  </div>`).join("")}</div>
  <div class="order-note">
    <span>用餐备注</span>
    <div>${["少辣","不加香菜","分批上菜","先上主菜"].map(note => `<button class="${selectedNotes.has(note) ? "active" : ""}" data-note="${note}">${note}</button>`).join("")}</div>
  </div>`;
}

function matchesCategory(d) {
  if (activeCat === "all") return true;
  return d.cat === activeCat;
}

function render() {
  const filtered = dishes.filter(d =>
    matchesCategory(d) && (!query || `${d.name}${d.desc}${d.badge}`.includes(query))
  );
  const activeName = categories.find(c => c.id === activeCat)?.name || "全部菜品";
  const heroStats = [
    [String(dishes.length), "道臻选菜品"],
    ["不限量", "尊享权益"],
    ["现点现做", "送餐到桌"]
  ];

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand" aria-label="汤泉水会海鲜和牛自助区">
          <div class="brand-seal">泉</div>
          <div class="brand-copy"><strong>汤泉水会</strong><span>海鲜和牛自助区</span></div>
        </div>
        <label class="search">
          <span class="search-icon">⌕</span>
          <input id="search" value="${query}" placeholder="搜索菜品、食材或口味" aria-label="搜索菜品">
          <button class="clear-search" aria-label="清除搜索">×</button>
        </label>
        <div class="table-info"><b>自助区 · 08号牌</b><span><i></i>尊享权益已生效</span></div>
      </header>

      <section class="hero">
        <div class="hero-pattern"></div>
        <div class="hero-copy">
          <span class="hero-eyebrow">汤泉水会 · 尊享餐饮</span>
          <h1>鲜味上桌，<em>自在尽享</em></h1>
          <p>海鲜、和牛与时令风味，按需点选，不限份数</p>
        </div>
        <div class="hero-stats">
          ${heroStats.map(([value,label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}
        </div>
      </section>

      <main class="main">
        <nav class="categories" aria-label="菜品分类">
          <div class="category-title">菜品分类</div>
          ${categories.map(c => {
            const count = c.id === "all" ? dishes.length : dishes.filter(d => d.cat === c.id).length;
            return `<button class="cat ${c.id === activeCat ? "active" : ""}" data-cat="${c.id}">
              <span class="cat-icon">${c.icon}</span><span class="cat-name">${c.name}</span><span class="cat-count">${count}</span>
            </button>`;
          }).join("")}
          <div class="service-card"><span>✦</span><b>需要服务？</b><p>餐具、纸巾或其他需求</p><button data-service>呼叫服务员</button></div>
        </nav>

        <section class="menu-section">
          <div class="content-head">
            <div><span class="section-kicker">TODAY'S SELECTION</span><h2>${activeName}</h2><p>${query ? `找到 ${filtered.length} 道相关菜品` : `共 ${filtered.length} 道 · 每日现制，售完即止`}</p></div>
            <div class="fresh-note"><i></i>后厨实时接单</div>
          </div>
          <div class="dish-grid">
            ${filtered.length ? filtered.map(d => `<article class="dish-card" data-dish="${d.id}">
              <div class="food-photo">
                <img src="${d.image}" alt="${d.name}" loading="lazy">
                ${d.badge ? `<span class="badge">${d.badge}</span>` : ""}
                <span class="availability"><i></i>可点</span>
              </div>
              <div class="dish-body">
                <h3 class="dish-name">${d.name}</h3>
                <p class="dish-desc">${d.desc}</p>
                <div class="dish-foot"><div class="price"><small>尊享</small>不限量</div>${renderQty(d)}</div>
              </div>
            </article>`).join("") : `<div class="empty"><b>暂时没有找到相关菜品</b><p>试试搜索其他名称或切换分类</p></div>`}
          </div>
        </section>
      </main>
    </div>

    <div class="cartbar">
      <button class="cart-button" data-open-cart>
        <span class="cart-icon">点<i class="cart-count">${cartCount()}</i></span>
        <span class="cart-label"><b>已选菜品</b><span>${cartCount() ? `${kindCount()} 种，共 ${cartCount()} 份` : "点击菜品右下角添加"}</span></span>
      </button>
      <div class="total"><small>本次点单</small><strong>${kindCount()}<em>种</em> · ${cartCount()}<em>份</em></strong></div>
      <button class="checkout" ${cartCount() ? "" : "disabled"} data-open-cart>选好了</button>
    </div>

    <div class="overlay ${cartOpen ? "open" : ""}" id="overlay">
      <aside class="cart-sheet" role="dialog" aria-modal="true" aria-label="已选菜品">
        <div class="sheet-head"><div><span>${orderStep === "confirm" ? "ORDER REVIEW" : orderStep === "success" ? "ORDER RECEIVED" : "MY ORDER"}</span><h2>${orderStep === "confirm" ? "确认菜单" : orderStep === "success" ? "点单结果" : "已选菜品"}</h2></div><button class="sheet-close" aria-label="关闭">×</button></div>
        <div class="sheet-content">${renderCartContent()}</div>
        ${orderStep === "success" ? "" : `<div class="sheet-summary">
          <div class="sheet-total"><span>共 ${kindCount()} 种菜品</span><strong>${cartCount()} <small>份</small></strong></div>
          ${orderStep === "confirm"
            ? `<div class="confirm-buttons"><button class="back-edit">返回修改</button><button class="final-submit">确认提交</button></div>`
            : `<button class="sheet-submit" ${cartCount() ? "" : "disabled"}>确认菜单</button>`}
          <p>所有菜品均包含在尊享套餐内，无需额外付费</p>
        </div>`}
      </aside>
    </div>
    <div class="toast"></div>`;

  const input = document.querySelector("#search");
  const clear = document.querySelector(".clear-search");
  clear.style.display = query ? "grid" : "none";
  input.addEventListener("input", e => {
    query = e.target.value.trim();
    render();
    const next = document.querySelector("#search");
    next.focus();
    next.setSelectionRange(query.length, query.length);
  });
  clear.addEventListener("click", () => { query = ""; render(); });
  document.querySelectorAll("[data-cat]").forEach(button => button.addEventListener("click", () => {
    activeCat = button.dataset.cat;
    render();
    window.scrollTo({ top: 190, behavior: "smooth" });
  }));
  document.querySelectorAll("[data-service]").forEach(button => button.addEventListener("click", () => showToast("已呼叫服务员，请稍候")));
  const overlay = document.querySelector("#overlay");
  document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", () => {
    cartOpen = true;
    overlay.classList.add("open");
  }));
  document.querySelector(".sheet-close").addEventListener("click", () => {
    cartOpen = false;
    pendingClear = false;
    overlay.classList.remove("open");
  });
  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      cartOpen = false;
      pendingClear = false;
      overlay.classList.remove("open");
    }
  });
  document.querySelector(".sheet-submit")?.addEventListener("click", () => {
    if (!cartCount()) return;
    orderStep = "confirm";
    cartOpen = true;
    render();
  });
  document.querySelector(".back-edit")?.addEventListener("click", () => {
    orderStep = "cart";
    cartOpen = true;
    render();
  });
  document.querySelector(".final-submit")?.addEventListener("click", () => {
    orderStep = "success";
    cartOpen = true;
    render();
  });
  document.querySelector(".continue-order")?.addEventListener("click", () => {
    orderStep = "cart";
    cartOpen = false;
    cart = {};
    selectedNotes.clear();
    persist();
    render();
  });
}

render();

document.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  if (add) return changeQty(add.dataset.add, 1);

  const minus = event.target.closest("[data-minus]");
  if (minus) return changeQty(minus.dataset.minus, -1);

  const remove = event.target.closest("[data-remove]");
  if (remove) return removeDish(remove.dataset.remove);

  const noteButton = event.target.closest("[data-note]");
  if (noteButton) {
    const note = noteButton.dataset.note;
    selectedNotes.has(note) ? selectedNotes.delete(note) : selectedNotes.add(note);
    noteButton.classList.toggle("active");
    return;
  }

  const clear = event.target.closest("[data-clear-cart]");
  if (clear) {
    if (pendingClear) return clearCart();
    pendingClear = true;
    clear.classList.add("armed");
    clear.textContent = "再次点击确认清空";
    showToast("再次点击即可清空全部菜品");
  }
});
