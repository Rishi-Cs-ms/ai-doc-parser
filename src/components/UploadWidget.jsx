import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const UploadWidget = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    // API Endpoint from legacy project
    const API_ENDPOINT = 'https://8h60njzxe8.execute-api.ca-central-1.amazonaws.com/first/upload';

    const handleFileSelect = (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage('Invalid file type. Only PDF, PNG, and JPG are allowed.');
            setStatus('error');
            return;
        }

        setSelectedFile(file);
        setStatus('idle');
        setErrorMessage('');
        setUploadProgress(0);
    };

    const removeFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setStatus('idle');
        setUploadProgress(0);
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB'][i];
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setStatus('uploading');
        setUploadProgress(0);

        try {
            // Step 1: Get Pre-signed URL
            const response = await axios.post(API_ENDPOINT, {
                fileName: selectedFile.name,
                contentType: selectedFile.type
            });

            const { uploadUrl } = response.data;

            // Step 2: Upload to S3 using PUT
            await axios.put(uploadUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            setStatus('success');
            setUploadProgress(100);
        } catch (error) {
            console.error('Upload failed:', error);
            setErrorMessage(error.message || 'Upload failed. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="glass-card p-10 flex flex-col items-center w-full">

            {/* Drag & Drop Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                    ${isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-white/10 hover:border-indigo-400/50 hover:bg-white/5'
                    }
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.png,.jpg,.jpeg"
                    hidden
                />

                <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 ${isDragging ? 'scale-110' : ''} transition-transform`}>
                    <UploadCloud size={40} className="text-white" />
                </div>

                <p className="text-xl font-medium text-white mb-2">
                    {isDragging ? 'Drop file here' : 'Click or Drag file to upload'}
                </p>
                <p className="text-slate-500">Supported: PDF, PNG, JPG</p>
            </div>

            {/* File Details & Status */}
            {selectedFile && (
                <div className="w-full mt-8 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="p-3 rounded-lg bg-indigo-500/20 text-indigo-300">
                                <File size={24} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-white font-medium truncate">{selectedFile.name}</p>
                                <p className="text-slate-500 text-sm">{formatBytes(selectedFile.size)}</p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Progress Bar */}
                    {(status === 'uploading' || status === 'success') && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-indigo-300">Uploading...</span>
                                <span className="text-white">{uploadProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Status Messages */}
                    {status === 'success' && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3 animate-in fade-in">
                            <CheckCircle size={20} />
                            File uploaded successfully!
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 flex items-center gap-3 animate-in fade-in">
                            <AlertCircle size={20} />
                            {errorMessage}
                        </div>
                    )}

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={status === 'uploading' || status === 'success'}
                        className="w-full btn-glow flex items-center justify-center gap-3 group"
                    >
                        {status === 'uploading' ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <>
                                <UploadCloud size={24} className="group-hover:-translate-y-1 transition-transform" />
                                <span>{status === 'success' ? 'Uploaded' : 'Start Upload'}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadWidget;
