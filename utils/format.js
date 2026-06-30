export function formatPrice(price) {
    return new Intl.NumberFormat('fa-IR').format(price)
}

export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
}
