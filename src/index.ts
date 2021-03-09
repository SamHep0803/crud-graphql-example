import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MessageResolver } from "./resolvers/MessageResolver";
import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers/UserResolver";
import session from "express-session";

(async () => {
	const app = express();

	app.get("/", (_, res) => {
		res.send("hello");
	});

	app.use(
		session({
			secret: "thisisaverysecretsecret",
			resave: false,
			saveUninitialized: false,
		})
	);

	await createConnection();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [MessageResolver, UserResolver],
		}),
		context: ({ req, res }: any) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log(
			`🚀 GraphQL server running at http://localhost:4000${apolloServer.graphqlPath}`
		);
	});
})();
