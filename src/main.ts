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
import { useIIIF } from 'coghent-vue-3-component-library';

export let apolloClient: ApolloClient<NormalizedCacheObject>;
export let iiiF: any

async function main() {
  const configStore = StoreFactory.get(ConfigStore);
  const config = await fetch('../config.json').then((r) => r.json());
  configStore.setConfig(config);

  iiiF = useIIIF(config.iiifLink)

  apolloClient = new ApolloClient({
    link: createHttpLink({ uri: config.graphQlLink || '/api/graphql' }),
    cache: new InMemoryCache(),
  });

  createApp(App).use(router).provide(DefaultApolloClient, apolloClient).mount('#app');
}
main();
