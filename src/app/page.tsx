import { RendererProvider } from "@/components/RendererContext";
import styles from "./page.module.css";
import SceneRenderer from "@/components/SceneRenderer";
import { FlatTriangleScene } from "@/scenes/FlatRedTriangle";

export default function Home() {
  return (
    <div className={styles.page}>
      <RendererProvider>
        <main className={styles.main}>
          <div className={styles.renderer}>
            <SceneRenderer scene={FlatTriangleScene} />
          </div>
          <div className={styles.input}>ddd</div>
        </main>
      </RendererProvider>
    </div>
  );
}
