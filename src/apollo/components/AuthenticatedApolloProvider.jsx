import React, { useEffect, useState } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  gql,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { GET_CURRENT_USER } from '../../auth/gql'
import { useBaseState } from '../../store/lists'

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
        newClient
          .query({
            query: GET_CURRENT_USER
          })
          .then(({ errors }) => {
            if (errors && errors[0].extensions.code === 'UNAUTHENTICATED') {
              newClient.mutate({
                mutation: gql`
                  mutation createUser($email: String!) {
                    user: createUser(email: $email) {
                      id
                      email
                      googleUserId
                    }
                  }
                `,
                variables: { email: googleUser.email }
              })
            }
          })
      })
    }
  }, [googleUser])
  useBaseState() // TODO Remove when all state is migrated to Apollo client
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
