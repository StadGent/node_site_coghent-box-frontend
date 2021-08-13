import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createApp } from 'vue'
import App from './App.vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import 'coghent-vue-3-component-library/lib/index.css'

createApp(App)
  .provide(
    DefaultApolloClient,
    new ApolloClient({
      link: createHttpLink({ uri: "http://localhost:8071/api/graphql" }),
      cache: new InMemoryCache(),
    }),
  ).mount('#app')
