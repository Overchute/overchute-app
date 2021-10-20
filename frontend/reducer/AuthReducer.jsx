export default function reducer(state, action) {
  switch (action.type) {
    case "SET_AUTHENTICATION":
      return { ...state, isAuthenticated: action.payload }
    case "SET_AUTH_CLIENT":
      return { ...state, authClient: action.payload }
    case "SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload }
    case "SET_PRINCIPAL":
      return { ...state, principal: action.payload }
    case "SET_IDENTITY":
      return { ...state, identity: action.payload }
    case "SET_CLIENT":
      return { ...state, client: action.payload }
    case "SET_ACTOR":
      return { ...state, actor: action.payload }

    default:
      return state
  }
}
