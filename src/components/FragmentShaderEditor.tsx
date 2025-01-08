"use client"
import { useState } from 'react';
import { useUserInput } from './EditorContext';

export const FragmentShaderEditor = () => {
    const [shaderInput, setShaderInput] = useState('');
    const { setFragmentShaderCode } = useUserInput();
    const handleSubmit = () => {
        setFragmentShaderCode(shaderInput);
    };

    return (
        <div>
            <h3>Fragment Shader Editor</h3>
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

export default FragmentShaderEditor;