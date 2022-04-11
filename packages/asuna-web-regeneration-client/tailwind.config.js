const path = require('path')
const v = require('./src/styles/variables.js')

let config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'sm': v.sm,
      'md': v.md,
      'lg': v.lg,
      'xl': v.xl,
    },
    extend: {
      spacing: {},
      colors: {
        'dark': {
          'default': v['dark-600'],
          '600': v['dark-600'],
          '700': v['dark-700'],
          '800': v['dark-800'],
          '900': v['dark-900']
        },
        'light': {
          '50': v['light']
        }
      },
      opacity: {
        '0': '0',
        '25': '.25',
        '50': '.5',
        '75': '.75',
        '10': '.1',
        '20': '.2',
        '30': '.3',
        '40': '.4',
        '50': '.5',
        '60': '.6',
        '70': '.7',
        '80': '.8',
        '90': '.9',
        '100': '1',
      }
    }
  },
  plugins: [],
}

for (let i = -10; i <= 20; i += .5) {
  config.theme.extend.spacing['' + (100 + i * 10)] = v['s' + (100 + i * 10)]
}

module.exports = config
