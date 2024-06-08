import { CHAIN_NAMESPACES } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { numberToHex } from "viem";
import { baseSepolia } from "viem/chains";

import { env } from "~/env";

// IMP START - Dashboard Registration
const clientId = env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID; // get from https://dashboard.web3auth.io

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: numberToHex(baseSepolia.id), // Please use 0x1 for Mainnet
  rpcTarget: baseSepolia.rpcUrls.default.http[0],
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io/",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const web3auth = new Web3AuthNoModal({
  clientId,
  chainConfig,
  web3AuthNetwork: env.NEXT_PUBLIC_WEB3AUTH_NETWORK,
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: "redirect",
    replaceUrlOnRedirect: false,
    loginConfig: {
      jwt: {
        typeOfLogin: "jwt",
        clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
        verifier: env.NEXT_PUBLIC_WEB3AUTH_VERIFIER_ID,
      },
    },
    sessionTime: 604800,
  },
  privateKeyProvider,
});

if (typeof window !== "undefined") {
  web3auth.configureAdapter(openloginAdapter);
  void web3auth.init();
}

export { openloginAdapter, privateKeyProvider, web3auth };
