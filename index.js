const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const { mergeResolvers } = require('@graphql-tools/merge');

const typeDefs = `#graphql
  type Person {
    id: ID!
    name: String!
  }

  type Station {
    id: ID!
    name: String!
  }

  type Query {
    getListOfPersons: [Person!]!
    getStations: [Station!]!
  }
`;

const personResolver = {
  Query: {
    getListOfPersons: (parent, args, context) => ([
      { id: 1, name: 'Person1' },
      { id: 2, name: 'Person2' },
      { id: 3, name: 'Person3' },
    ]),
  },
};

const stationResolver = {
  Query: {
    getStations: (parent, args, context) => ([
      { id: 1, name: 'Station1' },
      { id: 2, name: 'Station2' },
      { id: 3, name: 'Station3' },
    ]),
  },
}

const resolvers = mergeResolvers([personResolver, stationResolver]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const context = async ({ req }) => ({});

async function runApp() {
  const app = express();

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
  });

  await server.start();

  app.use('/graphql', bodyParser.json(), expressMiddleware(server));

  app.listen(8000, () => {
    console.log('App is listening on port 8000...');
  });
}

runApp();
