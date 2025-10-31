export function formatTimeMS(_dur:string|number) {
  const dur = Number(_dur);
  const min = Math.floor(dur / 60);
  const sec = Math.floor(dur % 60);

  return '' + (min < 10 ? ('0' + min) : min) + ' : ' + (sec < 10 ? ('0' + sec) : sec);
}

export function formatDatetime(datetime: string) {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
}

export function formatDate(date: string) {
  const datetime = new Date(date);
  const year = datetime.getFullYear();
  const month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  const day = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();

  return `${year}.${month}.${day}`;
}
