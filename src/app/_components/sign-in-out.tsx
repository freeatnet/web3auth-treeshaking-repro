"use client";

import { useWeb3Auth } from "../_providers/web3auth";

export function Web3AuthSignInOut({ className }: { className?: string }) {
  const { web3AuthStatus, loggedIn, login, logout } = useWeb3Auth();

  return (
    <div>
      <div>
        Web3Auth: {String(web3AuthStatus)}, loggedIn: {String(loggedIn)}
      </div>
      {web3AuthStatus != null &&
        ["ready", "connected"].includes(web3AuthStatus) &&
        (loggedIn ? (
          <button className={className} onClick={() => void logout()}>
            Sign Out
          </button>
        ) : (
          <button className={className} onClick={() => void login()}>
            Sign In
          </button>
        ))}
    </div>
  );
}
