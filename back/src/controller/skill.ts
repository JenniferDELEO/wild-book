import { Skill } from "../entity/skill";
import dataSource from "../utils";
import { IController } from "./iController";

const skillController: IController = {
  create: async (req, res) => {
    dataSource
      .getRepository(Skill)
      .save(req.body)
      .then(() => {
        res.status(201).send("Skill created");
      })
      .catch((error) => {
        console.log("Error", error);
        res.status(500).send("Error while creating the Skill");
      });
  },

  findAll: async (req, res) => {
    try {
      const data = await dataSource.getRepository(Skill).find();
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  update: async (req, res) => {
    try {
      await dataSource
        .getRepository(Skill)
        .update(req.body.idToUpdate, { name: req.body.name });
      res.send("Skill updated");
    } catch (err) {
      console.log("error", err);
    }
  },

  delete: async (req, res) => {
    try {
      await dataSource.getRepository(Skill).delete(req.body.idToDelete);
      res.send("Skill deleted");
    } catch (err) {
      console.log("error", err);
    }
  },
};

export default skillController;
