import Head from "next/head";
import Header from "../Header";

import styles from "./Layout.module.css";

const Layout = ({ children, title = "Compound Dashboard" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={styles.layout}>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default Layout;
