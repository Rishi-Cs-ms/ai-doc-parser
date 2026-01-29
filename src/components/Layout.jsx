import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    CreditCard,
    Receipt,
    Globe,
    BadgeCheck,
    Hexagon,
    ChevronDown,
    Menu,
    X,
    UploadCloud,
    LogIn,
    LogOut,
    User
} from 'lucide-react';
import { isLoggedIn, logout, getLoginUrl } from '../api/auth';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(isLoggedIn());

    useEffect(() => {
        // Update auth state whenever location changes (to catch token updates)
        setAuthenticated(isLoggedIn());
    }, [location]);

    const handleLogin = () => {
        window.location.href = getLoginUrl();
    };

    const handleLogout = () => {
        logout();
        setAuthenticated(false);
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Uploads', path: '/upload', icon: <UploadCloud size={20} /> },
        { name: 'Resumes', path: '/resume', icon: <FileText size={20} /> },
        { name: 'Invoices', path: '/invoice', icon: <Receipt size={20} /> },
        { name: 'Loans', path: '/loan', icon: <CreditCard size={20} /> },
        { name: 'Passports', path: '/passport', icon: <Globe size={20} /> },
        { name: 'ID-Proofs', path: '/idproof', icon: <BadgeCheck size={20} /> },
    ];

    const handleDropdownNavigate = (path) => {
        navigate(path);
        setDropdownOpen(false);
    };

    const currentItem = navItems.find(item => item.path === location.pathname) || navItems[0];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Abstract Background */}
            <div className="fixed inset-0 -z-10 bg-[#050511]">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/10 blur-[100px]" />
            </div>

            {/* Top Navigation Bar (Mobile & Desktop Header) */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 glass-card !rounded-none !border-x-0 !border-t-0 flex items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <Hexagon className="text-indigo-400" size={24} />
                    <span className="font-bold text-lg tracking-wide">NEXUS</span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </header>

            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-20 xl:w-72 fixed inset-y-0 left-0 z-40 flex-col items-center xl:items-stretch py-8 border-r border-white/5 bg-[#050511]/50 backdrop-blur-xl">
                <div className="px-6 mb-12 flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                        <Hexagon className="text-white relative z-10" size={32} />
                    </div>
                    <h1 className="hidden xl:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        NEXUS
                    </h1>
                </div>

                <nav className="flex-1 w-full px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 group
                  ${isActive
                                        ? 'bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={`transition-transform duration-300 ${isActive ? 'scale-110 text-indigo-400' : 'group-hover:text-indigo-300'}`}>
                                    {item.icon}
                                </span>
                                <span className="hidden xl:block font-medium">{item.name}</span>
                                {isActive && <div className="hidden xl:block absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[#050511] pt-20 px-6 lg:hidden">
                    <nav className="space-y-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => `flex items-center gap-4 p-4 rounded-xl text-lg ${isActive ? 'bg-indigo-600/20 text-white' : 'text-slate-400'}`}
                            >
                                {item.icon}
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 pt-20 lg:pt-8 lg:ml-20 xl:ml-72 p-4 md:p-6 lg:p-10 w-full max-w-[100vw] overflow-x-hidden transition-all duration-300">
                {/* Top Headers for Quick Navigation & Auth */}
                <div className="w-full flex justify-end items-center gap-4 mb-8 relative z-30 px-2 sm:px-0">
                    <button
                        onClick={authenticated ? handleLogout : handleLogin}
                        className={`flex items-center gap-2 px-4 py-3 rounded-full border transition-all text-sm font-medium
                            ${authenticated
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'}`}
                    >
                        {authenticated ? (
                            <>
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={16} />
                                <span className="hidden sm:inline">Login</span>
                            </>
                        )}
                    </button>

                    <div className="relative max-w-full">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 px-4 sm:px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium tracking-wide max-w-full truncate"
                        >
                            <span className="text-slate-400 hidden sm:inline">View:</span>
                            <span className="text-white flex items-center gap-2 truncate">
                                {currentItem.icon}
                                <span className="truncate">{currentItem.name}</span>
                            </span>
                            <ChevronDown size={16} className={`ml-2 text-slate-500 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 glass-card overflow-hidden animate-[fadeIn_0.2s_ease-out] z-50">
                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleDropdownNavigate(item.path)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                                    >
                                        {item.icon}
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
