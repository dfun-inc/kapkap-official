export function formatTimeMS(_dur:string|number) {
  const dur = Number(_dur);
  const min = Math.floor(dur / 60);
  const sec = Math.floor(dur % 60);

  return '' + (min < 10 ? ('0' + min) : min) + ' : ' + (sec < 10 ? ('0' + sec) : sec);
}