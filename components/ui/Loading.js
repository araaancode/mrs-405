import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'

//  بهینه‌سازی: حذف انیمیشن‌های سنگین CSS با استفاده از transform
const Loading = React.memo(() => {
    //  استفاده از useMemo برای جلوگیری از رندر مجدد غیرضروری
    const spinnerStyle = useMemo(() => ({
        animation: 'spin 0.8s linear infinite',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        border: '4px solid #D9A14B',
        borderTopColor: 'transparent',
        willChange: 'transform' //  hint به مرورگر برای بهینه‌سازی
    }), [])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">

                <div className="flex items-center justify-center mb-6">
                    {/*  استفاده از div ساده با CSS keyframe به جای className سنگین */}
                    <div style={spinnerStyle}></div>
                </div>

                <h3 className="text-3xl font-bold mb-3" style={{
                    background: 'linear-gradient(135deg, #D9A14B 0%, #B8922E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    مراسمینو
                </h3>

                <p className="text-[#8E8276] text-lg">
                    در حال بارگذاری بهترین فضاها برای مراسم شما...
                </p>

                {/*  اضافه کردن keyframe به صورت داینامیک فقط یک بار */}
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    )
})

//  اضافه کردن displayName برای debugging بهتر
Loading.displayName = 'Loading'

export default Loading