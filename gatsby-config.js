require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

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
    "gatsby-plugin-netlify",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
        icon: "https://love2dev.com/img/2000px-instagram_logo_2016svg-2000x2000.png",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: process.env.GATSBY_API_KEY,
          authDomain: process.env.GATSBY_AUTH_DOMAIN,
          projectId: process.env.GATSBY_PROJECT_ID,
          storageBucket: process.env.GATSBY_STORAGE_BUCKET,
          messagingSenderId: process.env.GATSBY_MESSAGING_SENDER_ID,
          appId: process.env.GATSBY_APP_ID
        }
      }
    }
  ],
};
