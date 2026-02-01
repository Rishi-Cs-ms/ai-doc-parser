import React, { useMemo, useState } from 'react';
import { Download, ExternalLink, Hash, Search } from 'lucide-react';

const DataTable = ({ items, isLoading, definedColumns }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const processedData = useMemo(() => {
        if (!items) return [];
        return items.map(item => {
            let parsedData = {};

            // Try to get data from aiResult (already an object) or extracted_data (JSON string)
            const sourceData = item.aiResult || item.extracted_data;

            if (sourceData) {
                if (typeof sourceData === 'object') {
                    parsedData = sourceData.data || sourceData;
                } else {
                    try {
                        const extracted = JSON.parse(sourceData);
                        parsedData = extracted.data || extracted;
                    } catch (e) {
                        console.error("Failed to parse source data", e);
                        parsedData = { error: "Parse Error" };
                    }
                }
            }

            return {
                ...item,
                ...parsedData,
                parsedData
            };
        });
    }, [items]);

    const columns = useMemo(() => {
        if (definedColumns && definedColumns.length > 0) return definedColumns;
        if (processedData.length === 0) return [];

        const allKeys = new Set();
        processedData.slice(0, 5).forEach(item => {
            Object.keys(item).forEach(key => {
                if (!['items', 'count', 'extracted_data', 'aiResult', 'parsedData', 'file_id', 'documentId', 'userId', 'isAdmin', 'bucket', 'document_type', 'documentType', 's3_path', 's3Key', 'created_at', 'createdAt', 'view_document_url', 'downloadUrl', 'fileUrl'].includes(key)) {
                    allKeys.add(key);
                }
            });
        });

        const priority = ['username', 'name', 'email', 'phone', 'location', 'skills', 'experience', 'education'];
        return Array.from(allKeys).sort((a, b) => {
            const idxA = priority.indexOf(a);
            const idxB = priority.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [processedData, definedColumns]);

    const filteredData = useMemo(() => {
        if (!searchQuery) return processedData;

        const lowerQuery = searchQuery.toLowerCase();
        return processedData.filter(row => {
            // Check top level fields and dynamic columns
            const searchableValues = [
                row.file_id || row.documentId,
                row.s3_path || row.documentId,
                row.username,
                ...columns.map(col => row[col])
            ];

            return searchableValues.some(val =>
                val && val.toString().toLowerCase().includes(lowerQuery)
            );
        });
    }, [processedData, searchQuery, columns]);

    const formatDate = (row) => {
        const val = row.created_at || row.createdAt;
        if (!val) return 'N/A';

        const date = new Date(typeof val === 'number' ? val * 1000 : val);
        if (isNaN(date.getTime())) return 'N/A';

        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return (
            <div className="w-full h-80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                    </div>
                    <p className="text-slate-400 animate-pulse font-medium tracking-wider">SYNCING DATA...</p>
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <p className="text-slate-500 text-lg">No records found in this category.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
            </div>

            <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.03]">
                                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Created At
                                </th>
                                {columns.map(col => (
                                    <th key={col} className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        {col.replace(/_/g, ' ')}
                                    </th>
                                ))}
                                <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredData.length > 0 ? (
                                filteredData.map((row) => {
                                    const rowKey = row.file_id || row.documentId || Math.random().toString();
                                    const docUrl = row.fileUrl || row.downloadUrl || row.view_document_url;

                                    return (
                                        <tr key={rowKey} className="group hover:bg-white/[0.04] transition-colors duration-200">
                                            <td className="p-6 text-sm text-slate-400 whitespace-nowrap font-mono align-top">
                                                {formatDate(row)}
                                            </td>

                                            {columns.map(col => (
                                                <td key={`${rowKey}-${col}`} className="p-6 min-w-[200px] text-sm text-slate-300 break-words whitespace-pre-wrap align-top" title={row[col]?.toString()}>
                                                    {row[col] ? row[col].toString() : <span className="text-slate-700">-</span>}
                                                </td>
                                            ))}

                                            <td className="p-6 text-right align-top">
                                                {docUrl ? (
                                                    <a
                                                        href={docUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/40"
                                                        title="View Document"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                ) : row.s3_path ? (
                                                    <button
                                                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg hover:shadow-indigo-500/40"
                                                        title="Copy S3 Path"
                                                        onClick={() => navigator.clipboard.writeText(row.s3_path).then(() => alert('S3 Path copied!'))}
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 2} className="p-12 text-center text-slate-500">
                                        No matching records found for "{searchQuery}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
