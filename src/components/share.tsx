import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { Fragment, useCallback, useState } from "react";
import styles from "./share.module.css";
import classNames from "classnames";
import QRCode from "react-qr-code";
import { Button } from "./button";

const popupData = signal<ShareData | undefined>(undefined);

export function SharePopup() {
  useSignals();

  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    popupData.value = undefined;
  }, []);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(popupData.value?.url ?? "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, []);

  const { url = "" } = popupData.value ?? {};
  const open = popupData.value !== undefined;

  return (
    <Fragment>
      <div
        className={classNames(styles.screen, { [styles.open]: open })}
        onClick={close}
      ></div>
      <div className={classNames(styles.popup, { [styles.open]: open })}>
        <QRCode className={styles.qr} value={url} />
        <div className={styles.copy}>
          <span className={styles.url}>{url}</span>
          <Button onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
        </div>
      </div>
    </Fragment>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function share(data: ShareData) {
  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
      console.warn(e);
    }
  }
  popupData.value = data;
}
