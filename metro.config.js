const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  config.resolver.sourceExts.push('cjs'); // Adiciona suporte para arquivos .cjs
  return config;
})();
