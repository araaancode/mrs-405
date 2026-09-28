export function SectionTitle({ icon, title, description, badge }) {
    return (
        <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-50 to-gold-100 text-gold-600 flex items-center justify-center flex-shrink-0 ring-1 ring-gold-200/60 shadow-sm">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[15px] sm:text-base font-semibold text-slate-900">
                        {title}
                    </h3>
                    {badge && (
                        <span className="text-[10px] font-medium bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {badge}
                        </span>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}