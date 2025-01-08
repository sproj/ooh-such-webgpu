"use client"
import { SceneDefinition } from "@/lib/SceneDefinition";
import { createContext, PropsWithChildren, useContext, useState } from "react";

export interface UserInputState {
    scene: SceneDefinition | null; // The selected or custom scene
    customVertexData?: Float32Array; // Custom vertex data (optional)
    customShaderCode?: string; // Custom shader code (optional)
}

export interface UserInputContext {
    userInput: UserInputState
    setScene(scene: SceneDefinition): void;
    setShaderCode: (shaderCode: string) => void;
    setVertexData: (vertexData: Float32Array) => void
}

const UserInputContext = createContext<UserInputContext | undefined>(undefined);

export const UserInputProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [userInput, setUserInput] = useState<UserInputState>({ scene: null });

    const setScene = (scene: SceneDefinition) => {
        setUserInput((prev) => ({ ...prev, scene }));
    };

    const setShaderCode = (shaderCode: string) => {
        setUserInput((prev) => ({ ...prev, customShaderCode: shaderCode }));
    };

    const setVertexData = (vertexData: Float32Array) => {
        setUserInput((prev) => ({ ...prev, customVertexData: vertexData }));
    };


    return (
        <UserInputContext.Provider value={{ userInput, setShaderCode, setVertexData, setScene }}>
            {children}
        </UserInputContext.Provider>
    )
}

export const useUserInput = () => {
    const context = useContext(UserInputContext);
    if (!context) {
      throw new Error('useUserInput must be used within a UserInputProvider');
    }
    return context;
  };