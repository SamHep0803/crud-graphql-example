import { Field, ObjectType } from "type-graphql";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
	@Field()
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@CreateDateColumn({ type: "timestamp with time zone" })
	createdAt: Date;

	@Field()
	@Column({ unique: true })
	name: string;

	@Field()
	@Column({ unique: true })
	email: string;

	@Column()
	password: string;
}
