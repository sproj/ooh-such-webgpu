"use client"
import { SceneDefinition } from "@/lib/SceneDefinition";
import { FlatTriangleScene } from "@/scenes/FlatRedTriangle";
import { useUserInput } from "./EditorContext";

const SceneSelector = () => {
    const preDefinedScenes: SceneDefinition[] = [
      FlatTriangleScene
    ];
    const { setScene } = useUserInput();
  
    return (
      <div>
        <h3>Select a Scene</h3>
        <ul>
          {preDefinedScenes.map((scene, index) => (
            <li key={index}>
              <button onClick={() => setScene(scene)}>{scene.name}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default SceneSelector;
  