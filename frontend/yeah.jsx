import useAuth from "./hooks/useAuth"
const ident = () => {
  const { identity } = useAuth()

  return {
    identity,
  }
}

export { ident }
