// module.exports = {
//   plugins: [
//     require('postcss-import'),
//     require('postcss-mixins'),
//     require('postcss-nested'),
//     require('postcss-simple-vars'),
//     require('postcss-functions'),
//   ],
// };

const toRem = (value) => {
  // return `${(value/16)}rem`;
  return value / 16;
};

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-nested': {},
    'postcss-simple-vars': {},
    'postcss-functions': { functions: { toRem: toRem } },
  },
};
