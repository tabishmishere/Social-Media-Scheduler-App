import { CalendarDaysIcon, Wand2Icon, Share2Icon, ZapIcon, BarChart3Icon, HashIcon } from "lucide-react";

const features = [
    {
        icon: CalendarDaysIcon,
        title: "Smart Scheduling",
        description: "Queue posts across all platforms with a single click. Set it once and let us handle the rest.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: Wand2Icon,
        title: "AI Content Generator",
        description: "Generate on-brand captions and stunning images with our built-in AI. Never stare at a blank page again.",
        color: "bg-indigo-50 text-indigo-600",
    },

    {
        icon: BarChart3Icon,
        title: "Activity Dashboard",
        description: "Get a bird's eye view of all published posts, scheduled content, and engagement activity in one place.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: Share2Icon,
        title: "Multi-Platform",
        description: "Connect Twitter, LinkedIn, Facebook, and Instagram. Post everywhere from one unified workspace.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: ZapIcon,
        title: "Instant Publishing",
        description: "Need to go live now? Publish immediately or schedule for peak engagement times with full timezone support.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: HashIcon,
        title: "Hashtag Suggestions",
        description: "Get AI-powered hashtag suggestions to reach a wider audience.",
        color: "bg-indigo-50 text-indigo-600",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <div className="mb-6 inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">
                        <ZapIcon className="size-3" />
                        Everything you need
                    </div>
                    <h2 className="font-serif text-4xl sm:text-5xl font-medium leading-tight text-slate-900">
                        Automate your entire
                        <br />
                        <span className="text-indigo-600 italic">social media workflow</span>
                    </h2>
                    <p className="mt-5 text-slate-500 max-w-xl mx-auto leading-relaxed">From content creation to scheduling — Postflow handles it all so you can focus on what matters most.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div key={f.title} className="card-hover bg-white rounded-2xl border border-slate-100 p-6 group cursor-pointer">
                            <div className={`size-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${f.color}`}>
                                <f.icon className="size-5 transition-transform duration-300 group-hover:rotate-6" />
                            </div>
                            <h3 className="text-slate-900 font-medium mb-2 group-hover:text-indigo-600 transition-colors">{f.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
