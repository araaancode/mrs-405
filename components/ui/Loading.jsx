// components/ui/Loading.jsx
export default function Loading({ message = "در حال بارگذاری بهترین فضاها برای مراسم شما..." }) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                    <div
                        className="w-20 h-20 rounded-full border-4 border-gold-500 border-t-transparent animate-spin"
                        aria-label="در حال بارگذاری"
                        role="status"
                    />
                </div>

                <h3
                    className="text-3xl font-bold mb-3 bg-gradient-to-br from-gold-500 to-gold-700 bg-clip-text text-transparent"
                    aria-hidden="true"
                >
                    مراسمینو
                </h3>

                <p className="text-[#8E8276] text-lg px-4">{message}</p>
            </div>
        </div>
    );
}