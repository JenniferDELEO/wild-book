import { ObjectType, Field } from "type-graphql";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Wilder } from "./Wilder";
import { Skill } from "./Skill";

@ObjectType()
@Entity()
export class Grade {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  wilderId: number;

  @Column()
  skillId: number;

  @Field()
  @Column()
  grade: number;

  @ManyToOne(() => Wilder, (wilder) => wilder.grades, {
    cascade: true,
    onDelete: "CASCADE",
  })
  wilder: Wilder;

  @Field()
  @ManyToOne(() => Skill, (skill) => skill.grades, { onDelete: "CASCADE" })
  skill: Skill;
}
