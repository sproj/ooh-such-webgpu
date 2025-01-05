import styles from "./page.module.css";
import WebGPUCanvas from '@/components/WebGPUCanvas';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <WebGPUCanvas />
      </main>
    </div>
  );
}
