import React, { createContext, useReducer } from 'react';

type GloablIntf = {
  connectModalTrigger: Number,
  disconnectTrigger: Number,
  loginedAddress: String,
  userInfo: any,
}

type Action =
| { type: 'updateLoginedAddress', payload: String }
| { type: 'triggerConnectModal' }
| { type: 'triggerDisconnect' }
| { type: 'updateUserInfo', payload: any }
| { type: 'triggerConnectModalReset' }
| { type: 'triggerDisconnectReset' }

export const initState: GloablIntf = {
  connectModalTrigger: 0,
  disconnectTrigger: 0,
  loginedAddress: '',
  userInfo: null,
}

export const GlobalContext = createContext({} as {globalState : GloablIntf, globalDispatcher: React.Dispatch<Action>});

export const GlobalReducer = (state:GloablIntf, action:any) => {
  const _state = { ...state };

  switch(action.type) {
    case 'updateLoginedAddress':
      _state.loginedAddress = action.payload;
      break;
    case 'triggerConnectModal':
      _state.connectModalTrigger = new Date().getTime();
      break;
    case 'triggerDisconnect':
      _state.disconnectTrigger = new Date().getTime();
      break;
    case 'updateUserInfo':
      _state.userInfo = action.payload;
      break;
    case 'triggerConnectModalReset':
      _state.connectModalTrigger = 0;
      break;
    case 'triggerDisconnectReset':
      _state.disconnectTrigger = 0;
      break;
    
    default: 
      return _state;
  }
  return _state;
}

export const GlobalProvider = (props:any) => {
  const [globalState, globalDispatcher] = useReducer(GlobalReducer, initState);

  return (
    <GlobalContext.Provider value={{ globalState, globalDispatcher }}>
      {props.children}
    </GlobalContext.Provider>
  )
}