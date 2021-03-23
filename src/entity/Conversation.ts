import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity("conversations")
export class Conversation extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field(() => [Number])
	@Column("simple-array")
	users: number[];

	@Field(() => [Number])
	@Column("simple-array")
	messages: number[];

	@Field()
	@Column({ nullable: true })
	name: string;
}
