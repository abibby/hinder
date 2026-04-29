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

  const { url, text } = popupData.value ?? {};
  const message = [text, url].filter((part) => part).join(" ");

  const copy = useCallback(async () => {
    if (!url) {
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [url]);

  const nativeShare = useCallback(async () => {
    try {
      await navigator.share(popupData.value);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
      throw e;
    }
  }, []);

  const open = popupData.value !== undefined;

  return (
    <Fragment>
      <div
        className={classNames(styles.screen, { [styles.open]: open })}
        onClick={close}
      ></div>
      <div className={classNames(styles.popup, { [styles.open]: open })}>
        {url && <QRCode className={styles.qr} value={url} />}
        <div className={styles.copy}>
          <span className={styles.url}>{message}</span>
          <Button onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
        </div>
        {!!navigator.share && (
          <div className={styles.nativeShare}>
            <Button onClick={nativeShare}>Send Invite</Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export async function share(data: ShareData) {
  popupData.value = data;
}
