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
        'slate': {
          'default': v['slate-600'],
          '50': v['slate-50'],
          '100': v['slate-100'],
          '200': v['slate-200'],
          '300': v['slate-300'],
          '400': v['slate-400'],
          '500': v['slate-500'],
          '600': v['slate-600'],
          '700': v['slate-700'],
          '800': v['slate-800'],
          '900': v['slate-900']
        },
        'amber': {
          '500': v['amber-500'],
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
