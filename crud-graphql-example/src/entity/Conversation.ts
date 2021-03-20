import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity("conversations")
export class Conversation extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column("simple-array")
	userIds: number[];

	@Field()
	@Column("simple-array")
	messageIds: number[];

	@Field()
	@Column({ nullable: true })
	name: string;
}
