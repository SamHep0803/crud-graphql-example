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
	async getConversation(@Arg("id") id: number) {
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
		@Arg("userIds") userIds: [number],
		@Arg("name", { nullable: true }) name: string,
		@Ctx() { req }: any
	) {
		try {
			const userId = req.session.userId;
			if (!userId) {
				return null;
			}

			if (userIds.length < 2) {
				return null;
			}

			let names: any[] = [];
			if (userIds.length > 2 && name === "") {
				userIds.forEach(async (id) => {
					const user = await User.findOne({ where: { id } });
					names.push(user);
				});
				name = names.toString();
			}

			const conversation = await Conversation.create({ userIds, name });

			await conversation.save();

			return conversation;
		} catch (err) {
			console.log(err);
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

			if (!conversation.userIds.includes(userId)) {
				return false;
			}

			await conversation.remove();
		} catch (err) {
			console.log(err);
		}
	}
}
