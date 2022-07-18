import Head from "next/head";
import styles from "./layout.module.css";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>Layouts Example</title>
      </Head>

      <main className={styles.main}>{children}</main>
    </>
  );
}
