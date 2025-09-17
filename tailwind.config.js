export default {
  corePlugins: {
    preflight: false,
  },
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // <- this must point to where your Vue files live
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
