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
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyAbxeNKPLZK9GgUI8X3aQcuchDSSB4KnQY",
          authDomain: "sdj-website.firebaseapp.com",
          databaseURL: "https://sdj-website.firebaseio.com",
          projectId: "sdj-website",
          storageBucket: "sdj-website.appspot.com",
          messagingSenderId: "845335768104",
          appId: "1:845335768104:web:03f5ab58e68319e2a6191d",
          measurementId: "G-Y0HD63KJ5L",
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
      },
    },
  ],
}
