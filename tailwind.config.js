// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    //  حذف ./pages چون App Router داری
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // اگر کد در src/ است، این را هم اضافه کن:
    // "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  safelist: [
    // اگر کلاس پویا داری، اینجا اضافه کن
    // { pattern: /bg-(gold|slate)-(50|100|500|600)/ },
  ],

  theme: {
    extend: {
      colors: {
        primary: "#3B2F2F",
        secondary: "#6E5B4C",
        accent: "#C6A14C",

        gold: {
          50: "#FBF7EC",
          100: "#F6EED5",
          200: "#EDDCA9",
          300: "#E0C67B",
          400: "#D3B263",
          500: "#C6A14C",
          600: "#A8853A",
          700: "#85672C",
          800: "#5F4A20",
          900: "#3D2F14",
        },

        background: {
          warm: "#F5F2ED",
          white: "#FFFFFF",
        },
        text: {
          dark: "#2A2725",
          muted: "#8E8276",
        },
        lines: "#E4DED6",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },

      fontFamily: {
        sans: ["Shabnam", "Vazirmatn", "system-ui", "sans-serif"],
      },

      //  فقط انیمیشن‌های استفاده‌شده
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },

      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        medium:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        large:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

        accent: "0 0 20px rgba(198, 161, 76, 0.3)",
        "accent-large": "0 0 40px rgba(198, 161, 76, 0.5)",
        "gold-sm": "0 2px 8px rgba(198, 161, 76, 0.15)",
        "gold-md": "0 4px 15px rgba(198, 161, 76, 0.25)",
        "gold-lg": "0 8px 30px rgba(198, 161, 76, 0.35)",
      },

      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #3B2F2F 0%, #6E5B4C 100%)",
        "gradient-accent":
          "linear-gradient(135deg, #D3B263 0%, #A8853A 100%)",
        "gradient-gold":
          "linear-gradient(135deg, #D3B263 0%, #C6A14C 50%, #A8853A 100%)",
        "gradient-gold-soft":
          "linear-gradient(135deg, #E0C67B 0%, #C6A14C 100%)",
        "gradient-light":
          "linear-gradient(135deg, #F5F2ED 0%, #FFFFFF 100%)",
        "gradient-success":
          "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "gradient-warning":
          "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "gradient-error":
          "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        "gradient-shimmer":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },

  plugins: [],

  future: {
    hoverOnlyWhenSupported: true,
  },
};