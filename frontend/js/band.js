// ============ 小程序：15块钱组建你的少女乐队 ============
// 模型调用走后端 /api/mini/band/analyze（SSE 流式），与聊天共用 .env 的 LLM 配置；
// 失败时自动回退 mbti_analysis.js 的规则版分析。

const bandCharacters = [
  {
    price: 5,
    list: [
      { name: "秋山澪", role: "贝斯手/作词/主唱", mbti: "ISTJ", desc: "放学后茶会乐队贝斯手。是一个左撇子，丹凤眼，有着到腰长度的黑发。是轻音部中唯一有后援会的部员。贝斯技术扎实，容易害羞但舞台表现力强。" },
      { name: "要乐奈", role: "主音吉他", mbti: "INTP", desc: "MyGO!!!!!乐队吉他手。喜欢的食物是抹茶和荞麦面。有着高超的吉他技术，仅一眼就能记住乐谱并演奏，是个即兴大师。" },
      { name: "河原木桃香", role: "吉他手/作曲/作词", mbti: "ESTP", desc: "无刺有刺乐队主音吉他手。20岁的街头音乐艺人，演奏经验丰富，编曲老手。开朗又很会照顾人，是值得依靠的前辈。" },
      { name: "丰川祥子", role: "键盘手/作曲", mbti: "ENTJ", desc: "Ave Mujica乐队键盘手。丰川集团的千金。曾经的她个性温柔、天真烂漫，拥有天才的作曲能力，是才华横溢的少女。" },
      { name: "花园多惠", role: "主音吉他", mbti: "INFP", desc: "Poppin'Party乐队主音吉他手。小学就开始练习吉他的强大实力派。非常喜欢音乐，升入高中后就一直在Live House打工。" },
      { name: "凑友希那", role: "主唱/作词/作曲", mbti: "INTJ", desc: "Roselia乐队的主唱兼领队，同时也是乐队的作词作曲人。内心坚定，绝不怀疑自己相信的事情，纯真的性格，偶尔也会对相信的事情过于盲目而忽视身边的事情。在众人面前不怎么露出笑容，因此给人脾气不好的印象。" },
      { name: "美竹兰", role: "吉他手/主唱", mbti: "ISFP", desc: "Afterglow乐队的主唱兼吉他手，就读于羽丘女子学园。拥有百年历史的花道家族中的独生女，起初却在父亲的反对下组乐团。" },
      { name: "丸山彩", role: "主唱", mbti: "ESFJ", desc: "Pastel*Palettes乐队的主唱，就读于四叶女子大学文学部。喜欢浏览交友网站和研究自拍。喜欢吃蛋包饭和汉堡肉之类的西餐，讨厌吃章鱼。" },
      { name: "弦卷心", role: "主唱", mbti: "ESFP", desc: "Hello, Happy World!乐队的主唱，就读于花咲川女子学园。相当富裕的家庭的独生女，只要萌生了“想要做”的念头无论如何都会去实现。好奇心旺盛，眼神中总是充满着好奇心的光芒。最喜欢看到人们的笑容。" },
      { name: "二叶筑紫", role: "鼓手", mbti: "ENFJ", desc: "Morfonica乐队的鼓手，就读于月之森女子学园。一直都很认真，但有时也会因为脑子一热干些蠢事。以成为坚定可靠的人为目标持续奋斗。" },
      { name: "珠手知由", role: "DJ/作词/作曲", mbti: "ENTJ", desc: "RAISE A SUILEN乐队的DJ，就读于塞洛西亚女子学校。国际学校12年级(即高中三年级)的海归子女，由于成绩优秀而跳级。能够兼任作词作曲的有才华的音乐制作人。梦想是用自己最强的音乐改变世界。尽管充满自信并且高度专业，但也有幼稚的一面。" },
      { name: "后藤一里", role: "主音吉他/作词", mbti: "INFP", desc: "结束乐队主音吉他手。吉他技术高超，是网络上人气不菲的视频主“吉他英雄”，但在现实中却有着严重的社交恐惧症。" }
    ]
  },
  {
    price: 4,
    list: [
      { name: "平泽唯", role: "主音吉他/主唱", mbti: "ENFP", desc: "放学后茶会乐队主音吉他手。天然呆指数爆灯，在学会弹吉他后被发现有“绝对音感”的特殊能力，被称为最强单核处理器。" },
      { name: "高松灯", role: "主唱/作词", mbti: "INFP", desc: "MyGO!!!!!乐队主唱。性格略悲观的女孩。感情细腻，有着自己独特的内心世界。容易感到寂寞，常会称自己“感受着孤独”。对人际关系极为敏感，时刻担心着自己的言行是否会产生不良影响。" },
      { name: "井芹仁菜", role: "节奏吉他/主唱", mbti: "ISFP", desc: "无刺有刺乐队主唱兼节奏吉他。喜欢的食物是浸物、牛奶咖啡和酸奶，坚韧执着，歌词创作强。" },
      { name: "三角初华", role: "吉他手/主唱/作词", mbti: "INFJ", desc: "Ave Mujica主唱。真名三角初音，系丰川祥子的小姨。因其酷炫的外观而受欢迎，喜欢观星。" },
      { name: "户山香澄", role: "节奏吉他/主唱", mbti: "ENFP", desc: "Poppin'Party乐队的主唱兼吉他手。喜欢冒险和唱卡拉OK。被粉丝们尊称为邦高祖。" },
      { name: "白金燐子", role: "键盘手", mbti: "ISFJ", desc: "Roselia乐队的键盘手。喜欢玩网络游戏和填字游戏，喜欢喝热牛奶，讨厌芹菜。就读于四叶女子大学艺术学部。" },
      { name: "青叶摩卡", role: "吉他手", mbti: "INTP", desc: "Afterglow乐队的主吉他手，就读于羽丘女子学园。对于没兴趣的东西完全不在乎，而为了喜欢的人（兰）就能拼尽全力的类型。喜欢对于一件事坚持到底，乐器便是其中之一。" },
      { name: "冰川日菜", role: "吉他手", mbti: "ESTP", desc: "Pastel*Palettes乐队的吉他手，就读于庆鹏女子大学人类科学部。喜欢制作香薰精油。喜欢各种垃圾食物，口香糖和糖果和姐姐一样，讨厌清淡的食物和胡萝卜（仅童年期）。在隔壁Roselia有个双胞胎姐姐冰川纱夜，同为吉他手。" },
      { name: "濑田薰", role: "吉他手", mbti: "ENFJ", desc: "Hello, Happy World!乐队的吉他手，就读于四叶女子大学。高中时是演剧部的成员，粉丝众多，在学校里十分有名，因此在校内总是被粉丝包围。升上大学后依然虏获了众多女生的芳心。" },
      { name: "八潮瑠唯", role: "小提琴手", mbti: "ESTJ", desc: "Morfonica乐队的小提琴手，就读于月之森女子学园。立于年级成绩顶尖的才女。从初中开始就是学生会的成员，多才多艺。升上高二后担任学生会长。性格冷淡，一本正经，心直口快，总是站在理性的角度考虑事情而无视了感性。" },
      { name: "和奏瑞依", role: "主唱/贝斯手", mbti: "INFJ", desc: "RAISE A SUILEN乐队的贝斯手，就读于都立艺术学院高中。不管什么歌都能唱的专业歌姬。言行成熟，会与人保持距离感。" },
      { name: "山田凉", role: "贝斯手/作曲", mbti: "INTP", desc: "结束乐队贝斯手。贝斯技术高超，内心意外的纤细。爱好很远离世俗，是喜欢被别人叫做怪人的怪人。" }
    ]
  },
  {
    price: 3,
    list: [
      { name: "琴吹紬", role: "键盘手/作曲", mbti: "INFP", desc: "放学后茶会乐队键盘手。富家千金，怪力大小姐，音乐素养高，轻音部茶点的提供者。" },
      { name: "椎名立希", role: "鼓手/作曲", mbti: "ISTJ", desc: "MyGO!!!!!乐队鼓手。个性认真，不苟言笑，言辞犀利，态度上无论是待人还是待己都非常严格，只有在高松灯面前态度会有所软化。" },
      { name: "海老冢智", role: "键盘手", mbti: "INTJ", desc: "无刺有刺乐队键盘手。原本是在家乡相当有名的有钱人家大小姐，现在则是与其他人分租公寓。像是刺猬一样非常有警戒心，难以敞开心房。" },
      { name: "八幡海铃", role: "贝斯手", mbti: "ISTP", desc: "Ave Mujica乐队贝斯手。贝斯技巧达到了职业水准，同时担任30个乐团的支援乐手。" },
      { name: "山吹沙绫", role: "鼓手", mbti: "ESFJ", desc: "Poppin'Party乐队的鼓手。兴趣是卡拉OK、观看棒球赛、收集发饰。" },
      { name: "冰川纱夜", role: "主音吉他", mbti: "ISTJ", desc: "Roselia乐队的吉他手。生活态度认真，做一件事的时候一定要做得最好，而为了达到这个目标会不断磨练。与友希那同为乐队的强硬派。" },
      { name: "上原绯玛丽", role: "贝斯手", mbti: "ESFJ", desc: "Afterglow乐队的贝斯手，就读于羽丘女子学园。性格开朗和善的开心果，经常因为不会察言观色而导致最后白忙一场。" },
      { name: "白鹭千圣", role: "贝斯手", mbti: "ISTJ", desc: "Pastel*Palettes乐队的贝斯手，就读于四叶女子大学文学部。喜欢在咖啡厅喝茶和逛街。喜欢吃味道清淡的东西、巴西莓碗，饮料是红茶，讨厌纳豆，也讨厌吃辣的东西。" },
      { name: "北泽育美", role: "贝斯手", mbti: "ESFP", desc: "Hello, Happy World!乐队的贝斯手，就读于花咲川女子学园。总是十分开朗活泼，感性而又纯粹的孩子。运动神经非常好，是当地的垒球队的王牌选手及队长，被队员称作Captain。" },
      { name: "广町七深", role: "贝斯手", mbti: "INFJ", desc: "Morfonica乐队的贝斯手，就读于月之森女子学园。向往着普通但有些特别与众不同的女孩子。总是在意自己与他人会不会产生分歧，而会为了融入周围环境而隐藏包括才能在内的真实的自己。" },
      { name: "佐藤益木", role: "鼓手", mbti: "ESTP", desc: "RAISE A SUILEN乐队的鼓手，就读于白雪学园。Live House “Galaxy” 老板的女儿，出于对鼓手父亲的憧憬而开始了活动。" },
      { name: "伊地知虹夏", role: "鼓手", mbti: "ENFJ", desc: "结束乐队鼓手。元气温柔的气氛调节者，善解人意，能够细心的观察每个成员并给予关照。" }
    ]
  },
  {
    price: 2,
    list: [
      { name: "中野梓", role: "节奏吉他", mbti: "ISTJ", desc: "放学后茶会乐队节奏吉他手。小学四年级开始练吉他，对吉他十分精通。很适合戴猫耳。虽然肤质很好但特别容易晒黑。" },
      { name: "长崎爽世", role: "贝斯手", mbti: "ISFJ", desc: "MyGO!!!!!乐队贝斯手。如同具有安稳气氛的大姐姐一般的存在，经常被周围的人所依赖，温柔可靠，有作曲经验。" },
      { name: "RUPA", role: "贝斯手", mbti: "INFJ", desc: "无刺有刺乐队贝斯手。非常有艺术才华，也很聪明，是所谓的天才，因稳重的说话方式和谦虚的态度而受到众人尊敬。" },
      { name: "祐天寺若麦", role: "鼓手", mbti: "ESTP", desc: "Ave Mujica乐队鼓手。目前就读于艺术学院高中，主修演技。作为双利手，打鼓的手法十分华丽。" },
      { name: "市谷有咲", role: "键盘手", mbti: "INTP", desc: "Poppin'Party乐队的键盘手。就读花咲川女子学园。以盆景和上网为兴趣的室内派。" },
      { name: "今井莉莎", role: "贝斯手", mbti: "ENFJ", desc: "Roselia乐队的贝斯手。喜欢编织和看恋爱故事，爱吃筑前煮和醋拌凉菜，讨厌绿色奶昔，怕鬼。个性开朗、会照顾人而且重视情感。" },
      { name: "宇田川巴", role: "鼓手", mbti: "ESTP", desc: "Afterglow乐队的鼓手，就读于羽丘女子学园。性格豪爽干脆，不会轻易批评或怨恨他人。Afterglow里最可靠的一位。商店街有祭典活动时，会去打和太鼓。" },
      { name: "大和麻弥", role: "鼓手", mbti: "ISTP", desc: "Pastel Palettes乐队的鼓手，就读于庆鹏女子大学社会学部。宣称“被器材包围的时候最幸福”的如假包换的器材宅，聊起器材的话题便会滔滔不绝。" },
      { name: "松原花音", role: "鼓手", mbti: "ISFJ", desc: "Hello, Happy World!乐队的鼓手，就读于庆鹏女子大学文学部。因为内向的关系整天提心吊胆，稍微有点笨拙。对于被拜托了的事不擅长拒绝，很容易被卷进麻烦里。喜欢甜点和可爱的东西，是个有点保守消极的女孩。" },
      { name: "桐谷透子", role: "吉他手", mbti: "ESFP", desc: "Morfonica乐队的吉他手，就读于月之森女子学园。无论是在学校还是在社交网络上都是备受追捧的万人迷。虽然性格开朗直爽，但老是因为随心所欲的做事方法让周围的人备受折磨。" },
      { name: "鳰原令王那", role: "键盘手", mbti: "ESFJ", desc: "RAISE A SUILEN乐队的键盘手，就读于加茂川中央中学校。发挥自己学习过电子琴的经验，改变爱好成为了键盘手。特别在意“可爱”，对“可爱”有强烈的执着。一直都有着待人明朗的性格。喜欢的乐队是Pastel Palettes。" },
      { name: "喜多郁代", role: "节奏吉他/主唱", mbti: "ESFJ", desc: "结束乐队节奏吉他手。个性开朗活泼，精力旺盛，善良细心，是一个有很多朋友和社交活动的现充，喜欢在社交平台上发照片或者直播分享自己的生活。" }
    ]
  },
  {
    price: 1,
    list: [
      { name: "田井中律", role: "鼓手", mbti: "ESTP", desc: "放学后茶会乐队鼓手。有男孩子气息的元气娘，性格粗枝大叶。擅长针线活和料理。" },
      { name: "千早爱音", role: "节奏吉他", mbti: "ESFP", desc: "MyGO!!!!!乐队节奏吉他手。虽然有点爱慕虚荣和想出风头，但个性积极善良，关心他人，心思细腻，会为了朋友挺身而出。" },
      { name: "安和昴", role: "鼓手", mbti: "ENTP", desc: "无刺有刺乐队鼓手。就读艺能学校的女孩子。相当有前途，会出演广告。" },
      { name: "若叶睦", role: "节奏吉他", mbti: "INTP", desc: "Ave Mujica乐队节奏吉他手。缺乏情感表达，平时也是沉默不语的孩子。内向但有音乐天赋。" },
      { name: "牛込里美", role: "贝斯手", mbti: "ISFJ", desc: "Poppin'Party乐队的贝斯手。喜欢的食物是巧克力螺、肉、鲜奶油。" },
      { name: "宇田川亚子", role: "鼓手", mbti: "ENFP", desc: "Roselia乐队的爵士鼓手。喜欢研究自己认为的很帅气的事。喜欢洋芋片和雷根糖，讨厌海参和青椒，从初中到高中皆就读于羽丘女子学园。" },
      { name: "羽泽鸫", role: "键盘手", mbti: "ISFJ", desc: "Afterglow乐队的键盘手，就读于羽丘女子学园。Afterglow中最平凡的女孩子，但是正因为普通的关系，是一个努力家，无论多小的事都不会放弃。" },
      { name: "若宫伊芙", role: "键盘手", mbti: "ENFJ", desc: "Pastel*Palettes乐队的键盘手，就读花咲川女子学园。虽然是高中生，但因为身材苗条而样子出众所以被聘请做模特。喜欢看日本时代剧，因此对“武士道”文化抱有强烈的憧憬，经常把“武士道”挂在嘴边。" },
      { name: "奥泽美咲", role: "DJ", mbti: "ISTJ", desc: "Hello, Happy World!乐队的DJ，就读花咲川女子学园。以“普普通通就是最好”为座右铭，稍微有点冷淡的女孩子。对任何事都只做到适当的程度。打工的时候穿着商店街吉祥物「米歇尔」的熊布偶装，也是因此被心发现，连带中之人拉进了乐队里。" },
      { name: "仓田真白", role: "主唱/作词", mbti: "INFP", desc: "Morfonica乐队的主唱，就读于月之森女子学园。文静又稳重的女孩。虽然读进了憧憬的贵族学校——月之森女子学院，但发现周围的学生个个才华横溢而备受打击。一直过着消沉的生活，直到遇上乐队的那天……" },
      { name: "朝日六花", role: "吉他手", mbti: "INFP", desc: "RAISE A SUILEN乐队的吉他手，就读于羽丘女子学园。虽然是饱尝艰辛的幸运E，但总是什么事都全力以赴。在商店街一角的Live House打工时，强烈地期望着自己也能组乐队。Poppin'Party的铁粉。" }
    ]
  }
];

let bandSelected = {};
let bandInited = false;

function bandLoadImage(imgEl, name) {
  const img = new Image();
  img.src = `/assets/band/image/${encodeURIComponent(name)}.jpg`;

  img.onload = () => {
    imgEl.src = img.src;
  };

  img.onerror = () => {
    imgEl.style.background = "#eee";
  };
}

function updateBandTotal() {
  const total = Object.values(bandSelected).reduce((s, c) => s + c.price, 0);
  const el = $("#band-total");

  if (el) {
    el.textContent = total;
  }
}

function checkCoreRoles() {
  const roles = Object.values(bandSelected).map((d) => d.role);
  const missing = [];

  if (!roles.some((r) => r.includes("吉他"))) missing.push("吉他手");
  if (!roles.some((r) => r.includes("贝斯"))) missing.push("贝斯手");
  if (!roles.some((r) => r.includes("鼓"))) missing.push("鼓手");

  return missing.length ? missing : null;
}

function renderBandCharacters() {
  const area = $("#band-selection-area");

  if (!area) return;

  area.innerHTML = "";

  bandCharacters.forEach((tier) => {
    const tierDiv = document.createElement("div");
    tierDiv.className = "price-tier";

    const label = document.createElement("div");
    label.className = "price-label";
    label.textContent = `${tier.price}¥`;

    const grid = document.createElement("div");
    grid.className = "character-grid";

    tier.list.forEach((char) => {
      const item = document.createElement("div");
      item.className = "character-item";
      item.dataset.name = char.name;
      item.dataset.price = tier.price;
      item.dataset.mbti = char.mbti;
      item.dataset.desc = char.desc;

      const img = document.createElement("img");
      img.alt = char.name;
      bandLoadImage(img, char.name);

      const nameSpan = document.createElement("span");
      nameSpan.className = "character-name";
      nameSpan.textContent = char.name;

      const roleSpan = document.createElement("span");
      roleSpan.className = "character-role";
      roleSpan.textContent = char.role;

      item.appendChild(img);
      item.appendChild(nameSpan);
      item.appendChild(roleSpan);

      item.addEventListener("click", () => toggleBandSelect(item));

      grid.appendChild(item);
    });

    tierDiv.appendChild(label);
    tierDiv.appendChild(grid);
    area.appendChild(tierDiv);
  });
}

function toggleBandSelect(item) {
  const name = item.dataset.name;

  if (bandSelected[name]) {
    delete bandSelected[name];
    item.classList.remove("selected");
  } else {
    if (Object.keys(bandSelected).length >= 5) {
      alert("⚠️ 最多只能选择5人！");
      return;
    }

    bandSelected[name] = {
      price: parseInt(item.dataset.price),
      mbti: item.dataset.mbti,
      desc: item.dataset.desc,
      role: item.querySelector(".character-role").textContent,
    };

    item.classList.add("selected");
  }

  updateBandTotal();
}

function clearBand() {
  bandSelected = {};

  document.querySelectorAll(".character-item").forEach((i) => {
    i.classList.remove("selected");
  });

  updateBandTotal();

  const resultEl = $("#band-result");

  if (resultEl) {
    resultEl.style.display = "none";
  }
}

function saveBandAnalysis(members, content, isFallback) {
  let plain = content;

  if (isFallback) {
    const temp = document.createElement("div");
    temp.innerHTML = content;
    plain = temp.textContent || temp.innerText;
  }

  const filename = members.map((m) => m.name.trim()).join("_") + ".txt";

  const text = `【你的少女乐队阵容】\n${members
    .map((m) => `${m.name}（${m.role}｜${m.mbti}｜${m.price}元）\n${m.desc}`)
    .join("\n\n")}\n\n【乐队深度分析${isFallback ? "（本地规则版）" : ""}】\n${plain}`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

async function buildBand() {
  const total = Object.values(bandSelected).reduce((s, c) => s + c.price, 0);
  const count = Object.keys(bandSelected).length;

  if (total > 15) {
    return alert(`⚠️ 预算超支！当前花费 ${total} 元`);
  }

  if (count < 2 || count > 5) {
    return alert("⚠️ 乐队人数需在2至5人之间");
  }

  const missingCore = checkCoreRoles();

  if (missingCore && !confirm(`ℹ️ 提示：以下核心职位未覆盖：${missingCore.join(", ")}\n\n您可以继续组建...`)) {
    return;
  }

  let html = "<h2>✨ 你的少女乐队阵容</h2>";

  const members = [];

  for (const [name, data] of Object.entries(bandSelected)) {
    members.push({
      name,
      mbti: data.mbti,
      role: data.role,
      price: data.price,
      desc: data.desc,
    });

    html += `
      <div class="member-info">
        <strong>${name}</strong>（${data.role}｜${data.mbti}｜${data.price}元）<br>
        <em>${data.desc}</em>
      </div>
    `;
  }

  html += `
    <div class="band-photos">
      ${members
        .map((m) => `<img src="/assets/band/image/${encodeURIComponent(m.name)}.jpg" alt="${m.name}">`)
        .join("")}
    </div>
  `;

  html += `
    <div class="band-photos band-stitch" id="band-photos-stitch">
      ${members
        .map((m) => `<img src="/assets/band/picture/${encodeURIComponent(m.name)}.jpg" alt="${m.name}">`)
        .join("")}
    </div>
  `;

  html += `
    <div class="analysis-progress">
      <div>⏳ 正在生成深度分析...</div>
      <div>⏱️ 已用时间: <span id="band-elapsed">0</span> 秒</div>
      <div id="band-streaming" class="stream-box"></div>
    </div>
  `;

  const resultEl = $("#band-result");

  if (!resultEl) return;

  resultEl.innerHTML = html;
  resultEl.style.display = "block";

  const startTime = Date.now();

  const timer = setInterval(() => {
    const el = $("#band-elapsed");

    if (el) {
      el.textContent = Math.floor((Date.now() - startTime) / 1000);
    }
  }, 1000);

  let rafId = null;

  const finish = (content, isFallback) => {
    clearInterval(timer);

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    setTimeout(() => {
      stitchBandPhotos(members, "band-photos-stitch", {
        height: 480,
        format: "png",
        quality: 0.98,
        enableDownload: true,
      });
    }, 150);

    const progressEl = resultEl.querySelector(".analysis-progress");

    if (!progressEl) return;

    const analysisDiv = document.createElement("div");
    analysisDiv.className = "mbti-analysis";

    analysisDiv.innerHTML = isFallback
      ? `<div class="fallback-note"><strong>⚠️ 本地规则分析（模型未连接）</strong><br>以下分析基于 MBTI 性格规则库生成</div>${content}`
      : `<strong>乐队深度分析：</strong><br>${esc(content)}`;

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "💾 保存分析结果";

    saveBtn.addEventListener("click", () => saveBandAnalysis(members, content, isFallback));

    progressEl.replaceWith(analysisDiv, saveBtn);
  };

  try {
    const response = await fetch("/api/mini/band/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ members }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let finalContent = "";
    let streamError = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.substring(6).trim();

        if (!jsonStr || jsonStr === "[DONE]") continue;

        let obj;

        try {
          obj = JSON.parse(jsonStr);
        } catch (e) {
          continue;
        }

        if (obj.error) {
          streamError = obj.error;
        } else if (obj.content) {
          finalContent += obj.content;

          if (!rafId) {
            rafId = requestAnimationFrame(() => {
              const box = $("#band-streaming");

              if (box) {
                box.textContent = finalContent;
                box.scrollTop = box.scrollHeight;
              }

              rafId = null;
            });
          }
        }
      }
    }

    if (streamError) {
      throw new Error(streamError);
    }

    if (!finalContent) {
      throw new Error("模型返回空内容");
    }

    finish(finalContent, false);
  } catch (e) {
    console.error("AI 分析失败，回退规则版:", e);
    finish(generateMBTIAnalysis(members), true);
  }
}

function stitchBandPhotos(members, containerId, options = {}) {
  const {
    height = 360,
    format = "jpeg",
    quality = 0.95,
    enableDownload = true,
  } = options;

  const container = document.getElementById(containerId);

  if (!container) return;

  const images = container.querySelectorAll("img");

  const loadPromises = Array.from(images).map(
    (img) =>
      new Promise((resolve) => {
        if (img.complete && img.naturalWidth !== 0) {
          resolve(img);
        } else {
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        }
      })
  );

  Promise.all(loadPromises).then((loaded) => {
    const valid = loaded.filter(Boolean);

    if (valid.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetHeight = height * dpr;

    let totalWidth = 0;

    const dimensions = valid.map((img) => {
      const ratio = img.naturalWidth / img.naturalHeight;
      const w = Math.round(height * ratio * dpr);

      totalWidth += w;

      return {
        img,
        width: w,
        height: targetHeight,
      };
    });

    const canvas = document.createElement("canvas");
    canvas.width = totalWidth;
    canvas.height = targetHeight;
    canvas.style.width = `${totalWidth / dpr}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let offsetX = 0;

    dimensions.forEach(({ img, width, height: h }) => {
      ctx.drawImage(img, offsetX, 0, width, h);
      offsetX += width;
    });

    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mimeType, format === "png" ? undefined : quality);

    const stitched = document.createElement("img");
    stitched.src = dataUrl;
    stitched.alt = "乐队合照（高清合成）";
    stitched.style.cssText = "display:block; max-width:100%; height:auto; border-radius:0;";

    container.innerHTML = "";
    container.appendChild(stitched);

    if (enableDownload && members && members.length > 0) {
      const downloadBtn = document.createElement("button");
      downloadBtn.className = "save-btn";
      downloadBtn.textContent = "📥 下载高清合照";

      downloadBtn.addEventListener("click", () => {
        const filename = members.map((m) => m.name.trim()).join("_") + `_band.${format}`;

        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      container.parentNode.insertBefore(downloadBtn, container.nextSibling);
    }
  });
}

function initBandMini() {
  if (bandInited) return;

  bandInited = true;

  renderBandCharacters();

  const buildBtn = $("#band-build-btn");
  const clearBtn = $("#band-clear-btn");

  if (buildBtn) {
    buildBtn.addEventListener("click", buildBand);
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearBand);
  }
}