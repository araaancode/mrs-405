// app/halls/loading.jsx
export default function HallsLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* هدر */}
            <div className="text-center mb-10">
                <div className="h-8 w-48 bg-slate-100 rounded-lg mx-auto mb-3 animate-pulse" />
                <div className="w-20 h-1 bg-slate-100 rounded-full mx-auto" />
            </div>

            {/* گرید */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl ring-1 ring-slate-100 overflow-hidden"
                    >
                        <div className="h-44 bg-slate-100 animate-pulse" />
                        <div className="p-4 space-y-3">
                            <div className="h-5 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
                            <div className="h-3.5 w-1/2 bg-slate-100 rounded-md animate-pulse" />
                            <div className="flex gap-2 pt-2">
                                <div className="h-6 w-20 bg-slate-100 rounded-lg animate-pulse" />
                                <div className="h-6 w-16 bg-slate-100 rounded-lg animate-pulse" />
                            </div>
                            <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse mt-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}