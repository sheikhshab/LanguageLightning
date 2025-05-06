import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        cornflower_blue: { DEFAULT: '#6694DA', 100: '#0d1c34', 200: '#193867', 300: '#26559b', 400: '#3371ce', 500: '#6694da', 600: '#85aae2', 700: '#a4bfe9', 800: '#c2d5f0', 900: '#e1eaf8' },
        "rich-black": { DEFAULT: '#0C1220', 100: '#030407', 200: '#05080d', 300: '#080b14', 400: '#0a0f1b', 500: '#0c1220', 600: '#263965', 700: '#405fa8', 800: '#7891cc', 900: '#bcc8e5' },
        oxford_blue: { DEFAULT: '#10192A', 100: '#030508', 200: '#060a10', 300: '#090f18', 400: '#0c1321', 500: '#10192a', 600: '#28406a', 700: '#4167ac', 800: '#7b98cd', 900: '#bdcbe6' },
        "rich-black-2": { DEFAULT: '#0D1023', 100: '#020307', 200: '#05060d', 300: '#070914', 400: '#0a0c1b', 500: '#0d1023', 600: '#252e65', 700: '#3f4da9', 800: '#7783cd', 900: '#bbc1e6' },
        yale_blue: { DEFAULT: '#253F64', 100: '#070d14', 200: '#0f1928', 300: '#16263c', 400: '#1e3350', 500: '#253f64', 600: '#39629b', 700: '#5c87c3', 800: '#92afd7', 900: '#c9d7eb' }


























        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
