import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MessageResolver } from "./resolvers/MessageResolver";
import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers/UserResolver";
import session from "express-session";
import * as sqlite3 from "sqlite3";

(async () => {
	const app = express();

	var SQLiteStore = require("connect-sqlite3")(session);

	app.use(
		session({
			secret: "thisisaverysecretsecret",
			resave: false,
			saveUninitialized: false,
			cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
			store: new SQLiteStore(),
		})
	);

	app.get("/", (req, res) => {
		console.log(req.session);
		res.send("hello");
	});

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
