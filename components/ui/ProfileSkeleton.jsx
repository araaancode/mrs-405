export function ProfileSkeleton() {
    return (
        <div className="max-w-3xl mx-auto w-full">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="h-11 w-full bg-slate-100 rounded-xl animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}