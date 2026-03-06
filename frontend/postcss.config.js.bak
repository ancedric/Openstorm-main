export default {
  plugins: {
    'postcss-prefix-selector': {
      prefix: '.openstorm-scope',
      exclude: ['.openstorm-scope'], // Évite de préfixer si c'est déjà fait
      transform(prefix, selector, preficedSelector) {
        // On ne préfixe pas le body ou l'html directement, on les transforme
        if (selector === 'body' || selector === 'html') {
          return prefix;
        }
        return preficedSelector;
      }
    },
    autoprefixer: {},
  }
}