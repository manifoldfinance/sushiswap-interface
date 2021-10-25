module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "safari": "tp",
          "browsers": ">0.2%, not dead, not op_mini all, not IE > 0, not samsung 4"
        }

      }

      ,
      "next/babel",
      {
        "preset-env": {},
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {}
      }
    ]
  ],
  plugins: ['macros', ['styled-components', {
    ssr: true
  }]],
}