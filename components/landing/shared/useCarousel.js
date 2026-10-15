// components/landing/shared/useCarousel.js
'use client'

import { useRef, useState, useEffect, useCallback } from 'react'

export function useCarousel({ itemsCount = 0, gap = 16 } = {}) {
    const scrollRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const getCardStep = useCallback(() => {
        const el = scrollRef.current
        if (!el) return 280
        const firstCard = el.querySelector('[data-card]')
        if (!firstCard) return 280
        const cardWidth = firstCard.getBoundingClientRect().width
        return cardWidth + gap
    }, [gap])

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current
        if (!el) return
        const { scrollLeft, scrollWidth, clientWidth } = el
        const maxScroll = scrollWidth - clientWidth
        const normalizedLeft = Math.abs(scrollLeft)

        setCanScrollLeft(normalizedLeft > 4)
        setCanScrollRight(normalizedLeft < maxScroll - 4)

        const step = getCardStep()
        const idx = Math.round(normalizedLeft / step)
        setActiveIndex(Math.max(0, Math.min(idx, itemsCount)))
    }, [getCardStep, itemsCount])

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return
        updateScrollState()
        let rafId = null
        const onScroll = () => {
            if (rafId) cancelAnimationFrame(rafId)
            rafId = requestAnimationFrame(updateScrollState)
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', updateScrollState)
        return () => {
            el.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', updateScrollState)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [updateScrollState])

    const scrollByDirection = useCallback(
        (dir) => {
            const el = scrollRef.current
            if (!el) return
            const step = getCardStep()
            const sign = dir === 'next' ? -1 : 1
            el.scrollBy({ left: sign * step, behavior: 'smooth' })
        },
        [getCardStep]
    )

    const scrollToIndex = useCallback(
        (i) => {
            const el = scrollRef.current
            if (!el) return
            const step = getCardStep()
            el.scrollTo({ left: -i * step, behavior: 'smooth' })
        },
        [getCardStep]
    )

    const onKeyDown = useCallback(
        (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault()
                scrollByDirection('next')
            } else if (e.key === 'ArrowRight') {
                e.preventDefault()
                scrollByDirection('prev')
            }
        },
        [scrollByDirection]
    )

    return {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        activeIndex,
        scrollByDirection,
        scrollToIndex,
        onKeyDown,
    }
}