import { useHash } from "../hooks/hash";
import { Layout } from "../components/layout";
import styles from "./qr.module.css";
import QRCode from "react-qr-code";
import { Button } from "../components/button";

export function QR() {
  const [listID] = useHash();

  return (
    <Layout className={styles.root}>
      <QRCode
        className={styles.qr}
        value={location.origin + "/add#" + listID}
      />
      <Button className={styles.start} size="lg" href={`/add#${listID}`}>
        start
      </Button>
    </Layout>
  );
}
