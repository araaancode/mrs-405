// postcss.config.js
module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
    //  فشرده‌سازی CSS فقط در production
    ...(process.env.NODE_ENV === "production"
      ? {
          cssnano: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                normalizeWhitespace: true,
                minifySelectors: true,
              },
            ],
          },
        }
      : {}),
  },
};