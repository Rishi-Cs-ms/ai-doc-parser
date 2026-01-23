import React, { useEffect, useState } from 'react';
import { fetchData } from '../api/client';
import DataTable from '../components/DataTable';
import { RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

const DataView = ({ endpoint, title, subtitle, columns }) => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchData(endpoint);
            setItems(data.items || []);
        } catch (err) {
            setError('Failed to load data. Please check network connection.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [endpoint]);

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
