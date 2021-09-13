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