module.exports = {
  siteMetadata: {
    title: "spotify-mixer",
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
        icon: "https://love2dev.com/img/2000px-instagram_logo_2016svg-2000x2000.png",
      },
      __key: "images",
    },
  ],
};
