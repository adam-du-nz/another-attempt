/* config-overrides.js */
const TreatPlugin = require('treat/webpack-plugin');
    
module.exports = function override(config, env) {
  config.plugins = [
    new TreatPlugin()
  ].concat(config.plugins);

  return config;
}
