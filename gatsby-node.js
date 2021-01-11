exports.onCreatePage = async ({ page, actions }) => {
  const { createPage, createRedirect } = actions

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = `/app/*`

    // Update the page.
    createPage(page)
  }

  createRedirect({
    fromPath: `/`,
    toPath: `/app/home`,
    redirectInBrowser: true,
    isPermanent: true,
  })
}