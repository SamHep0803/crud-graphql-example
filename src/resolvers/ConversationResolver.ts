import { Conversation } from "src/entity/Conversation";
import { User } from "src/entity/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class ConversationResolver {
	@Query(() => [Conversation])
	conversations() {
		return Conversation.find();
	}

	@Query(() => Conversation, { nullable: true })
	async conversation(@Arg("id") id: number) {
		try {
			const conversation = await Conversation.findOne({ where: { id } });

			if (!conversation) {
				return null;
			}

			return conversation;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => Conversation, { nullable: true })
	async createConversation(
		@Arg("users") users: [number],
		@Arg("name", { nullable: true }) name: string,
		@Ctx() { req }: any
	) {
		try {
			const userId = req.session.userId;
			if (!userId) {
				return null;
			}

			if (users.length < 2) {
				return null;
			}

			let names: string[] = [];
			if (users.length > 2 && name === "") {
				users.forEach(async (id) => {
					const user = await User.findOne({ where: { id } });
					names.push(user!.name);
				});
				name = names.toString();
			}

			const conversation = await Conversation.create({ users, name });

			await conversation.save();

			return conversation;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => Conversation, { nullable: true })
	async updateConversation(
		@Arg("id") id: number,
		@Arg("users", { nullable: true }) users: [number],
		@Arg("name", { nullable: true }) name: string,
		@Ctx() { req }: any
	) {
		try {
			const userId = req.session.userId;
			if (!userId) {
				return null;
			}

			const conversation = await Conversation.findOne({ where: { id } });
			if (!conversation) {
				return null;
			}

			if (users) {
				conversation.users = users;
			}

			if (name) {
				conversation.name = name;
			}

			Conversation.update(id, conversation);
			return conversation;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => Boolean)
	async deleteConversation(@Arg("id") id: number, @Ctx() { req }: any) {
		try {
			const userId = req.session.userId;
			if (!userId) {
				return false;
			}

			const conversation = await Conversation.findOne({ where: { id } });
			if (!conversation) {
				return false;
			}

			if (!conversation.users.includes(userId)) {
				return false;
			}

			await conversation.remove();
			return true;
		} catch (err) {
			console.log(err);
			return false;
		}
	}
}
