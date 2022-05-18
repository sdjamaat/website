//This is called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/auth/)) {
    page.matchPath = "/auth/*"
    // Update the page.
    createPage(page)
  }
}

// I added this from: https://github.com/firebase/firebase-js-sdk/issues/2222
// Was having issues building in Netlify, got the following error:
// WebpackError: ReferenceError: IDBIndex is not define
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      externals: getConfig().externals.concat(function (
        context,
        request,
        callback
      ) {
        const regex = /^@?firebase(\/(.+))?/
        // exclude firebase products from being bundled, so they will be loaded using require() at runtime.
        if (regex.test(request)) {
          return callback(null, "umd " + request)
        }
        callback()
      }),
    })
  }
}
