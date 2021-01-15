module.exports = {
  siteMetadata: {
    title: "spotify-mixer",
    description:
      "A web app for connecting with friends using audio as a social layer. Constructs Spotify playlists for groups by automatically detecting and adding each contributor's favorite tracks. Filter through a multitude of settings to create your perfect group playlist. Also visualizes your personal listening patterns.",
    url: "https://priceless-booth-9bcd80.netlify.app/", // No trailing slash allowed!
    image: "/og.png", // Path to your image you placed in the 'static' folder
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
