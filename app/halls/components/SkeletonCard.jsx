// app/halls/components/SkeletonCard.jsx
export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
            <div className="h-52 bg-gray-200" />
            <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="flex justify-between pt-3 border-t border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/4" />
                </div>
            </div>
        </div>
    );
}