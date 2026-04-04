window.addEventListener("load", async () => {
  let res = await post("取得全資料");
  列表區.innerHTML = "";
  Object.entries(res.data).forEach(([sheet_name, rows]) => {
    rows.forEach(row => show_row(sheet_name, row));
  });
  [...症候群set].forEach(症候群名稱 => {
    let opt = new_el("input", {type: "checkbox", name: "症候群", value: 症候群名稱});
    new_el_to_el(症候群, "label", [
      opt, new_el("span", 症候群名稱)
    ]);
    opt.checked = true;
    opt.addEventListener("change", 更新搜尋);
  });
  [...參照set].forEach(參照名稱 => {
    let opt = new_el("input", {type: "checkbox", name: "參照", value: 參照名稱});
    new_el_to_el(參照, "label", [
      opt, new_el("span", 參照名稱)
    ]);
    opt.checked = true;
    opt.addEventListener("change", 更新搜尋);
  });
});

function 更新搜尋() {
  let 目標症候群 = [...find_all(`[name="症候群"]:checked`)].map(opt => opt.value);
  let 目標參照 = [...find_all(`[name="參照"]:checked`)].map(opt => opt.value);
  [...列表區.children].forEach(資料 => {
    let 顯示 = true;
    if(!目標症候群.includes(資料.data.症候群)) 顯示 = false;
    let 有資料參照 = 資料.data.參照arr.find(資料參照 => 目標參照.includes(資料參照));
    if(!有資料參照) 顯示 = false;
    資料.style.display = 顯示 ? "" : "none";
  });
}

const 症候群set = new Set();
const 參照set = new Set();

function show_row(sheet_name, row) {
  症候群set.add(sheet_name);
  row.症候群 = sheet_name;
  let 名稱 = row.名稱.replace(/\n/, "").replace(/（/g, "(").replace(/）/g, ")");
  let row_el = new_el_to_el(列表區, "div.資料", [
    new_el("div.症候群", sheet_name),
    new_el("div.名稱", [
      new_el("span.中文", 名稱.split("\(")[0]),
      new_el("span.日文", 名稱.replace(/^[^\(]*/, "")),
    ]),
    new_el("div.最大等級", row.最大等級),
    new_el("div.時機", row.時機),
    new_el("div.技能", row.技能),
    new_el("div.難易度", row.難易度),
    new_el("div.對象", row.對象),
    new_el("div.射程", row.射程),
    new_el("div.侵蝕值", row.侵蝕值),
    new_el("div.限制", row.限制),
    new_el("div.次數", row.次數),
    new_el("div.效果", row.效果),
    new_el("div.參照", row.參照),
  ]);
  row.參照arr = [];
  row.參照.split("\n").forEach(str => {
    let 參照名 = str.split("P")[0];
    參照set.add(參照名);
    row.參照arr.push(參照名);
  });
  row_el.data = row;
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
