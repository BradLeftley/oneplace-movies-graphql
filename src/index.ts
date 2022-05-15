import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Resolver, Query } from "type-graphql";
import { MovieResolver } from "./resolvers/movies";
import { MovieDataSource } from "./datsources/movies";
import * as env from "dotenv"
import { PlexMoviesDataSource } from "./datsources/plex-movies";
import { PlexMovieResolver } from "./resolvers/plex-movies";
import { PlexTvShowsResolver } from "./resolvers/plex-tv-shows";
import { GreenSatoshiResolver } from "./resolvers/green-satoshi";
import { GreenSatoshiDatasource } from "./datsources/green-satoshi";
import { PlexMovieWatchListDataSource } from "./datsources/plex-watch-list";

@Resolver()
class HelloResolver {
  @Query(() => String)
  async helloWorld() {
    return "Hello World!";
  }
}

const main = async () => {
  env.config()
  const schema = await buildSchema({
    resolvers: [HelloResolver, MovieResolver, PlexMovieResolver, PlexTvShowsResolver, GreenSatoshiResolver]
  });

  console.log(schema)

  const apolloServer = new ApolloServer({ schema, dataSources: () => ({
    movieDataSource: new MovieDataSource(),
    plexDataSource: new PlexMoviesDataSource(),
    greenSatoshiDataSource: new GreenSatoshiDatasource(),
    plexMovieWatchListDataSource: new PlexMovieWatchListDataSource()
  }),
  });

  await apolloServer.start()
  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};

main();
