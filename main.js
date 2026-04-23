window.addEventListener("load", async () => {
  await 生成顯示();
  生成搜尋選項();
  效果顯示.addEventListener("change", 效果顯示切換);
  日文顯示.addEventListener("change", 日文顯示切換);
  效果顯示切換();
  日文顯示切換();
});

function 效果顯示切換() {
  列表區.classList.toggle("效果顯示", 效果顯示.checked);
  選擇區.classList.toggle("效果顯示", 效果顯示.checked);
}
function 日文顯示切換() {
  列表區.classList.toggle("日文顯示", 日文顯示.checked);
  選擇區.classList.toggle("日文顯示", 日文顯示.checked);
}

function 加到已選技能(row, show_data, el_data) {
  let 種別 = "";
  if(row.異能類型 == "自動取得") 種別 = "auto";
  else if(row.異能類型 == "簡易") 種別 = "easy";
  else if(row.異能類型 == "D露易絲") 種別 = "dlois";
  let 技能json = {
    名稱: show_data.中文,
    等級: 1,
    時機: row.時機.replace(/\n/g, " "),
    技能: row.技能.replace(/\n/g, " "),
    難易度: row.難易度.replace(/\n/g, " "),
    對象: row.對象.replace(/\n/g, " "),
    射程: row.射程.replace(/\n/g, " "),
    侵蝕: (row.侵蝕值 + "").replace(/\n/g, " "),
    限制: row.限制.replace(/\n/g, " "),
    種別: 種別,
    經驗修正: 0,
    註記: show_data.效果.replace(/\n/g, " "),
  };
  if(row.次數 != "－") 技能json.註記 += " 次數：" + row.次數;
  目前選擇技能.push(技能json);
  重新列出選擇的技能();
}

let 目前選擇技能 = [];
function 重新列出選擇的技能() {
  選擇區.innerHTML = "";
  目前選擇技能 = 目前選擇技能.filter(技能json => 技能json.等級);
  new_el_to_el(選擇區, "tbody.欄位名稱", [
    new_el("tr", [
      new_el("td.種別", "種別"),
      new_el("td.名稱", "名稱"),
      new_el("td.等級", "LV"),
      new_el("td.時機", "時機"),
      new_el("td.技能", "技能"),
      new_el("td.難易度", "難易度"),
      new_el("td.對象", "對象"),
      new_el("td.射程", "射程"),
      new_el("td.侵蝕", "侵蝕"),
      new_el("td.限制", "限制"),
      new_el("td.經驗", "經驗"),
    ]),
  ]);
  目前選擇技能.forEach(技能json => 生成一個已選擇的技能el(技能json));
}
function 生成一個已選擇的技能el(技能json) {
  let 資料el = new_el_to_el(選擇區, "tbody.資料", [
    new_el("tr", [
      new_el("td.種別", 技能json.種別),
      new_el("td.名稱", 技能json.名稱),
      new_el("td.等級", [
        new_el("input", {type: "number", value: 技能json.等級}),
      ]),
      new_el("td.時機", 技能json.時機),
      new_el("td.技能", 技能json.技能),
      new_el("td.難易度", 技能json.難易度),
      new_el("td.對象", 技能json.對象),
      new_el("td.射程", 技能json.射程),
      new_el("td.侵蝕", 技能json.侵蝕),
      new_el("td.限制", 技能json.限制),
      new_el("td.經驗修正", [
        new_el("input", {type: "number", value: 技能json.經驗修正}),
      ]),
    ]),
    new_el("tr", [
      new_el("td.內文", {colspan: 11}, [
        new_el("textarea", 技能json.註記),
      ]),
    ]),
  ]);
  find_on(資料el, ".等級 input", "input", ({target}) => {
    target.value = Math.max(Math.floor(+target.value || 0), 0);
    技能json.等級 = target.value;
    if(target.value == 0) 重新列出選擇的技能();
  });
  find_on(資料el, ".經驗修正 input", "input", ({target}) => {
    target.value = Math.round(+target.value || 0);
    技能json.經驗修正 = target.value;
  });
  find_on(資料el, ".內文 textarea", "input", ({target}) => {
    技能json.註記 = target.value.replace(/\r/g, "").replace(/\n/g, " ");
  });
}
let 目前的檔案 = {};
async function 從檔案讀取技能() {
  let res = await 上傳檔案();
  目前的檔案 = res;
  目前角色.value = res.characterName || "";
  let 技能json_arr = 從檔案抓技能json(res);
  目前選擇技能 = 技能json_arr;
  重新列出選擇的技能();
}
function 從技能存到檔案() {
  目前選擇的技能轉到檔案();
  下載檔案(目前角色.value, JSON.stringify(目前的檔案));
}

function 從檔案抓技能json(file_json) {
  let data_arr = [];
  let i = 1;
  while(+file_json[`effect${i}Lv`]) {
    let 技能json = {
      名稱: file_json[`effect${i}Name`] || "",
      等級: +file_json[`effect${i}Lv`] || "",
      時機: file_json[`effect${i}Timing`] || "",
      技能: file_json[`effect${i}Skill`] || "",
      難易度: file_json[`effect${i}Dfclty`] || "",
      對象: file_json[`effect${i}Target`] || "",
      射程: file_json[`effect${i}Range`] || "",
      侵蝕: file_json[`effect${i}Encroach`] || "",
      限制: file_json[`effect${i}Restrict`] || "",
      種別: file_json[`effect${i}Type`] || "",
      經驗修正: file_json[`effect${i}Exp`] || "",
      註記: file_json[`effect${i}Note`] || "",
    };
    data_arr.push(技能json);
    i++;
  }
  return data_arr;
}
function 清除檔案中的技能() {
  let i = 1;
  while(+目前的檔案[`effect${i}Lv`]) {
    delete 目前的檔案[`effect${i}Name`];
    delete 目前的檔案[`effect${i}Lv`];
    delete 目前的檔案[`effect${i}Timing`];
    delete 目前的檔案[`effect${i}Skill`];
    delete 目前的檔案[`effect${i}Dfclty`];
    delete 目前的檔案[`effect${i}Target`];
    delete 目前的檔案[`effect${i}Range`];
    delete 目前的檔案[`effect${i}Encroach`];
    delete 目前的檔案[`effect${i}Restrict`];
    delete 目前的檔案[`effect${i}Type`];
    delete 目前的檔案[`effect${i}Exp`];
    delete 目前的檔案[`effect${i}Note`];
    i++;
  }
}
function 目前選擇的技能轉到檔案() {
  清除檔案中的技能();
  目前選擇技能.forEach((技能json, index) => {
    let i = index + 1;
    目前的檔案[`effect${i}Name`] = 技能json.名稱;
    目前的檔案[`effect${i}Lv`] = 技能json.等級;
    目前的檔案[`effect${i}Timing`] = 技能json.時機;
    目前的檔案[`effect${i}Skill`] = 技能json.技能;
    目前的檔案[`effect${i}Dfclty`] = 技能json.難易度;
    目前的檔案[`effect${i}Target`] = 技能json.對象;
    目前的檔案[`effect${i}Range`] = 技能json.射程;
    目前的檔案[`effect${i}Encroach`] = 技能json.侵蝕;
    目前的檔案[`effect${i}Restrict`] = 技能json.限制;
    目前的檔案[`effect${i}Type`] = 技能json.種別;
    目前的檔案[`effect${i}Exp`] = 技能json.經驗修正;
    目前的檔案[`effect${i}Note`] = 技能json.註記;
  });
}

function 下載檔案(file_name, string) {
  let blob = new Blob([string], {type:'text/json;charset=utf-8'});
  let download = new_el('a', {download: (file_name || '未命名') + '.json'});
  download.href = URL.createObjectURL(blob);
  download.click();
}
function 上傳檔案() {
  if (typeof FileReader != 'function') {
    alert('瀏覽器不支援讀取檔案功能，請換瀏覽器');
    return;
  }
  return new Promise((resolve, reject) => {
    let upload = new_el('input', {type: 'file'});
    upload.addEventListener('change', () => {
      let file = upload.files[0];
      if(!(/\.json$/.test(file.name))) {
        alert('檔案類型錯誤');
        return;
      }
      let reader = new FileReader();
      reader.addEventListener('load', () => {
        try {
          let file_data = JSON.parse(reader.result);
          resolve(file_data);
        }
        catch(err) {
          alert('檔案格式錯誤');
          reject(err);
        }
      });
      reader.readAsText(file, 'utf-8');
    });
    upload.click();
  });
}

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
  new_el_to_el(列表區, "div.欄位名稱", [
    new_el("div.名稱", "名稱"),
    new_el("div.最大等級", "MaxLv"),
    new_el("div.資訊列", "資訊列"),
  ]);
  Object.entries(res.data).forEach(([sheet_name, rows]) => {
    rows.forEach(row => show_row(sheet_name, row));
  });
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
    new_el("div.名稱", [
      new_el("span.中文", show_data.中文),
      new_el("span.日文", show_data.日文),
    ]),
    new_el("div.最大等級", show_data.最大等級),
    new_el("div.資訊列", [
      new_el("span.症候群", [
        new_el("span.主類別", show_data.主類別),
        new_el("span.副類別", show_data.副類別),
      ]),
      ...show_data.資訊列.map(str => new_el("span", str)),
    ]),
    new_el("div.效果", [
      new_el("div.效果內文", show_data.效果),
      new_el("div.參照", show_data.參照),
    ]),
  ]);

  /* 複製資料 */
  find(row_el, ".症候群").addEventListener("click", () => copy_text(copy_text_cnt));

  /* 點擊加到已選 */
  find_on(row_el, ".最大等級", "click", () => 加到已選技能(row, show_data, el_data));

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
  show_data.參照 = `參照：${row.參照.split("\n").join("、")}`;

  /* 複製用 */
  let copy_類別 = show_data.主類別;
  if(show_data.副類別) copy_類別 += `(${show_data.副類別})`;
  let copy_text_cnt = [
    `${copy_類別} 《${show_data.中文}》MaxLv:${show_data.最大等級}`,
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
