"use client"
import { useState } from 'react';
import { useUserInput } from './EditorContext';

export const VertexShaderEditor = () => {
    const [shaderInput, setShaderInput] = useState('');
    const { setVertexShaderCode } = useUserInput();
    const handleSubmit = () => {
        setVertexShaderCode(shaderInput);
    };

    return (
        <div>
            <h3>Vertex Shader Editor</h3>
            <textarea
                value={shaderInput}
                onChange={(e) => setShaderInput(e.target.value)}
                placeholder="Write your shader code here..."
                rows={10}
                cols={50}
            />
            <button onClick={handleSubmit}>Render Custom Shader</button>
        </div>
    );
};

export default VertexShaderEditor;