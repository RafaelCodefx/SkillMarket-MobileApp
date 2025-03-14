module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'react-native-reanimated/plugin', // Necessário para React Navigation e animações
        '@babel/plugin-proposal-export-namespace-from',
        'module:react-native-dotenv' // Caso utilize variáveis de ambiente
      ],
    };
  };
  