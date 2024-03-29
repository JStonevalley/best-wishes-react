import React, { useEffect, useState } from 'react'
import { ApolloClient, ApolloProvider, createHttpLink, fromPromise, InMemoryCache, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { UserContext } from '../UserContext'

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_GQL_API_BASE}/graphql`
})

let googleFirebaseIdTokenPromise = null
let googleFirebaseIdTokenFethedAt = null

const authLink = setContext((_, { headers, googleFirebaseUserIdToken }) => {
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

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    const authenticationError = graphQLErrors.find(
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
      return fromPromise(googleFirebaseIdTokenPromise)
        .filter(Boolean)
        .flatMap((googleIdToken) => {
          operation.setContext({
            headers: {
              ...operation.getContext().headers,
              authorization: googleIdToken
            }
          })
          return forward(operation)
        })
    }
  }
})

const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
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
  }, [setGoogleUser])
  return (
    <UserContext.Provider value={{ googleUser }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </UserContext.Provider>
  )
}
