const variables = {
  'dark-500': '#4d398e',
  'dark-800': '#3f2a7e',
  'dark-900': '#272162',

  'light': '#f2f1ed',

  'sm': '480px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  'xxl': '1900px'
}
const spacing_initial = 1.1

for (let i = -10.0; i <= 30.0; i += .5) {
  variables['s' + (100 + i * 10)] = (spacing_initial * Math.pow(10, i / 10)).toFixed(2) + 'rem'
}
variables['s0'] = 0

module.exports = variables
