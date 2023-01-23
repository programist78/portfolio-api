// @ts-ignore

import { ApolloServer } from "apollo-server-koa";
import graphqlUploadKoa from "graphql-upload/graphqlUploadKoa.mjs";
import Koa from "koa";
import makeDir from "make-dir";
import { fileURLToPath } from "node:url";
import mongoose from 'mongoose';
import UPLOAD_DIRECTORY_URL from "./config/UPLOAD_DIRECTORY_URL.mjs";
import schema from "./schema/index.mjs";
import serve from "koa-static";
import path from 'path'
import cors from "@koa/cors";
const __dirname = path.resolve();
/** Starts the API server. */
async function startServer() {
  // Ensure the upload directory exists.
  await makeDir(fileURLToPath(UPLOAD_DIRECTORY_URL));

  const corsOptions = {
    origin: process.env.CLIENT,
    // 'http://localhost:3001', 'http://localhost:4000/graphql'],
    credentials: true,
    }

  const app = new Koa()
  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();
  // apolloServer.applyMiddleware({ app, path: "/graphql", cors: false });

  app
    .use(
      graphqlUploadKoa({
        // Limits here should be stricter than config for surrounding
        // infrastructure such as Nginx so errors can be handled elegantly by
        // `graphql-upload`.
        maxFileSize: 10000000, // 10 MB
        maxFiles: 20,
      })
    )
    .use(async ctx => {
      ctx.body = 'Hello World with norm cors';
    })
    .use(serve(path.join(__dirname, '/uploads')))
    // @ts-ignore
    .use(cors(corsOptions))
    .use(apolloServer.getMiddleware({ app, path: "/graphql", cors: false }))
    .listen(process.env.PORT, () => {
      console.info(
        `Serving http://localhost:${process.env.PORT} for ${process.env.NODE_ENV}.`
      );
    });
}

mongoose
  .set('strictQuery', false)
  .connect(process.env.MONGO_DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(() => console.log('💖Db ok'))
  .catch((err) => console.log('DB error ❌', err))


startServer();
