const variables = {
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',

  'amber-500': '#f59e0b',

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
