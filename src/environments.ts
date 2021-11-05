type Environment = {
  graphqlService: string;
  collectionAPI: string;
  storageAPI: string;
};

export const environment: Environment = {
  graphqlService: process.env.GRAPHQL || 'http://localhost:8071/api/graphql',
  collectionAPI: 'http://localhost:8000/',
  storageAPI: 'http://localhost:8001/',
};
