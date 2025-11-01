import { useTranslations } from "next-intl";
import { toast } from "react-toastify"
import { useDisconnect } from "wagmi";

export const errCode:any = {
  "1002": "errCode.sessionExpired"
}

export const useErrCode = () => {
  const t = useTranslations();
  const { disconnect } = useDisconnect();

  const errCodeHandler = (code:any, msg:string = '') => {
    if(errCode.hasOwnProperty(code)) {
      toast.error(t(errCode[code]))
  
      if(code == "1002") {
        console.log('session expired')
        localStorage.removeItem('gkAuthToken');
        localStorage.removeItem('gkAddress');
        localStorage.removeItem('gkLoginType');
        disconnect();
      }
    }
    else {
      toast.error(t('common.error') + ': ' + code + (msg ? ' - ' + msg : ''));
    }
  }

  return {errCodeHandler}
}