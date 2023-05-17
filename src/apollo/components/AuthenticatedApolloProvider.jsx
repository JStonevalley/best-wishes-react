import React, { useEffect, useState } from 'react'
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useUser } from '../../store/user'

const httpLink = createHttpLink({
  uri: 'localhost:4000/graphql'
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

export const AuthenticatedApolloProvider = ({ children }) => {
  const { googleUser } = useUser()
  const [client, setClient] = useState(apolloClient)
  useEffect(() => {
    if (googleUser)
      googleUser.getIdToken().then((idToken) => {
        console.log(idToken)
        const authLink = setContext((_, { headers }) => {
          return {
            headers: {
              ...headers,
              authorization: idToken
            }
          }
        })
        setClient(
          new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
          })
        )
      })
  }, [googleUser])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
