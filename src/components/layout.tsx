import { PropsWithChildren, useEffect, useState } from "react";
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
      <nav>
        <Link to="/">home</Link>
      </nav>
      <div className={className}>{children}</div>
    </div>
  );
}
