'use client'

import { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react'
import dynamic from 'next/dynamic'
import axios from 'axios'

//  استفاده از lazy به جای dynamic برای کامپوننت‌های سنگین
const Header = lazy(() => import('@/components/ui/Header'))
const Footer = lazy(() => import('@/components/ui/Footer'))
const Loading = lazy(() => import('@/components/ui/Loading'))

//  بهینه‌سازی dynamic imports با preload
const HeroSlider = dynamic(() => import('@/components/landing/HeroSlider'), {
  loading: () => <div className="w-full h-[500px] bg-gray-100 animate-pulse rounded-2xl" />,
  ssr: false
})

const AdvancedSearch = dynamic(() => import('@/components/landing/AdvancedSearch'), {
  loading: () => (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg min-h-[400px] animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
      </div>
    </div>
  ),
})

const PopularCities = dynamic(() => import('@/components/landing/PopularCities'), {
  loading: () => (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-24 sm:h-28 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
})

const PopularHalls = dynamic(() => import('@/components/landing/PopularHalls'), {
  loading: () => (
    <div className="w-full py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  ),
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [halls, setHalls] = useState([])
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log(' 1. شروع درخواست به API...')

        const response = await axios.get("/api/halls", {
          signal: abortController.signal,
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        })

        console.log(' 2. پاسخ دریافت شد:', response)
        console.log(' 3. response.data:', response.data)

        // استخراج صحیح داده‌ها از پاسخ API
        let hallsData = []
        const result = response.data

        // بررسی ساختارهای مختلف پاسخ API
        if (Array.isArray(result)) {
          console.log(' result یک آرایه است')
          hallsData = result
        } else if (result?.data && Array.isArray(result.data)) {
          console.log(' result.data یک آرایه است')
          hallsData = result.data
        } else if (result?.halls && Array.isArray(result.halls)) {
          console.log(' result.halls یک آرایه است')
          hallsData = result.halls
        } else if (result?.results && Array.isArray(result.results)) {
          console.log(' result.results یک آرایه است')
          hallsData = result.results
        } else if (result?.success && result?.data && Array.isArray(result.data)) {
          console.log(' result.data با success یک آرایه است')
          hallsData = result.data
        } else if (result?.items && Array.isArray(result.items)) {
          console.log(' result.items یک آرایه است')
          hallsData = result.items
        } else {
          console.warn('⚠️ ساختار پاسخ غیرمنتظره است:', result)
          if (typeof result === 'object' && result !== null) {
            const possibleArray = Object.values(result).filter(item =>
              typeof item === 'object' && item !== null
            )
            if (possibleArray.length > 0 && possibleArray.some(item => item._id || item.id)) {
              console.log(' داده‌ها از Object.values استخراج شدند')
              hallsData = possibleArray
            }
          }
        }

        console.log(' 7. داده‌های استخراج شده:', hallsData)
        console.log(' 8. تعداد داده‌ها:', hallsData.length)
        console.log(' 9. اولین آیتم:', hallsData[0])

        // ✅ حذف کامل فیلتر - همه داده‌ها را مستقیماً نمایش بده
        // هیچ فیلتری اعمال نمی‌کنیم
        const finalHalls = hallsData

        console.log(' 10. سالن‌های نهایی:', finalHalls)
        console.log(' 11. تعداد سالن‌های نهایی:', finalHalls.length)

        setHalls(finalHalls)
        setIsLoading(false)

      } catch (err) {
        console.error('🔴 خطا در fetchData:', err)

        if (axios.isCancel(err)) {
          console.log('⏹️ درخواست لغو شد')
        } else if (err.code === 'ECONNABORTED') {
          console.error('⏱️ تایم‌اوت')
          setError('مدت زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.')
        } else if (err.response) {
          console.error('❌ خطای سرور:', err.response.status, err.response.data)
          setError(err.response?.data?.message || `خطای سرور: ${err.response.status}`)
        } else if (err.request) {
          console.error('❌ پاسخی دریافت نشد:', err.request)
          setError('سرور پاسخ نمی‌دهد. لطفاً دوباره تلاش کنید.')
        } else {
          console.error('❌ خطا:', err.message)
          setError(err.message || 'خطا در بارگذاری داده‌ها')
        }

        setHalls([])
        setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [])

  const handleSearch = useCallback((searchData) => {
    console.log('🔍 جستجو:', searchData)
  }, [])

  const content = useMemo(() => {
    console.log('🟣 رندرینگ Home - isLoading:', isLoading, 'halls.length:', halls.length, 'error:', error)

    if (!isMounted || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4B06A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">خطا در بارگذاری</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#D4B06A] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#B8922E] transition-all duration-200"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen">
        <Suspense fallback={
          <div className="h-20 bg-white shadow-sm animate-pulse">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              <div className="w-32 h-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        }>
          <Header />
        </Suspense>

        <Suspense fallback={
          <div className="w-full max-w-7xl mx-auto px-4 pt-6">
            <div className="w-full h-[400px] sm:h-[450px] md:h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl animate-pulse" />
          </div>
        }>
          <HeroSlider />
        </Suspense>

        <Suspense fallback={
          <div className="w-full max-w-6xl mx-auto px-4 py-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[300px] animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-12 bg-gray-200 rounded-xl" />
                <div className="h-12 bg-gray-200 rounded-xl" />
                <div className="h-12 bg-gray-200 rounded-xl" />
              </div>
              <div className="mt-4 h-12 w-32 bg-gray-200 rounded-xl mx-auto" />
            </div>
          </div>
        }>
          <AdvancedSearch onSearch={handleSearch} />
        </Suspense>

        <Suspense fallback={
          <div className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-24 sm:h-28 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <PopularCities />
        </Suspense>

        <Suspense fallback={
          <div className="w-full py-12">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <PopularHalls halls={halls} />
        </Suspense>

        <Suspense fallback={
          <div className="h-48 bg-gray-800 animate-pulse">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
              <div className="w-32 h-8 bg-gray-700 rounded-lg" />
            </div>
          </div>
        }>
        </Suspense>
      </div>
    )
  }, [isMounted, isLoading, halls, handleSearch, error])

  return content
}