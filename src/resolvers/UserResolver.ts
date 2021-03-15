import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { User } from "../entity/User";

@Resolver()
export class UserResolver {
	@Query(() => [User])
	users() {
		return User.find();
	}

	@Query(() => Boolean)
	logout(@Ctx() { req }: any) {
		const userId = req.session.userId;
		if (!userId) {
			return false;
		}

		req.session.destroy();
		return true;
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() { req }: any) {
		const userId = req.session.userId;
		if (!userId) {
			return null;
		}

		const user = User.findOne(userId);
		if (!user) {
			return null;
		}

		return user;
	}

	@Mutation(() => User, { nullable: true })
	async register(
		@Arg("email") email: string,
		@Arg("password") password: string
	) {
		try {
			const hashedPassword = await hash(password, 10);

			const user = User.create({
				email,
				password: hashedPassword,
			});

			await user.save();
			return user;
		} catch (err) {
			console.log(err);
			return null;
		}
	}

	@Mutation(() => User, { nullable: true })
	async login(
		@Arg("email") email: string,
		@Arg("password") password: string,
		@Ctx() { req }: any
	) {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return null;
		}

		const valid = compare(password, user.password);
		if (!valid) {
			return null;
		}

		req.session.userId = user.id;

		return user;
	}
}
