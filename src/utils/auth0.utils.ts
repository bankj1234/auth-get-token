import { createAuth0Client } from "@auth0/auth0-spa-js"

const getAuth0 = async () => {
  if (typeof window !== 'undefined') {
    const auth0 = await createAuth0Client({
      domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
      cacheLocation: "localstorage",
      authorizationParams: {
        redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || 'http://localhost:3000/signin-success',
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE || 'openid profile email'
      }
    })
    return auth0
  }
}

export default getAuth0
