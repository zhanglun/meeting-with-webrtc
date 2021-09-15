export function reportError(errMessage) {
  log_error(`Error ${errMessage.name}: ${errMessage.message}`);
}

export function log_error(text) {
  var time = new Date();

  console.error("[" + time.toLocaleTimeString() + "] " + text);
}

export function log(text) {
  var time = new Date();

  console.log("[" + time.toLocaleTimeString() + "] " + text);
}

export function createRoomHash() {
  if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }

  return location.hash.substring(1);
}

export function randomName() {
  const list = [
    "问忆安",
    "闵真茹",
    "战梦菡",
    "卓梦桃",
    "丘雅香",
    "拱秋芳",
    "俟春",
    "梅鹏海",
    "百哲",
    "亓胤运",
    "凌梦凡",
    "邝箫笛",
    "六凌青",
    "舒含之",
    "么小枫",
    "费白秋",
    "仰高达",
    "栾弘深",
    "校天蓉",
    "板初阳",
    "法嘉佑",
    "戚幼旋",
    "乐彦",
    "漆菱华",
    "回虹彩",
    "卷寄蕾",
    "繁念云",
    "乌雅珹",
    "羊舌幻丝",
    "屈骊萍",
    "机流婉",
    "银秋灵",
    "帖锐志",
    "丰甜恬",
    "占博裕",
    "钊元容",
    "葛杉月",
    "慎咏德",
    "封禹",
    "进丹红",
    "闪巧凡"
  ]
  return list[Math.ceil(Math.random() * 20 + 1)] + "(" + new Date().getTime() + ")";
}