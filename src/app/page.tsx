import { RendererProvider } from "@/components/RendererContext";
import styles from "./page.module.css";
import SceneRenderer from "@/components/SceneRenderer";
import { FlatTriangleScene } from "@/scenes/FlatRedTriangle";
import SceneSelector from "@/components/SceneSelector";
import { UserInputProvider } from "@/components/EditorContext";
import VertexEditor from "@/components/VertexEditor";
import VertexShaderEditor from "@/components/VertexShaderEditor";
import FragmentShaderEditor from "@/components/FragmentShaderEditor";

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
              <VertexShaderEditor />
              <FragmentShaderEditor />
            </div>
          </main>
        </RendererProvider>
      </UserInputProvider>
    </div>
  );
}
