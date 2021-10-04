function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS = {
  app: "/crowdsale",
  home: "/",
}

const ROOTS_AUTH = "/auth"

export const PATH_AUTH = {
  root: ROOTS.PATH_AUTH,
}

export const PATH_APP = {
  root: ROOTS.app,

  app: {
    contribute: path(ROOTS.app, "/contribute/:id"),
    create: path(ROOTS.app, "/create"),
    delete: path(ROOTS.app, "/delete/:id"),
    edit: path(ROOTS.app, "/edit/:id/:offer/:deadline"),
    list: path(ROOTS.app, "/list"),
    search: path(ROOTS.app, "/search"),
    show: path(ROOTS.app, "/show/:id"),
    load: path(ROOTS.home, "/loading"),
  },
}
