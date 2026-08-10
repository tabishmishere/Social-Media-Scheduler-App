import { Link } from "react-router-dom";
import { ArrowRightIcon, DotIcon } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[56px_56px] pointer-events-none" />

            {/* Indigo soft glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center animate-fade-in-up">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm px-3.5 py-1.5 rounded-full mb-8 animate-float shadow-sm font-medium">
                    <span className="size-1.5 bg-indigo-500 rounded-full animate-ping" />
                    AI-Powered Social Media Automation
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-slate-900 tracking-tight">
                    Schedule smarter.
                    <br />
                    <span className="text-indigo-600 italic inline-block transition-transform duration-300 hover:scale-105">Grow faster.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-7 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">Scheduler lets you create, schedule, and auto-engage across all your social platforms — powered by AI that writes your captions and replies for you.</p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/login" className="btn-animate bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/30 inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto justify-center transition-all active:scale-95">
                        Start for free <ArrowRightIcon className="size-4" />
                    </Link>
                    <a href="#how-it-works" className="btn-animate bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto justify-center transition-all active:scale-95 shadow-sm">
                        See how it works
                    </a>
                </div>

                <p className="mt-5 text-xs text-slate-500">No credit card required · Free forever plan available</p>
            </div>

            {/* Dashboard mockup */}
            <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-0 animate-scale-in">
                <div className="rounded-t-2xl overflow-hidden border border-slate-200 border-b-0 shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#f0f0f0", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <div className="w-3 h-3 rounded-full bg-rose-400 hover:opacity-80 cursor-pointer transition-opacity" />
                        <div className="w-3 h-3 rounded-full bg-amber-400 hover:opacity-80 cursor-pointer transition-opacity" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400 hover:opacity-80 cursor-pointer transition-opacity" />
                        <div className="flex-1 mx-4 rounded-md h-5 max-w-xs bg-white/80" />
                    </div>

                    {/* Mock content */}
                    <div className="p-6" style={{ background: "#f8fafc" }}>
                        {/* Stat row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                            {[
                                { val: "12", label: "Scheduled" },
                                { val: "48", label: "Published" },
                                { val: "4", label: "Accounts" },
                                { val: "3", label: "AI Rules" },
                            ].map((s) => (
                                <div key={s.label} className="card-hover rounded-xl p-4 bg-white border border-slate-100 cursor-pointer">
                                    <div className="text-2xl font-bold text-slate-900 tabular-nums">{s.val}</div>
                                    <div className="text-xs text-slate-500 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Activity list */}
                        <div className="rounded-xl p-4 space-y-3 bg-white border border-slate-100">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Activity</div>
                            {[
                                { text: "Post published to LinkedIn & Twitter", time: "2m ago" },
                                { text: "AI replied to 3 comments", time: "15m ago" },
                                { text: "New post scheduled for tomorrow 9am", time: "1h ago" },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                                    <DotIcon className="size-5 text-indigo-600 animate-pulse" />
                                    <span className="text-sm text-slate-600 flex-1">{item.text}</span>
                                    <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
