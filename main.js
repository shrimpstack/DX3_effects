window.addEventListener("load", async () => {
  await 生成顯示();
  生成搜尋選項();
});

function 生成搜尋選項() {
  [...症候群set].forEach(症候群名稱 => {
    let opt = new_el("input", {type: "checkbox", name: "症候群", value: 症候群名稱});
    new_el_to_el(症候群, "label", [ opt, new_el("span", 症候群名稱) ]);
    opt.checked = true;
    opt.addEventListener("change", 更新搜尋);
  });
  [...類型set].forEach(類型名稱 => {
    let opt = new_el("input", {type: "checkbox", name: "異能類型", value: 類型名稱});
    new_el_to_el(異能類型, "label", [ opt, new_el("span", 類型名稱) ]);
    opt.checked = true;
    opt.addEventListener("change", 更新搜尋);
  });
  [...參照set].forEach(參照名稱 => {
    let opt = new_el("input", {type: "checkbox", name: "參照", value: 參照名稱});
    new_el_to_el(參照, "label", [ opt, new_el("span", 參照名稱) ]);
    opt.checked = true;
    opt.addEventListener("change", 更新搜尋);
  });
  [...時機set].forEach(時機名 => {
    let opt = new_el("input", {type: "checkbox", name: "時機", value: 時機名});
    new_el_to_el(時機, "label", [ opt, new_el("span", 時機名) ]);
    opt.checked = true;
    opt.addEventListener("change", 更新搜尋);
  });
}
function 更新搜尋() {
  let 目標症候群 = [...find_all(`[name="症候群"]:checked`)].map(opt => opt.value);
  let 目標類型 = [...find_all(`[name="異能類型"]:checked`)].map(opt => opt.value);
  let 目標參照 = [...find_all(`[name="參照"]:checked`)].map(opt => opt.value);
  let 目標時機 = [...find_all(`[name="時機"]:checked`)].map(opt => opt.value);
  [...列表區.children].slice(1).forEach(資料 => {
    let 顯示 = true;
    if(!目標症候群.includes(資料.data.症候群)) 顯示 = false;
    if(!目標類型.includes(資料.data.異能類型)) 顯示 = false;
    let 有資料參照 = 資料.data.參照arr.find(資料參照 => 目標參照.includes(資料參照));
    let 有符合時機 = 資料.data.時機arr.find(時機名 => 目標時機.includes(時機名));
    if(!有資料參照 || !有符合時機) 顯示 = false;
    資料.style.display = 顯示 ? "" : "none";
  });
}

const 症候群set = new Set();
const 參照set = new Set();
const 類型set = new Set();
const 時機set = new Set();

async function 生成顯示() {
  let res = await post("取得全資料");
  列表區.innerHTML = "";
  產生第一列();
  Object.entries(res.data).forEach(([sheet_name, rows]) => {
    rows.forEach(row => show_row(sheet_name, row));
  });
}
function 產生第一列() {
  new_el_to_el(列表區, "div.欄位名稱", [
    new_el("div.症候群", "症候群"),
    new_el("div.名稱", "名稱"),
    new_el("div.最大等級", "MaxLv"),
    new_el("div.資訊列", "資訊列"),
    new_el("div.參照", "參照"),
  ]);
}
function show_row(sheet_name, row) {
  let {show_data, el_data, copy_text_cnt} = 資料處理(sheet_name, row);

  /* 加入搜尋選項 */
  症候群set.add(el_data.症候群);
  類型set.add(el_data.異能類型);
  el_data.參照arr.forEach(參照名 => 參照set.add(參照名));
  el_data.時機arr.forEach(時機 => 時機set.add(時機));

  /* 顯示el */
  let row_el = new_el_to_el(列表區, "div.資料", [
    new_el("div.症候群", [
      new_el("span.主類別", show_data.主類別),
      new_el("span.副類別", show_data.副類別),
    ]),
    new_el("div.名稱", [
      new_el("span.中文", show_data.中文),
      new_el("span.日文", show_data.日文),
    ]),
    new_el("div.最大等級", show_data.最大等級),
    new_el("div.資訊列", show_data.資訊列.map(str => new_el("span", str))),
    new_el("div.效果", show_data.效果),
    new_el("div.參照", show_data.參照),
  ]);

  /* 複製資料 */
  row_el.addEventListener("click", () => copy_text(copy_text_cnt));

  /* 自帶資料 */
  row_el.data = el_data;
}
function 資料處理(sheet_name, row) {
  let show_data = {};
  let el_data = {};

  /* 搜尋用 */
  el_data.症候群 = sheet_name;
  el_data.異能類型 = row.異能類型;
  el_data.參照arr = [];
  row.參照.split("\n").forEach(str => {
    let 參照名 = str.split("P")[0];
    el_data.參照arr.push(參照名);
  });
  el_data.時機arr = [];
  row.時機 = row.時機.replace(/回應動作/g, "反應動作");
  row.時機 = row.時機.replace(/準備階段/g, "設置階段");
  row.時機.split("/").forEach(str => {
    el_data.時機arr.push(str);
  });

  /* 症候群 */
  show_data.主類別 = sheet_name;
  if(!["一般", "自動取得", "D露易絲"].includes(row.異能類型)) {
    show_data.副類別 = row.異能類型;
  }
  else show_data.副類別 = "";

  /* 名稱 */
  let 名稱 = row.名稱.replace(/\n/, "").replace(/（/g, "(").replace(/）/g, ")");
  show_data.中文 = 名稱.split("(")[0];
  show_data.日文 = row.日文 || 名稱.replace(/^[^\(]*|\(|\)/g, "");

  /* 限制、次數 */
  if(typeof row.限制 == "number") row.限制 = row.限制 * 100 + "%";
  row.限制 = row.限制.replace(/\n/g, "");
  row.次數 = row.次數.replace(/\n/g, "、");

  /* 資訊列 */
  show_data.資訊列 = [];
  let copy_資訊列 = [];
  let 需要參照效果 = false;
  ["時機", "技能", "難易度", "對象", "射程", "侵蝕值", "限制", "次數"].forEach(key => {
    if(!row[key] || row[key] == "－") return;
    copy_資訊列.push(`[${key}：${row[key]}]`);
    if(row[key] != "參照效果") show_data.資訊列.push(`${key}：${row[key]}`);
    else 需要參照效果 = true;
  });
  if(需要參照效果) show_data.資訊列.push("參照效果");

  /* 其他 */
  show_data.最大等級 = row.最大等級;
  show_data.效果 = row.效果;
  show_data.參照 = row.參照;

  /* 複製用 */
  let copy_類別 = show_data.主類別;
  if(show_data.副類別) copy_類別 += `(${show_data.副類別})`;
  let copy_text_cnt = [
    `${copy_類別}《${show_data.中文}》MaxLv:${show_data.最大等級}`,
    `${copy_資訊列.join(" ")}`,
    show_data.效果,
  ].join("\n");

  return {show_data, el_data, copy_text_cnt};
}

function post(action, data = {}) {
  if(!window.XMLHttpRequest) {
    alert('無法連線，請更換瀏覽器');
    return;
  }
  data.action = action || "";
  let url = "https://script.google.com/macros/s/AKfycbxS6mfefj3pDvHYW_PcuK90jyjq6nVLqVy2PninPZ2i-C9Exq4oypGTOzTrQs8rB8D7/exec";
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.responseType = "json";
    xhr.addEventListener("load", () => {
      if(xhr.status == 200) {
        resolve(xhr.response);
      }
      else {
        reject(xhr.status);
      }
    });
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    let content = JSON.stringify(data);
    xhr.send("content=" + encodeURI(content.replace(/\&/g, "＆")));
  });
}

const copy_textarea = new_el("textarea", {
  style: `position: fixed; bottom: 0; right: 0; opacity: 0; pointer-events: none;`
});
window.addEventListener("load", () => document.body.append(copy_textarea));
function copy_text(text) {
  copy_textarea.value = text;
  copy_textarea.select();
  document.execCommand("copy");
}
