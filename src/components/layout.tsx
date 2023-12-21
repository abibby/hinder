import { PropsWithChildren, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./layout.module.css";

export function Layout({ children }: PropsWithChildren) {
  // const [vvHeight, setVVHeight] = useState(0);
  useEffect(() => {
    if (window.visualViewport) {
      const vv = window.visualViewport;
      function resizeHandler() {
        window.document.body.style.setProperty("--vvh", vv.height);
        // setVVHeight(vv.height);
      }
      window.document.body.style.setProperty("--vvh", vv.height);
      // setVVHeight(vv.height);

      window.visualViewport.addEventListener("resize", resizeHandler);
      return () => {
        window.visualViewport?.removeEventListener("resize", resizeHandler);
      };
    }
  }, []);

  return (
    <div className={styles.root}>
      <nav>
        <Link to="/">home</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
