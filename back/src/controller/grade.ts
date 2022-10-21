import { Grade } from "../entity/grade";
import { Wilder } from "../entity/wilder";
import { Skill } from "../entity/skill";
import dataSource from "../utils";
import { IController } from "./iController";

const gradeController: IController = {
  create: async (req, res) => {
    try {
      const wilderFromDB = await dataSource
        .getRepository(Wilder)
        .findOneBy({ id: req.body.wilderId });
      const skillFromDB = await dataSource
        .getRepository(Skill)
        .findOneBy({ id: req.body.skillId });

      if (skillFromDB !== null && wilderFromDB !== null) {
        const newGrade = new Grade();
        newGrade.grade = req.body.grade;
        newGrade.skill = skillFromDB;
        newGrade.wilder = wilderFromDB;
        await dataSource.getRepository(Grade).save(newGrade);
        res.send("Grade added to the skill and the wilder");
      }
    } catch (err) {
      console.log("error:", err);
      res
        .status(500)
        .send("Error while adding grade to the skill and the wilder");
    }
  },
};

export default gradeController;
