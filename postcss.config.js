config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
};

if (process.env.NODE_ENV === 'production') {
  config = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      cssnano: {},
    },
  }
}


module.exports = config;
