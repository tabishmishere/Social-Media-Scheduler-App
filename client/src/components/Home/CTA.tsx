import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20" style={{ background: "#ffffff" }}>
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div
                    className="relative rounded-3xl overflow-hidden p-14 sm:p-20 text-center"
                    style={{
                        background: "linear-gradient(145deg, #fff5f5 0%, #fef2f2 100%)",
                        border: "1.5px solid rgba(239,68,68,0.12)",
                    }}
                >
                    {/* Glow blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)" }} />

                    <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/15 text-red-500 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">Ready to grow?</div>
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight font-medium text-gray-900">
                            Automate your social
                            <br />
                            <span className="text-red-400 italic">media today</span>
                        </h2>
                        <p className="mt-6 text-gray-500 max-w-lg mx-auto  text-lg">Join thousands of creators and marketers who trust Scheduler to grow their audience on autopilot.</p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="btn-animate bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 shadow-lg hover:shadow-red-500/30 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center active:scale-95">
                                Get Started Free <ArrowRightIcon className="size-4" />
                            </Link>
                            <a href="#pricing" className="btn-animate bg-white text-slate-800 border border-slate-200 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center active:scale-95 shadow-sm">
                                View Pricing
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-gray-400">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
