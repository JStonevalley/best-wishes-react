import React, { useEffect, useState, createContext } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const UserContext = createContext({})
export const useUser = () => React.useContext(UserContext)

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

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
        console.log(googleIdToken)
        const authLink = setContext((_, { headers }) => {
          return {
            headers: {
              ...headers,
              authorization: googleIdToken
            }
          }
        })
        const newClient = new ApolloClient({
          link: authLink.concat(httpLink),
          cache: new InMemoryCache(),
          connectToDevTools: true,
          defaultOptions: {
            watchQuery: {
              errorPolicy: 'all'
            }
          }
        })
        setClient(newClient)
      })
    }
  }, [googleUser])
  return (
    <UserContext.Provider value={{ googleUser }}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </UserContext.Provider>
  )
}
