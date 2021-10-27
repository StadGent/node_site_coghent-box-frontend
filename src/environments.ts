type Environment = {
  graphqlService: string;
};

export const environment: Environment = {
  graphqlService: process.env.GRAPHQL || 'http://localhost:8071/api/graphql',
};
