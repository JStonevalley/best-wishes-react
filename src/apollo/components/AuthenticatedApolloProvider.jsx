import React, { useEffect, useState, createContext } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  fromPromise,
  InMemoryCache,
  from
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const UserContext = createContext({})
export const useUser = () => React.useContext(UserContext)

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

let googleFirebaseIdTokenPromise = null
let googleFirebaseIdTokenFethedAt = null

const authLink = setContext((_, { headers }) => {
  const googleFirebaseUserIdToken = localStorage.getItem(
    'googleFirebaseUserIdToken'
  )
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

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      const authenticationError = graphQLErrors.find(
        (graphQLError) => graphQLError.extensions.code === 'INVALID_ID_TOKEN'
      )
      if (authenticationError && getAuth().currentUser) {
        googleFirebaseIdTokenPromise =
          googleFirebaseIdTokenFethedAt &&
          Date.now() - googleFirebaseIdTokenFethedAt < 10000
            ? googleFirebaseIdTokenPromise
            : getAuth()
                .currentUser.getIdToken()
                .catch((error) => {
                  console.error('Could not refresh access token', error)
                  return null
                })
                .then((newGoogleFirebaseIdToken) => {
                  console.log(
                    'Refetched google firebase id token for user. Applying to headers and retrying request.'
                  )
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
  }
)

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
        localStorage.setItem('googleFirebaseUserIdToken', newGoogleUserIdToken)
        setGoogleUser(newGoogleUser)
      } else {
        apolloClient.resetStore()
        setGoogleUser(undefined)
        localStorage.removeItem('googleFirebaseUserIdToken')
      }
    })
  })
  return (
    <UserContext.Provider value={{ googleUser }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </UserContext.Provider>
  )
}
