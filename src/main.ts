import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import { createApp } from 'vue';
import App from './App.vue';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ConfigStore } from './stores/ConfigStore';
import 'coghent-vue-3-component-library/lib/index.css';
import { router } from './router';
import './style.css';
import StoreFactory from './stores/StoreFactory';

export let apolloClient: ApolloClient<NormalizedCacheObject>;

async function main() {
  const configStore = StoreFactory.get(ConfigStore);
  const config = await fetch('../config.json').then((r) => r.json());
  configStore.setConfig(config);

  apolloClient = new ApolloClient({
    link: createHttpLink({ uri: config.graphQlLink || '/api/graphql' }),
    cache: new InMemoryCache(),
  });

  createApp(App).use(router).provide(DefaultApolloClient, apolloClient).mount('#app');
}
main();
