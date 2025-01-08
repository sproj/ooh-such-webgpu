import { RendererProvider } from "@/components/RendererContext";
import styles from "./page.module.css";
import SceneRenderer from "@/components/SceneRenderer";
import { FlatTriangleScene } from "@/scenes/FlatRedTriangle";
import SceneSelector from "@/components/SceneSelector";
import { UserInputProvider } from "@/components/EditorContext";
import VertexEditor from "@/components/VertexEditor";
import ShaderEditor from "@/components/ShaderEditor";

export default function Home() {

  return (
    <div className={styles.page}>
      <UserInputProvider>
        <RendererProvider>
          <main className={styles.main}>
            <div className={styles.renderer}>
              <SceneRenderer scene={FlatTriangleScene} />
            </div>
            <div className={styles.input}>
              <SceneSelector />
              <VertexEditor />
              <ShaderEditor />
            </div>
          </main>
        </RendererProvider>
      </UserInputProvider>
    </div>
  );
}
