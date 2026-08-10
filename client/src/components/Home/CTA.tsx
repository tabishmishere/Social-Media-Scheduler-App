import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div
                    className="relative rounded-3xl overflow-hidden p-14 sm:p-20 text-center"
                    style={{
                        background: "linear-gradient(145deg, #eef2ff 0%, #f5f3ff 100%)",
                        border: "1.5px solid rgba(99,102,241,0.15)",
                    }}
                >
                    {/* Glow blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

                    <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">Ready to grow?</div>
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight font-medium text-slate-900">
                            Automate your social
                            <br />
                            <span className="text-indigo-600 italic">media today</span>
                        </h2>
                        <p className="mt-6 text-slate-600 max-w-lg mx-auto text-lg leading-relaxed">Join thousands of creators and marketers who trust Scheduler to grow their audience on autopilot.</p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="btn-animate bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center active:scale-95">
                                Get Started Free <ArrowRightIcon className="size-4" />
                            </Link>
                            <a href="#pricing" className="btn-animate bg-white text-slate-800 border border-slate-200 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center active:scale-95 shadow-sm">
                                View Pricing
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-slate-500">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
