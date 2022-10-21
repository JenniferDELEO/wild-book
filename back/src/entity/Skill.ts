import { ObjectType, Field } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Grade } from "./Grade";

@ObjectType()
@Entity()
export class Skill {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("text", { unique: true })
  title: string;

  @OneToMany(() => Grade, (grade) => grade.skill)
  grades: Grade[];
}
