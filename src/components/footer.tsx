import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className="list-none">
        <li className="inline-block">
          <a href="https://next-auth.js.org">Documentation</a>
        </li>
      </ul>
    </footer>
  );
}
