import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 transition-all">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 group transition-transform active:scale-95">
                    <img src="/logo.svg" alt="logo" className="size-7 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-xl lg:text-2xl font-medium font-serif text-slate-800">Scheduler</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
                    <a href="#features" className="hover:text-slate-900 transition-colors duration-200 hover:-translate-y-0.5 inline-block">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-slate-900 transition-colors duration-200 hover:-translate-y-0.5 inline-block">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-slate-900 transition-colors duration-200 hover:-translate-y-0.5 inline-block">
                        Pricing
                    </a>
                </div>

                {user ? (
                    <Link to="/dashboard" className="btn-animate flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4.5 py-2 rounded-full shadow-sm hover:shadow-indigo-500/20 active:scale-95">
                        Go to Dashboard <ArrowRightIcon className="size-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:block transition-colors active:scale-95 font-medium">
                            Sign In
                        </Link>
                        <Link to="/login" className="btn-animate flex items-center gap-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4.5 py-2 rounded-full shadow-sm hover:shadow-indigo-500/20 active:scale-95 font-medium">
                            Get Started <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
