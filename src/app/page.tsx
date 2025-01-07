import { RendererProvider } from "@/components/RendererContext";
import styles from "./page.module.css";
import SceneRenderer from "@/components/SceneRenderer/SceneRenderer";
import { FlatTriangleScene } from "@/scenes/FlatRedTriangle";

export default function Home() {
  return (
    <div className={styles.page}>
      <RendererProvider>
        <main className={styles.main}>
          <SceneRenderer scene={FlatTriangleScene} />
        </main>
      </RendererProvider>
    </div>
  );
}
