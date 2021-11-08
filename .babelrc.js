module.exports = {
  presets: ['next/babel'],
  plugins: ['macros', ['styled-components', {
      //  pure: true,
      //   preprocess: false,
      ssr: true
    }],
    ['babel-plugin-transform-imports', {
        'lodash': {
          'transform': 'lodash/${member}',
          'preventFullImport': true
        }
      }
    ]
  ]
}
