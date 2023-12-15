const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const { mergeResolvers, mergeTypeDefs } = require('@graphql-tools/merge');

const personTypeDefs = `#graphql
  type Person {
    id: ID!
    name: String!
  }

  type Query {
    getListOfPersons: [Person!]!
  }
`;

const personResolver = {
  Query: {
    getListOfPersons: (parent, args, context) => {
      return context.dataSources.person.getAll();
    },
  },
};

const stationTypeDefs = `#graphql
  type Station {
    id: ID!
    name: String!
  }

  type Query {
    getStations: [Station!]!
  }
`;

const stationResolver = {
  Query: {
    getStations: (parent, args, context) => {
      return context.dataSources.stations.getAll();
    },
  },
}

const typeDefs = mergeTypeDefs([personTypeDefs, stationTypeDefs]);
const resolvers = mergeResolvers([personResolver, stationResolver]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const dataSources = {
  person: {
    getAll: () => [
      { id: 1, name: 'Person1' },
      { id: 2, name: 'Person2' },
      { id: 3, name: 'Person3' },
    ],
  },
  stations: {
    getAll: () => [
      { id: 1, name: 'Station1' },
      { id: 2, name: 'Station2' },
      { id: 3, name: 'Station3' },
    ],
  },
};

const context = async ({ req }) => ({
  dataSources,
});

async function runApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
  });

  await server.start();

  app.use('/graphql', bodyParser.json(), expressMiddleware(server, { context }));

  app.listen(8000, () => {
    console.log('App is listening on port 8000...');
  });
}

runApp();
