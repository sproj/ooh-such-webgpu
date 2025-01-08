"use client"
import { useState } from 'react';
import { useUserInput } from './EditorContext';

export const ShaderEditor = () => {
    const [shaderInput, setShaderInput] = useState('');
    const { setShaderCode } = useUserInput();
    const handleSubmit = () => {
        setShaderCode(shaderInput);
    };

    return (
        <div>
            <h3>Custom Shader Editor</h3>
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

export default ShaderEditor;