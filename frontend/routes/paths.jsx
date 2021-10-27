function path(root, sublink) {
  return `${root}${sublink}`
}

const ROOTS = {
  app: "/crowdsale",
  guest: "/",
}

export const PATH_GUEST = {
  root: ROOTS.guest,
  guest: {
    list: path(ROOTS.guest, "/list"),
    search: path(ROOTS.guest, "/search"),
    show: path(ROOTS.guest, "/show/:id"),
    signin: path(ROOTS.guest, "/signin"),
    load: path(ROOTS.guest, "/loading"),
  },
}
export const PATH_APP = {
  root: ROOTS.app,

  app: {
    contribute: path(ROOTS.app, "/contribute/:id"),
    create: path(ROOTS.app, "/create"),
    delete: path(ROOTS.app, "/delete/:id"),
    edit: path(ROOTS.app, "/edit/:id/:offer/:deadline"),
    edit: path(ROOTS.app, "/my"),
  },
}
