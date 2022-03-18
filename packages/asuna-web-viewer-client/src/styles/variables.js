const variables = {
  'dark-900': '#0f0f15',
  'dark-800': '#12121d',
  'dark-700': '#1b1e2c',
  'dark-600': '#1d2131',

  'sm': '480px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  'xxl': '1900px'
}
const spacing_initial = 1.1

for (let i = -10.0; i <= 20.0; i += .5) {
  variables['s' + (100 + i * 10)] = (spacing_initial * Math.pow(10, i / 10)).toFixed(2) + 'rem'
}
variables['s0'] = 0

module.exports = variables
