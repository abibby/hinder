import { PropsWithChildren, useCallback } from "react";
import { Link } from "react-router-dom";
import styles from "./layout.module.css";
import classNames from "classnames";
import { share } from "./share";

export interface LayoutProps {
  className?: string;
}

export function Layout({
  children,
  className,
}: PropsWithChildren<LayoutProps>) {
  const openShare = useCallback(async () => {
    await share({
      title: "Join the vote",
      url: location.href,
    });
  }, []);
  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <Link className={styles.navItem} to="/">
          [hinder]
        </Link>
        <button className={styles.navItem} onClick={openShare}>
          share
        </button>
      </nav>
      <div className={classNames(styles.content, className)}>{children}</div>
    </div>
  );
}
