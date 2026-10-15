// components/landing/LandingAds.jsx
'use client'

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    PiArrowLeft,
    PiArrowRight,
    PiStarFill,
    PiMapPin,
    PiMegaphone,
    PiSparkleFill,
    PiSealCheckFill,
    PiTagFill,
} from 'react-icons/pi'

/* ============================================================
   Theme — مرکزی، فقط طلایی/کرم/قهوه‌ای
   ============================================================ */
const THEME = {
    bg: '#2A1F1F',
    bgSoft: '#3B2F2F',
    bgDeep: '#1F1717',

    gold: '#C6A14C',
    goldLight: '#E0C67B',
    goldDark: '#A8853A',
    goldDeep: '#85672C',

    cream: '#FBF7EC',
    creamSoft: '#F6EED5',
    creamBorder: '#EDDCA9',

    textDark: '#2A1F1F',
    textBody: '#3B2F2F',
    textMuted: '#8E8276',
}

const GOLD_GRADIENT = `linear-gradient(135deg, ${THEME.goldLight} 0%, ${THEME.gold} 50%, ${THEME.goldDark} 100%)`
const GOLD_GLOW = '0 8px 24px -6px rgba(198,161,76,0.45)'

const GAP = 20
const TRACK_URL = (id) => `/api/ads/${id}/track`

/* ============================================================
   Helpers
   ============================================================ */
const faNum = (n) => Number(n || 0).toLocaleString('fa-IR')

function formatPrice(n) {
    if (n === null || n === undefined || Number.isNaN(Number(n))) return '-'
    return Number(n).toLocaleString('fa-IR')
}

/* ============================================================
   useItemsPerView — با 4 breakpoint
   ============================================================ */
function useItemsPerView() {
    const getValue = () => {
        if (typeof window === 'undefined') return 3
        if (window.matchMedia('(min-width: 1536px)').matches) return 4
        if (window.matchMedia('(min-width: 1280px)').matches) return 3
        if (window.matchMedia('(min-width: 768px)').matches) return 2
        return 1
    }

    const [value, setValue] = useState(getValue)

    useEffect(() => {
        const queries = [
            window.matchMedia('(min-width: 1536px)'),
            window.matchMedia('(min-width: 1280px)'),
            window.matchMedia('(min-width: 768px)'),
        ]
        const update = () => setValue(getValue())
        queries.forEach((mq) => mq.addEventListener('change', update))
        return () =>
            queries.forEach((mq) => mq.removeEventListener('change', update))
    }, [])

    return value
}

/* ============================================================
   Tracking helper — با sendBeacon fallback
   ============================================================ */
function trackEvent(adId, type) {
    if (!adId) return
    const url = TRACK_URL(adId)
    const payload = JSON.stringify({ type })

    // اولویت با sendBeacon (پایدارتر در unload)
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        try {
            const blob = new Blob([payload], { type: 'application/json' })
            const ok = navigator.sendBeacon(url, blob)
            if (ok) return
        } catch {
            /* fallthrough */
        }
    }

    // fallback به fetch
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
    }).catch(() => {})
}

/* ============================================================
   LandingAds
   ============================================================ */
export default function LandingAds() {
    const [ads, setAds] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0)
    const itemsPerView = useItemsPerView()
    const scrollerRef = useRef(null)

    /* ---------- Fetch ---------- */
    useEffect(() => {
        const controller = new AbortController()
        ;(async () => {
            try {
                const res = await fetch('/api/ads?placement=home&limit=30', {
                    headers: { Accept: 'application/json' },
                    cache: 'no-store',
                    signal: controller.signal,
                })
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                if (data?.success && Array.isArray(data.ads)) setAds(data.ads)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('[LandingAds] fetch error:', err)
                }
            } finally {
                setLoading(false)
            }
        })()
        return () => controller.abort()
    }, [])

    const maxIndex = Math.max(0, ads.length - itemsPerView)

    /* ---------- Nav — با setState callback برای جلوگیری از stale ---------- */
    const goTo = useCallback(
        (idx) => {
            setCurrentIndex((prev) => {
                const nextIdx = typeof idx === 'function' ? idx(prev) : idx
                return Math.max(0, Math.min(nextIdx, maxIndex))
            })
        },
        [maxIndex]
    )

    const next = useCallback(() => goTo((i) => i + 1), [goTo])
    const prev = useCallback(() => goTo((i) => i - 1), [goTo])

    /* Reset index وقتی itemsPerView تغییر می‌کند */
    useEffect(() => {
        setCurrentIndex((prev) => Math.min(prev, maxIndex))
    }, [maxIndex])

    /* ---------- Keyboard nav ---------- */
    const onKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault()
                next()
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault()
                prev()
            } else if (e.key === 'Home') {
                e.preventDefault()
                goTo(0)
            } else if (e.key === 'End') {
                e.preventDefault()
                goTo(maxIndex)
            }
        },
        [next, prev, goTo, maxIndex]
    )

    /* ---------- Scroll to active index ---------- */
    useEffect(() => {
        const scroller = scrollerRef.current
        if (!scroller) return
        const card = scroller.querySelector(`[data-idx="${currentIndex}"]`)
        if (!card) return

        const targetLeft = card.offsetLeft - scroller.offsetLeft
        scroller.scrollTo({ left: targetLeft, behavior: 'smooth' })
    }, [currentIndex])

    /* ---------- Sync index on user scroll — با RAF ---------- */
    useEffect(() => {
        const scroller = scrollerRef.current
        if (!scroller) return

        let rafId = null
        let timeoutId = null

        const computeIndex = () => {
            const cards = scroller.querySelectorAll('[data-idx]')
            if (!cards.length) return

            const center = scroller.scrollLeft
            let best = 0
            let bestDist = Infinity

            cards.forEach((el) => {
                const d = Math.abs(el.offsetLeft - scroller.offsetLeft - center)
                if (d < bestDist) {
                    bestDist = d
                    best = Number(el.dataset.idx)
                }
            })

            setCurrentIndex(Math.min(best, maxIndex))
        }

        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(() => {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(computeIndex, 100)
            })
        }

        scroller.addEventListener('scroll', onScroll, { passive: true })
        return () => {
            scroller.removeEventListener('scroll', onScroll)
            if (rafId) cancelAnimationFrame(rafId)
            clearTimeout(timeoutId)
        }
    }, [maxIndex])

    /* ---------- View tracking با IntersectionObserver ---------- */
    useEffect(() => {
        const scroller = scrollerRef.current
        if (!scroller || !ads.length) return

        const seen = new Set()
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        const id = entry.target.dataset.adId
                        if (id && !seen.has(id)) {
                            seen.add(id)
                            trackEvent(id, 'view')
                        }
                    }
                })
            },
            { root: scroller, threshold: [0.6] }
        )

        scroller.querySelectorAll('[data-ad-id]').forEach((el) => io.observe(el))
        return () => io.disconnect()
    }, [ads, itemsPerView])

    const handleClick = useCallback((adId) => {
        trackEvent(adId, 'click')
    }, [])

    const dots = useMemo(
        () => Array.from({ length: maxIndex + 1 }, (_, i) => i),
        [maxIndex]
    )

    /* ---------- CSS variable برای عرض کارت ---------- */
    const cardBasis = `calc((100% - ${(itemsPerView - 1) * GAP}px) / ${itemsPerView})`

    /* ---------- Loading skeleton ---------- */
    if (loading) {
        return (
            <section
                className="w-full py-10 sm:py-14"
                style={{ backgroundColor: THEME.bg }}
                aria-busy="true"
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-52 rounded-lg mb-6 bg-white/10 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-[210px] rounded-2xl bg-white/5 animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!ads.length) return null

    return (
        <section
            className="relative w-full py-10 sm:py-14 overflow-hidden"
            style={{ backgroundColor: THEME.bg }}
            aria-labelledby="landing-ads-title"
        >
            {/* پس‌زمینه glow طلایی */}
            <div
                className="pointer-events-none absolute inset-0 opacity-50"
                aria-hidden="true"
            >
                <div
                    className="absolute -top-24 right-0 w-96 h-96 rounded-full blur-3xl"
                    style={{ backgroundColor: 'rgba(198,161,76,0.15)' }}
                />
                <div
                    className="absolute -bottom-24 left-0 w-96 h-96 rounded-full blur-3xl"
                    style={{ backgroundColor: 'rgba(198,161,76,0.10)' }}
                />
            </div>

            {/* ==================== هدر ==================== */}
            <header className="relative flex items-start justify-between gap-4 mb-8 px-4 sm:px-6 lg:px-8 flex-wrap">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="relative shrink-0">
                        <div
                            className="absolute inset-0 rounded-2xl blur-md"
                            style={{ backgroundColor: 'rgba(198,161,76,0.4)' }}
                            aria-hidden="true"
                        />
                        <div
                            className="relative w-12 h-12 rounded-2xl flex items-center justify-center ring-1"
                            style={{
                                backgroundImage: GOLD_GRADIENT,
                                boxShadow: GOLD_GLOW,
                                borderColor: THEME.goldLight,
                            }}
                        >
                            <PiMegaphone
                                className="w-6 h-6 text-white"
                                aria-hidden="true"
                            />
                        </div>
                    </div>

                    <div className="min-w-0">
                        <div
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide mb-1.5"
                            style={{
                                backgroundColor: 'rgba(198,161,76,0.10)',
                                border: `1px solid rgba(198,161,76,0.30)`,
                                color: THEME.goldLight,
                            }}
                        >
                            <PiSparkleFill className="w-2.5 h-2.5" aria-hidden="true" />
                            پیشنهاد تبلیغاتی
                        </div>

                        <h2
                            id="landing-ads-title"
                            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight"
                        >
                            کمپین‌های ویژه
                        </h2>

                        <p className="text-xs sm:text-sm mt-1 text-white/60">
                            فرصت‌های محدود با تخفیف‌های استثنایی
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <NavButton
                        onClick={next}
                        disabled={currentIndex >= maxIndex}
                        aria-label="اسلاید بعدی"
                        direction="next"
                    />
                    <NavButton
                        onClick={prev}
                        disabled={currentIndex === 0}
                        aria-label="اسلاید قبلی"
                        direction="prev"
                    />

                    <Link
                        href="/halls"
                        prefetch={false}
                        className="
                            hidden sm:inline-flex items-center gap-2
                            h-10 px-5 rounded-xl
                            text-[#2A1F1F] text-xs font-extrabold
                            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E0C67B]/40
                            transition-all duration-300
                            hover:shadow-xl hover:-translate-y-0.5
                        "
                        style={{
                            backgroundImage: GOLD_GRADIENT,
                            boxShadow: GOLD_GLOW,
                        }}
                    >
                        همه پیشنهادها
                        <PiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                </div>
            </header>

            {/* ==================== اسلایدر ==================== */}
            <div
                ref={scrollerRef}
                role="region"
                aria-roledescription="carousel"
                aria-label="کمپین‌های ویژه"
                tabIndex={0}
                onKeyDown={onKeyDown}
                className="
                    flex overflow-x-auto snap-x snap-mandatory scroll-smooth
                    scrollbar-hide
                    px-4 sm:px-6 lg:px-8 pb-2
                    focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-[#E0C67B]/40
                    rounded-2xl
                    mx-4 sm:mx-6 lg:mx-8
                "
                style={{
                    gap: `${GAP}px`,
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {ads.map((ad, idx) => (
                    <AdCardH
                        key={ad._id || `ad-${idx}`}
                        ad={ad}
                        index={idx}
                        cardBasis={cardBasis}
                        onClick={() => handleClick(ad._id)}
                        isActive={idx === currentIndex}
                    />
                ))}
            </div>

            {/* ==================== صفحه‌بندی ==================== */}
            {ads.length > itemsPerView && (
                <nav
                    aria-label="صفحه‌بندی اسلایدر"
                    className="flex items-center justify-center gap-2 mt-8 flex-wrap px-4"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {dots.map((i) => {
                        const active = i === currentIndex
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`رفتن به اسلاید ${faNum(i + 1)}`}
                                aria-current={active ? 'true' : 'false'}
                                className={`
                                    h-1.5 rounded-full transition-all duration-300
                                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0C67B]/60
                                    ${
                                        active
                                            ? 'w-8'
                                            : 'w-2 bg-white/20 hover:bg-white/40'
                                    }
                                `}
                                style={
                                    active
                                        ? {
                                              backgroundImage: GOLD_GRADIENT,
                                              boxShadow:
                                                  '0 0 20px rgba(198,161,76,0.3)',
                                          }
                                        : undefined
                                }
                            />
                        )
                    })}
                </nav>
            )}
        </section>
    )
}

/* ============================================================
   AdCardH — کارت افقی
   ============================================================ */
function AdCardH({ ad, onClick, cardBasis, index = 0 }) {
    const image =
        ad?.images?.[0] || ad?.hall_id?.images?.[0] || '/placeholder.jpg'

    const rating = Number(ad?.rating ?? 4.5)
    const reviews = Number(ad?.reviews_count ?? 0)
    const finalPrice = Number(ad?.price ?? 0)
    const originalPrice = Number(ad?.original_price ?? finalPrice)
    const city = ad?.hall_id?.city || ad?.city || ''
    const province = ad?.hall_id?.province || ad?.province || ''
    const sponsorName = ad?.sponsor || ad?.hall_id?.title || ''

    const discount =
        originalPrice > finalPrice && originalPrice > 0
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : 0

    const location = [province, city].filter(Boolean).join('، ')

    const isExternal = ad?.target_url && /^https?:\/\//.test(ad.target_url)

    return (
        <Link
            href={ad.target_url || '#'}
            onClick={onClick}
            data-idx={index}
            data-ad-id={ad._id}
            aria-label={`مشاهده ${ad.title || 'تبلیغ'}`}
            {...(isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer sponsored',
            })}
            className="
                group relative flex flex-row
                h-[200px] sm:h-[210px]
                bg-white rounded-2xl overflow-hidden
                ring-1 ring-[#EDDCA9] hover:ring-[#D3B263]
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E0C67B]/50
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]
                snap-start shrink-0
                motion-reduce:transition-none motion-reduce:hover:translate-y-0
            "
            style={{
                flex: `0 0 ${cardBasis}`,
                scrollSnapAlign: 'start',
            }}
        >
            {/* ==================== تصویر ==================== */}
            <div className="relative shrink-0 w-[42%] sm:w-[40%] bg-[#FBF7EC] overflow-hidden">
                <Image
                    src={image}
                    alt={ad.title || 'تبلیغ'}
                    fill
                    sizes="(max-width: 768px) 45vw, 25vw"
                    priority={index < 3}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="
                        object-cover
                        transition-transform duration-700 ease-out
                        group-hover:scale-110
                        motion-reduce:transition-none motion-reduce:group-hover:scale-100
                    "
                />

                <div
                    className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-transparent"
                    aria-hidden="true"
                />

                {/* بج تخفیف — طلایی */}
                {discount > 0 && (
                    <div
                        className="
                            absolute top-3 left-3
                            flex flex-col items-center justify-center
                            w-12 h-12 rounded-full
                            text-white shadow-lg ring-4 ring-white/90
                            group-hover:scale-110 transition-transform duration-300
                            motion-reduce:transition-none
                        "
                        style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                        <span className="text-sm font-extrabold leading-none">
                            {faNum(discount)}٪
                        </span>
                        <span className="text-[8px] font-bold mt-0.5">تخفیف</span>
                    </div>
                )}

                {/* امتیاز */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white">
                    <PiStarFill
                        className="w-3 h-3 text-[#E0C67B]"
                        aria-hidden="true"
                    />
                    <span className="font-bold">{rating.toFixed(1)}</span>
                    <span className="text-white/60">({faNum(reviews)})</span>
                </div>
            </div>

            {/* ==================== محتوا ==================== */}
            <div className="flex flex-col flex-1 p-4 bg-white min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                    {sponsorName ? (
                        <span className="
                            inline-flex items-center gap-1
                            px-2 py-0.5 rounded-md
                            bg-[#FBF7EC] border border-[#EDDCA9]
                            text-[#85672C] text-[10px] font-bold
                            max-w-[55%]
                        ">
                            <PiSealCheckFill
                                className="w-3 h-3 shrink-0"
                                aria-hidden="true"
                            />
                            <span className="line-clamp-1">{sponsorName}</span>
                        </span>
                    ) : (
                        <span aria-hidden="true" />
                    )}

                    {location && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium shrink-0">
                            <PiMapPin
                                className="w-3 h-3 text-[#C6A14C]"
                                aria-hidden="true"
                            />
                            {location}
                        </span>
                    )}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-[#3B2F2F] line-clamp-2 leading-snug group-hover:text-[#85672C] transition-colors">
                    {ad.title}
                </h3>

                {ad.description && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-1.5">
                        {ad.description}
                    </p>
                )}

                <div className="border-t border-dashed border-[#EDDCA9] mt-auto pt-2.5" />

                <div className="flex items-center justify-between gap-3 mt-2">
                    <div className="flex flex-col min-w-0">
                        {originalPrice > finalPrice && originalPrice > 0 && (
                            <span className="text-[10px] text-gray-400 line-through leading-none tabular-nums">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-base sm:text-lg font-extrabold text-[#85672C] leading-none tabular-nums">
                                {formatPrice(finalPrice)}
                            </span>
                            <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
                                تومان / شب
                            </span>
                        </div>
                    </div>

                    <span
                        className="
                            inline-flex items-center gap-1.5
                            h-9 px-3 rounded-lg
                            text-[#2A1F1F] text-xs font-extrabold
                            shrink-0
                            transition-all duration-300
                            group-hover:shadow-lg
                        "
                        style={{ backgroundImage: GOLD_GRADIENT }}
                    >
                        {ad.cta_text || 'رزرو کن'}
                        <PiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                </div>
            </div>
        </Link>
    )
}

/* ============================================================
   NavButton
   ============================================================ */
function NavButton({ onClick, disabled, direction, children, ...rest }) {
    const Icon = direction === 'next' ? PiArrowRight : PiArrowLeft
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled}
            {...rest}
            className={`
                w-10 h-10 rounded-xl
                flex items-center justify-center
                border transition-all duration-200
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E0C67B]/40
                ${
                    disabled
                        ? 'border-white/10 text-white/20 bg-white/5 cursor-not-allowed'
                        : 'border-[#C6A14C]/60 text-[#E0C67B] bg-white/5 hover:bg-[#C6A14C] hover:text-[#2A1F1F] hover:border-transparent active:scale-95 cursor-pointer'
                }
            `}
        >
            {children || <Icon className="w-4 h-4" aria-hidden="true" />}
        </button>
    )
}