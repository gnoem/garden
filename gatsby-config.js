module.exports = {
  siteMetadata: {
    title: "planet naomi",
    description: "personal page / code + design playground",
    url: "https://naomi.vercel.app",
    image: "https://i.imgur.com/BtXCCAC.png"
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-typescript",
    "gatsby-plugin-use-query-params",
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          'G-RSB8S0GN5L'
        ]
      }
    }
  ],
};