import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileText,
    CreditCard,
    Receipt,
    Globe,
    BadgeCheck,
    Activity,
    ArrowUpRight,
    UploadCloud
} from 'lucide-react';
import UploadWidget from '../components/UploadWidget';

const Dashboard = () => {
    const cards = [
        { title: 'Upload', path: '/upload', icon: <UploadCloud size={32} />, color: 'from-emerald-500 to-teal-500', desc: 'Add New Documents' },
        { title: 'Resumes', path: '/resume', icon: <FileText size={32} />, color: 'from-indigo-500 to-purple-500', desc: 'Applicant Parsing' },
        { title: 'Invoices', path: '/invoice', icon: <Receipt size={32} />, color: 'from-pink-500 to-rose-500', desc: 'Financial Records' },
        { title: 'Loans', path: '/loan', icon: <CreditCard size={32} />, color: 'from-cyan-500 to-blue-500', desc: 'Approval Systems' },
        { title: 'Passports', path: '/passport', icon: <Globe size={32} />, color: 'from-amber-500 to-orange-500', desc: 'Identity verification' },
        { title: 'ID Proofs', path: '/idproof', icon: <BadgeCheck size={32} />, color: 'from-emerald-500 to-teal-500', desc: 'KYC Documents' },
    ];

    return (
        <div className="space-y-16 animate-in fade-in duration-700">
            {/* Hero Header */}
            <div className="relative">
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200">
                        Welcome Back
                    </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl font-light leading-relaxed">
                    Your intelligent command center for automated document extraction and analysis.
                </p>

                <div className="absolute top-0 right-0 px-4 py-2 bg-white/5 border border-white/10 rounded-full hidden lg:flex items-center gap-3 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#4ade80] animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-emerald-400/80">System Online</span>
                </div>
            </div>

            {/* Stats/Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cards.map((card) => (
                    <Link
                        key={card.path}
                        to={card.path}
                        className="group relative h-72 rounded-[2rem] bg-white/[0.03] border border-white/5 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-24 -top-24 w-64 h-64 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-[80px] group-hover:opacity-30 transition-opacity duration-700`} />

                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    {card.icon}
                                </div>
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-white text-white group-hover:text-black transition-all duration-300">
                                    <ArrowUpRight size={18} />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{card.title}</h3>
                                <p className="text-slate-500 text-sm font-medium tracking-wider uppercase">{card.desc}</p>
                            </div>
                        </div>
                    </Link>
                ))}


            </div>

            <div className="mt-16 pb-10">
                <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Quick Upload</h2>
                <UploadWidget />
            </div>
        </div>
    );
};

export default Dashboard;
