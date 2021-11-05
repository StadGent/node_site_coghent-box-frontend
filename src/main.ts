import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { createApp } from 'vue';
import App from './App.vue';
import { DefaultApolloClient } from '@vue/apollo-composable';

import 'coghent-vue-3-component-library/lib/index.css';
import { router } from './router';
import { environment as env } from './environments';

const config = fetch('../config.json').then((r) => r.json());

createApp(App)
  .use(router)
  .provide(
    DefaultApolloClient,
    new ApolloClient({
      link: createHttpLink({ uri: env.graphqlService }),
      cache: new InMemoryCache(),
    }),
  )
  .mount('#app');
