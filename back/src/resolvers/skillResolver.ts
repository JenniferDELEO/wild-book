import { ApolloError } from "apollo-server";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Skill } from "../entity/Skill";
import dataSource from "../utils";

@Resolver()
export class SkillResolver {
  @Query(() => [Skill])
  async getAllSkills(): Promise<Skill[] | ApolloError> {
    try {
      return await dataSource.manager.find(Skill);
    } catch (error: any) {
      throw new ApolloError(error.message);
    }
  }

  @Mutation(() => String)
  async createSkill(@Arg("title") title: string): Promise<string> {
    // TODO : Check if Skill already exists && throw Error if it does
    try {
      await dataSource.manager.save(Skill, { title });
      return "Skill Created !";
    } catch (error: any) {
      throw new ApolloError(error.message);
    }
  }

  @Mutation(() => Skill)
  // TODO : Ask why does apolloGraph see the id variable name as updateWilderId ??
  async updateSkill(
    @Arg("id") id: number,
    @Arg("title") title: string
  ): Promise<Skill> {
    try {
      const updatedSkill = await dataSource.manager.save(Skill, {
        id,
        title,
      });
      return updatedSkill;
    } catch (error: any) {
      throw new ApolloError("Error while updating skill", error);
    }
  }

  @Mutation(() => String)
  async deleteSkill(@Arg("id") id: number): Promise<String> {
    try {
      await dataSource.manager.delete(Skill, id);
      return "Skill deleted successfully";
    } catch (error: any) {
      throw new ApolloError("Something went wrong...", error);
    }
  }
}
