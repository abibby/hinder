import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import styles from "./layout.module.css";
import classNames from "classnames";

export interface LayoutProps {
  className?: string;
}

export function Layout({
  children,
  className,
}: PropsWithChildren<LayoutProps>) {
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <Link className={styles.navItem} to="/">
          [hinder]
        </Link>
      </nav>
      <div className={classNames(styles.content, className)}>{children}</div>
    </div>
  );
}
