export function getUrlParamsByName(name:string){
  let urlStr = window.location.href.split('?')[1];
  let obj:any = {};
  if(urlStr) {
    let paramsArr = urlStr.split('&')
    for(let i = 0,len = paramsArr.length;i < len;i++){
        let arr = paramsArr[i].split('=')
        obj[arr[0]] = arr[1];
    }
    if(obj[name] != undefined) {
      return obj[name];
    }
  }
  return '';
}