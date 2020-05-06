const lessToJson = require("less-to-json")

module.exports = {
  /* Your site config here */
  plugins: [
    {
      resolve: "gatsby-plugin-antd",
      options: {
        style: true,
      },
    },
    {
      resolve: "gatsby-plugin-less",
      options: {
        javascriptEnabled: true,
        modifyVars: lessToJson("src/theme/theme.less"),
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Cormorant Garamond`],
        display: "swap",
      },
    },
  ],
}
