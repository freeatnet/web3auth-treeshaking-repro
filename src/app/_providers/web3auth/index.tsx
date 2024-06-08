"use client";

import {
  ADAPTER_EVENTS,
  WALLET_ADAPTERS,
  type ADAPTER_STATUS_TYPE,
  type IProvider,
} from "@web3auth/base";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import { web3auth } from "./instance";
import { useWeb3AuthStatus } from "./useWeb3AuthStatus";

type Web3AuthContext = {
  web3AuthStatus: ADAPTER_STATUS_TYPE | null;
  provider: IProvider | null;
  loggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const Web3AuthContext = createContext<Web3AuthContext>({
  web3AuthStatus: null,
  loggedIn: false,
  provider: null,
  login: async () =>
    await Promise.reject(new Error("Web3Auth.login not initialized")),
  logout: async () =>
    await Promise.reject(new Error("Web3Auth.logout not initialized")),
});

export default function Web3AuthProvider({ children }: PropsWithChildren) {
  const web3AuthStatus = useWeb3AuthStatus();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  /**
   * Callbacks for handling connection and disconnection of web3auth instance.
   */
  const handleConnected = useCallback(async (_provider: IProvider) => {
    setLoggedIn(true);
  }, []);

  const handleDisconnected = useCallback(() => {
    setLoggedIn(false);
  }, []);

  const login = useCallback(async () => {
    const token = "some-token-requested-from-server";

    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "jwt",
        extraLoginOptions: {
          id_token: token, // the JWT token
          verifierIdField: "sub", // same as your JWT Verifier ID
        },
        redirectUrl: window.location.toString(),
      }
    );
    setProvider(web3authProvider);

    if (web3auth.connected && web3auth.provider) {
      await handleConnected(web3auth.provider);
    }
  }, [handleConnected]);

  const logout = useCallback(async () => {
    await web3auth.logout();
    setProvider(null);
    handleDisconnected();
  }, [handleDisconnected]);

  useEffect(() => {
    let isStale = false;
    const init = async () => {
      if (isStale) return;

      const provider = web3auth.provider;
      if (web3AuthStatus === ADAPTER_EVENTS.CONNECTED) {
        if (!provider) {
          throw new Error("Provider not found");
        }

        try {
          await handleConnected(provider);
        } catch (error) {
          console.error(error);
          handleDisconnected();
        }
      } else if (web3AuthStatus === ADAPTER_EVENTS.DISCONNECTED) {
        handleDisconnected();
      }
    };

    void init();

    return () => {
      isStale = true;
    };
  }, [handleConnected, handleDisconnected, web3AuthStatus]);

  const contextValue = useMemo(
    () =>
      ({
        web3AuthStatus,
        provider,
        loggedIn,
        login,
        logout,
      } satisfies Web3AuthContext),
    [web3AuthStatus, provider, loggedIn, login, logout]
  );

  return (
    <Web3AuthContext.Provider value={contextValue}>
      {children}
    </Web3AuthContext.Provider>
  );
}

export function useWeb3Auth() {
  return useContext(Web3AuthContext);
}
