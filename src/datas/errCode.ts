import { useAppContext } from "@/context/AppContext";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify"

export const errCode:any = {
  "1002": "errCode.sessionExpired"
}

export const useErrCode = () => {
  const t = useTranslations();
  const { triggerSetLogout } = useAppContext();

  const errCodeHandler = (code:any, msg:string = '') => {
    if(errCode.hasOwnProperty(code)) {
      toast.error(t(errCode[code]))
    }
    else {
      toast.error(t('common.error') + ': ' + code + (msg ? ' - ' + msg : ''));

      if(code == "10002" || code == "20007") {
        triggerSetLogout(true);
      }
    }
  }

  return {errCodeHandler}
}