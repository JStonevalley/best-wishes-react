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

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: false, // Only the first client to connect to devtools will be picked up by the extension.
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    }
  }
})

export const AuthenticatedApolloProvider = ({ children }) => {
  const [client, setClient] = useState(apolloClient)
  const [googleUser, setGoogleUser] = useState()
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false)
  // TODO Handle logout better
  useEffect(() => {
    onAuthStateChanged(getAuth(), (newGoogleUser) => {
      if (newGoogleUser) {
        setGoogleUser(newGoogleUser)
      } else {
        console.log('logout')
        client.resetStore()
        setGoogleUser(null)
      }
    })
  }, [client])
  useEffect(() => {
    if (googleUser) {
      googleUser.getIdToken().then((googleIdToken) => {
        const authLink = setContext((_, { headers }) => {
          return {
            headers: {
              ...headers,
              authorization: googleIdToken
            }
          }
        })
        const errorLink = onError(
          ({ graphQLErrors, networkError, operation, forward }) => {
            if (graphQLErrors) {
              const authenticationError = graphQLErrors.find(
                (graphQLError) =>
                  graphQLError.extensions.code === 'INVALID_ID_TOKEN'
              )
              if (authenticationError) {
                googleFirebaseIdTokenPromise =
                  googleFirebaseIdTokenFethedAt &&
                  Date.now() - googleFirebaseIdTokenFethedAt < 10000
                    ? googleFirebaseIdTokenPromise
                    : googleUser
                        .getIdToken()
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
        const newClient = new ApolloClient({
          link: from([authLink, errorLink, httpLink]),
          cache: new InMemoryCache(),
          connectToDevTools: true,
          defaultOptions: {
            watchQuery: {
              errorPolicy: 'all'
            }
          }
        })
        setClient(newClient)
        setIsClientAuthenticated(Boolean(googleUser))
      })
    }
  }, [googleUser])
  return (
    <UserContext.Provider value={{ googleUser, isClientAuthenticated }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UserContext.Provider>
  )
}
