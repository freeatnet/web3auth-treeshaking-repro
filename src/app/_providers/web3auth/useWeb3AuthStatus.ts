import { ADAPTER_EVENTS } from "@web3auth/base";
import { useSyncExternalStore } from "react";

import { web3auth } from "./instance";

const subscribeWeb3AuthEvents = (callback: () => void) => {
  web3auth.on(ADAPTER_EVENTS.READY, callback);
  web3auth.on(ADAPTER_EVENTS.CONNECTED, callback);
  web3auth.on(ADAPTER_EVENTS.CONNECTING, callback);
  web3auth.on(ADAPTER_EVENTS.DISCONNECTED, callback);
  web3auth.on(ADAPTER_EVENTS.ERRORED, callback);

  return () => {
    web3auth.off(ADAPTER_EVENTS.READY, callback);
    web3auth.off(ADAPTER_EVENTS.CONNECTED, callback);
    web3auth.off(ADAPTER_EVENTS.CONNECTING, callback);
    web3auth.off(ADAPTER_EVENTS.DISCONNECTED, callback);
    web3auth.off(ADAPTER_EVENTS.ERRORED, callback);
  };
};

function getWeb3AuthSnapshot() {
  return web3auth.status;
}

export function useWeb3AuthStatus() {
  return useSyncExternalStore(
    subscribeWeb3AuthEvents,
    getWeb3AuthSnapshot,
    () => null
  );
}
