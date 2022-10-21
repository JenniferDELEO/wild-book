import { Grade } from "../entity/grade";
import { Skill } from "../entity/skill";
import { Wilder } from "../entity/wilder";
import dataSource from "../utils";
import { IController } from "./iController";

const wilderController: IController = {
  create: async (req, res) => {
    try {
      const wilder = await dataSource.getRepository(Wilder).save({
        name: req.body.name,
        city: req.body.city,
        description: req.body.description,
      });
      console.log("wilder created :", wilder);
      if (req.body.skills !== null) {
        req.body.skills.forEach(
          async (skill: { title: string; votes: number; id: number }) => {
            const skillFromDB = await dataSource
              .getRepository(Skill)
              .findOneBy({ id: skill.id });
            if (skillFromDB !== null) {
              const newGrade = new Grade();
              newGrade.grade = skill.votes;
              newGrade.skill = skillFromDB;
              newGrade.wilder = wilder;
              await dataSource.getRepository(Grade).save(newGrade);
            }
          }
        );
      }
      return res.status(201).send("Grade added to the skill and the wilder");
    } catch (error) {
      console.log("Error", error);
      res.status(500).send("Error while creating the wilder");
    }
  },

  read: async (req, res) => {
    try {
      const wilders = await dataSource.getRepository(Wilder).find({
        relations: {
          grades: {
            skill: true,
          },
        },
      });
      res.status(200).send(wilders);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  update: async (req, res) => {
    try {
      await dataSource.getRepository(Wilder).update(req.body.idToUpdate, {
        name: req.body.name,
        description: req.body.description,
        city: req.body.city,
      });
      res.send("wilder updated");
    } catch (err) {
      console.log("error", err);
    }
  },

  delete: async (req, res) => {
    try {
      await dataSource.getRepository(Wilder).delete(req.body.idToDelete);
      res.send("wilder deleted");
    } catch (err) {
      console.log("error", err);
    }
  },
};

export default wilderController;
