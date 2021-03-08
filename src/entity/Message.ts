import { Field, ObjectType } from "type-graphql";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	CreateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("messages")
export class Message extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@CreateDateColumn({ type: "timestamp with time zone" })
	createdAt: Date;

	@Field({ nullable: true })
	@Column({ type: "timestamp", nullable: true })
	updatedAt?: Date;

	@Field()
	@Column()
	content: string;
}
