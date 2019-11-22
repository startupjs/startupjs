module.exports = {
  extends: [
    'standard',
    'standard-react',
    'plugin:react-pug/all'
  ],
  plugins: [
    'react',
    'react-pug'
  ],
  rules: {
    'react/jsx-handler-names': 'off',
    'react/prop-types': 'off',
    'react-pug/empty-lines': 'off',
    'react-pug/no-interpolation': 'off',
    'react-pug/prop-types': 'off',
    'react-pug/quotes': 'off'
  }
}
