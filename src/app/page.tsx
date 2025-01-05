import styles from "./page.module.css";
import Canvas3D from '@/components/Canvas3D';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Canvas3D />
      </main>
    </div>
  );
}
