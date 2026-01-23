import React from 'react';
import UploadWidget from '../components/UploadWidget';

const Upload = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                    Upload Documents
                </h1>
                <p className="text-slate-400 text-lg">
                    Securely upload your files for AI processing and extraction.
                </p>
            </div>

            <UploadWidget />
        </div>
    );
};

export default Upload;
