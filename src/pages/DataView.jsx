import React, { useEffect, useState } from 'react';
import { fetchData } from '../api/client';
import DataTable from '../components/DataTable';
import { RefreshCw, Sparkles, AlertCircle, LogIn, Lock } from 'lucide-react';
import { isLoggedIn, getLoginUrl } from '../api/auth';

const DataView = ({ endpoint, title, subtitle, columns }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    // Check login status on mount and when component updates
    useEffect(() => {
        setUserLoggedIn(isLoggedIn());
    }, []);

    const loadData = async () => {
        if (!isLoggedIn()) {
            setError('Please log in to view data.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchData(endpoint);
            setItems(data.items || []);
        } catch (err) {
            console.error('Failed to load data:', err);
            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
            } else if (err.response?.status === 403) {
                setError('Access denied. You do not have permission to view this data.');
            } else {
                setError('Failed to load data. Please check network connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn()) {
            loadData();
        } else {
            setIsLoading(false);
        }
    }, [endpoint]);

    // If not logged in, show login prompt
    if (!userLoggedIn) {
        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 flex-wrap">
                            <span className="truncate">{title}</span>
                            <Sparkles className="text-amber-300 opacity-60 flex-shrink-0" size={24} />
                        </h1>
                        <p className="text-slate-400 mt-2 text-base md:text-lg font-light tracking-wide max-w-xl break-words">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Login Required Message */}
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                        <Lock size={40} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                        <p className="text-slate-400 max-w-md">
                            You must be logged in to view {title.toLowerCase()}. Please log in to continue.
                        </p>
                    </div>
                    <button
                        onClick={async () => window.location.href = await getLoginUrl()}
                        className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                    >
                        <LogIn size={20} />
                        Login to View Data
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 flex-wrap">
                        <span className="truncate">{title}</span>
                        <Sparkles className="text-amber-300 opacity-60 flex-shrink-0" size={24} />
                    </h1>
                    <p className="text-slate-400 mt-2 text-base md:text-lg font-light tracking-wide max-w-xl break-words">
                        {subtitle}
                    </p>
                </div>

                {/* Refresh Button on the RIGHT */}
                <div className="flex justify-end w-full md:w-auto">
                    <button
                        onClick={loadData}
                        className="group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                        disabled={isLoading}
                    >
                        <RefreshCw size={20} className={`transition-transform duration-700 flex-shrink-0 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                        <span className="whitespace-nowrap">Refresh Data</span>
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-200 flex items-center gap-3 animate-in fade-in">
                    <AlertCircle className="text-red-400" size={20} />
                    {error}
                </div>
            )}

            {/* Table Component */}
            <DataTable items={items} isLoading={isLoading} definedColumns={columns} />
        </div>
    );
};

export default DataView;
