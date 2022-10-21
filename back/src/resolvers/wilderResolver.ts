import { Arg, Mutation, Query, Resolver, InputType, Field } from "type-graphql";
import { Wilder } from "../entity/Wilder";
import { Grade } from "../entity/Grade";
import { Skill } from "../entity/Skill";
import dataSource from "../utils";
import { ApolloError } from "apollo-server";

@InputType({ description: "New Grade data" })
class AddGradesInput {
  @Field()
  grade: number;

  @Field()
  skillId: number;
}

@InputType({ description: "Update Grade data" })
class UpdateGradesInput extends AddGradesInput {
  @Field()
  id?: number;
}

@InputType({ description: "New Wilder data" })
class AddWilderInput {
  @Field()
  name: string;

  @Field()
  city: string;

  @Field()
  description: string;

  @Field(() => [AddGradesInput])
  grades: AddGradesInput[];
}

@InputType({ description: "Update Wilder data" })
class UpdateWilderInput extends AddWilderInput {
  @Field()
  id: number;
}

@Resolver(Wilder)
export class WilderResolver {
  @Query(() => [Wilder])
  async getAllWilders(): Promise<Wilder[]> {
    return await dataSource.manager.find(Wilder, {
      relations: {
        grades: {
          skill: true,
        },
      },
    });
  }

  @Mutation(() => Wilder)
  async createWilder(
    @Arg("data") data: AddWilderInput
  ): Promise<Wilder | ApolloError> {
    const newWilder = new Wilder();
    newWilder.name = data.name;
    newWilder.city = data.city;
    newWilder.description = data.description;
    const savedWilder = await dataSource.manager.save(Wilder, newWilder);
    if (savedWilder !== null) {
      const newGrades: Grade[] = [];
      await Promise.all(
        data.grades.map(async (grade: AddGradesInput) => {
          const skillToAdd = await dataSource.manager.findOneBy(Skill, {
            id: grade.skillId,
          });
          if (skillToAdd !== null) {
            const newGrade = new Grade();
            newGrade.wilder = savedWilder;
            newGrade.skill = skillToAdd;
            newGrade.grade = grade.grade;
            newGrades.push(newGrade);
          }
        })
      );
      await dataSource.manager.save(Grade, newGrades);
      const newWilder = await dataSource.manager.findOne(Wilder, {
        where: {
          id: savedWilder.id,
        },
        relations: {
          grades: {
            skill: true,
          },
        },
      });
      if (newWilder !== null) {
        return newWilder;
      }
    } else {
      throw new ApolloError("Something went wrong !");
    }
    return savedWilder;
  }

  @Mutation(() => Wilder)
  async updateWilder(
    @Arg("data") data: UpdateWilderInput
  ): Promise<Wilder | ApolloError> {
    const { id, name, city, description, grades } = data;
    try {
      const wilderToUpdate = await dataSource.manager.findOneOrFail(Wilder, {
        where: { id },
        relations: {
          grades: {
            skill: true,
          },
        },
      });
      wilderToUpdate.name = name;
      wilderToUpdate.city = city;
      wilderToUpdate.description = description;
      await dataSource.manager.save(Wilder, wilderToUpdate);
      const newGrades: Grade[] = [];
      await Promise.all(
        grades.map(async (grade: UpdateGradesInput) => {
          const gradeToUpdate = await dataSource.manager.findOne(Grade, {
            where: {
              skillId: grade.id,
              wilderId: wilderToUpdate.id,
            },
          });
          if (gradeToUpdate !== null) {
            gradeToUpdate.grade = grade.grade;
            await dataSource.manager.save(Grade, gradeToUpdate);
          } else {
            const skillToAdd = await dataSource.manager.findOneBy(Skill, {
              id: grade.id,
            });
            if (skillToAdd !== null) {
              const newGrade = new Grade();
              newGrade.wilder = wilderToUpdate;
              newGrade.skill = skillToAdd;
              newGrade.grade = grade.grade;
              newGrades.push(newGrade);
            }
          }
        })
      );
      await dataSource.manager.save(Grade, newGrades);
      const updatedWilder = await dataSource.manager.findOne(Wilder, {
        where: { id },
        relations: {
          grades: {
            skill: true,
          },
        },
      });
      if (updatedWilder !== null) {
        return updatedWilder;
      } else {
        throw new Error();
      }
    } catch (err: any) {
      return new ApolloError(err.message);
    }
  }

  @Mutation(() => String)
  async deleteWilder(@Arg("id") id: number): Promise<String> {
    try {
      await dataSource.manager.delete(Wilder, id);
      return "Deleted Wilder Successfully";
    } catch (err: any) {
      throw new ApolloError(err.message);
    }
  }
}
