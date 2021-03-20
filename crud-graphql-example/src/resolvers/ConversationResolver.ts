import { Conversation } from "src/entity/Conversation";
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
	async newConversation(
		@Arg("userIds") userIds: [number],
		@Arg("name", { nullable: true }) name: string,
		@Ctx() { req }: any
	) {
		try {
			const userId = req.session.userId;
			if (!userId) {
				return null;
			}
		} catch (err) {
			console.log(err);
		}
	}
}
