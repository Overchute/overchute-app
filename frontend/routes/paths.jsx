// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS = {
  app: "/crowdsale",
  home: "/",
}

export const PATH_APP = {
  root: ROOTS.app,

  app: {
    create: path(ROOTS.app, "/create"),
    counter: path(ROOTS.app, "/counter"),
    greeting: path(ROOTS.app, "/greeting"),
    helloWorld: path(ROOTS.app, "/hello-world"),
    list: path(ROOTS.app, "/list"),
    search: path(ROOTS.app, "/search"),
    show: path(ROOTS.app, "/show/:id"),
    load: path(ROOTS.app, "/loading"),
  },
}