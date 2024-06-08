import { Web3AuthSignInOut } from "./_components/sign-in-out";

import styles from "./index.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Web3AuthSignInOut />
      </div>
    </main>
  );
}
