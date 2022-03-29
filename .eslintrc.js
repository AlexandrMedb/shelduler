module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    'camelcase': 'off',
    'require-jsdoc': 0,
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn'],
    'linebreak-style': 0,
    'max-len': [2, 100, 4, {'ignoreUrls': true}],
    'react/prop-types': 0,
  },
};
