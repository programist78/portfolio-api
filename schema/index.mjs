import typeDefs from './typeDefs.mjs';
import resolvers from './resolvers.mjs';
import { makeExecutableSchema } from 'graphql-tools';

const schema = makeExecutableSchema({ typeDefs, resolvers});

export default schema