import { ApolloClient, ApolloLink, CombinedGraphQLErrors, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { HttpLink } from '@apollo/client/link/http'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { filter, from, switchMap } from 'rxjs'
import { UserContext } from '../UserContext'

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_GQL_API_BASE}/graphql`
})

let googleFirebaseIdTokenPromise = null
let googleFirebaseIdTokenFethedAt = null

const authLink = new SetContextLink(({ headers, googleFirebaseUserIdToken }) => {
  if (googleFirebaseUserIdToken) {
    return {
      headers: {
        ...headers,
        authorization: googleFirebaseUserIdToken
      }
    }
  } else {
    return { headers }
  }
})

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const authenticationError = error.errors.find(
      (graphQLError) =>
        graphQLError.extensions.code === 'INVALID_ID_TOKEN' && graphQLError.extensions.firebaseCode === 'auth/id-token-expired'
    )
    if (authenticationError && getAuth().currentUser) {
      googleFirebaseIdTokenPromise =
        googleFirebaseIdTokenFethedAt && Date.now() - googleFirebaseIdTokenFethedAt < 10000
          ? googleFirebaseIdTokenPromise
          : getAuth()
              .currentUser.getIdToken()
              .catch((error) => {
                console.error('Could not refresh access token', error)
                return null
              })
              .then((newGoogleFirebaseIdToken) => {
                console.log('Refetched google firebase id token for user. Applying to headers and retrying request.')
                return newGoogleFirebaseIdToken
              })
      googleFirebaseIdTokenFethedAt = Date.now()
      return from(googleFirebaseIdTokenPromise).pipe(
        filter(Boolean),
        switchMap((googleIdToken) => {
          operation.setContext({
            headers: {
              ...operation.getContext().headers,
              authorization: googleIdToken
            }
          })
          return forward(operation)
        })
      )
    }
  }
})

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  devtools: { enabled: true },
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    }
  }
})

export const AuthenticatedApolloProvider = ({ children }) => {
  const [googleUser, setGoogleUser] = useState()
  useEffect(() => {
    onAuthStateChanged(getAuth(), async (newGoogleUser) => {
      if (newGoogleUser) {
        const newGoogleUserIdToken = await newGoogleUser.getIdToken()
        apolloClient.defaultContext.googleFirebaseUserIdToken = newGoogleUserIdToken
        setGoogleUser(newGoogleUser)
      } else {
        apolloClient.resetStore()
        setGoogleUser(null)
        localStorage.removeItem('googleFirebaseUserIdToken')
      }
    })
  }, [])
  return (
    <UserContext.Provider value={{ googleUser }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </UserContext.Provider>
  )
}
