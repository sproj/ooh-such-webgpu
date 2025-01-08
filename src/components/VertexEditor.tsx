"use client"
import { useState } from "react";
import { useUserInput } from "./EditorContext";

export const VertexEditor = () => {
    const [vertexInput, setVertexInput] = useState('');

    const { setVertexData } = useUserInput()
    const handleSubmit = () => {
        try {
            const parsedData = JSON.parse(vertexInput);
            if (!Array.isArray(parsedData)) throw new Error('Invalid vertex data');
            setVertexData(new Float32Array(parsedData));
        } catch (e) {
            console.error('Invalid vertex data:', e);
        }
    };

    return (
        <div>
            <h3>Custom Vertex Data</h3>
            <textarea
                value={vertexInput}
                onChange={(e) => setVertexInput(e.target.value)}
                placeholder="Enter vertex data as a JSON array..."
                rows={5}
                cols={50}
            />
            <button onClick={handleSubmit}>Render Custom Vertex Data</button>
        </div>
    );
};

export default VertexEditor;