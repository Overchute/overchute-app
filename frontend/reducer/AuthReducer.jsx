export default function reducer(state, action) {
  switch (action.type) {
    case "SET_AUTHENTICATION":
      return { ...state, isAuthenticated: action.payload }
    case "SET_SIGNED":
      return { ...state, signedIn: action.payload }
    case "SET_PRINCIPAL":
      return { ...state, principal: action.payload }
    case "SET_IDENTITY":
      return { ...state, identity: action.payload }
    case "SET_CLIENT":
      return { ...state, client: action.payload }

    default:
      return state
  }
}