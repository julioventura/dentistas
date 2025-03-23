const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  plugins: [
    new Dotenv({
      systemvars: true,
      path: path.resolve(__dirname, '.env')
    })
  ]
};