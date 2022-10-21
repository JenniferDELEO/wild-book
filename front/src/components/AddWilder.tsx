import { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import styles from "../styles/addWilder.module.css";
import Skill from "./Skill";
import {
  ISkill,
  IWilderToEdit,
  IWilderToEditToPass,
} from "../interfaces/interfaces";

import { GET_WILDERS } from "../App";

const GET_SKILLS = gql`
  query getAllSkills {
    getAllSkills {
      id
      title
    }
  }
`;

const UPDATE_WILDER = gql`
  mutation updateWilder($data: UpdateWilderInput!) {
    updateWilder(data: $data) {
      id
      name
      city
      description
      grades {
        grade
        skill {
          id
          title
        }
      }
    }
  }
`;

const CREATE_NEW_WILDER = gql`
  mutation addNewWilder($data: AddWilderInput!) {
    createWilder(data: $data) {
      id
      name
      description
      city
      grades {
        grade
        skill {
          title
          id
        }
      }
    }
  }
`;

const AddWilder = ({
  isEditing,
  setWilderToEdit,
  setAddNewWilder,
  wilders,
  editId,
  editName,
  editCity,
  editDescription,
  editGrades,
}: IWilderToEditToPass) => {
  const [id] = useState<IWilderToEdit["editId"]>(editId);
  const [name, setName] = useState<IWilderToEdit["editName"]>(editName || "");
  const [city, setCity] = useState<IWilderToEdit["editCity"]>(editCity || "");
  const [description, setDescription] = useState<
    IWilderToEdit["editDescription"]
  >(editDescription || "");

  const [wildersGrades, setWildersGrades] = useState<ISkill[]>(
    editGrades || []
  );

  const [addingNewGrade, setAddingNewGrade] = useState(false);
  const [newGradeGrade, setNewGradeGrade] = useState(0);
  const [newGradeId, setNewGradeId] = useState(0);

  const [updateWilder] = useMutation(UPDATE_WILDER, {
    refetchQueries: [{ query: GET_WILDERS }, "getAllWilders"],
  });

  const [createNewWilder] = useMutation(CREATE_NEW_WILDER, {
    refetchQueries: [{ query: GET_WILDERS }, "getAllWilders"],
  });

  const { loading, error, data } = useQuery(GET_SKILLS);

  const handleAddGrade = () => {
    const newSkillToAdd = data.getAllSkills.filter(
      (el: ISkill) => el.id === newGradeId
    )[0];

    if (newSkillToAdd !== null) {
      const newGrade = {
        votes: newGradeGrade,
        title: newSkillToAdd.title,
        id: newSkillToAdd.id,
      };

      const exisitingGrade = wildersGrades.filter(
        (grade) => grade.id === newSkillToAdd.id
      );
      if (exisitingGrade.length > 0) {
        const updatedGrade = exisitingGrade[0];
        updatedGrade.votes = newGradeGrade;
        const updatedGrades = wildersGrades.filter(
          (grade) => grade.id !== newSkillToAdd.id
        );
        setWildersGrades([...updatedGrades, updatedGrade]);
      } else {
        setWildersGrades([...wildersGrades, newGrade]);
        setAddingNewGrade(false);
        setNewGradeGrade(0);
        setNewGradeId(0);
      }
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const gradesToSend = wildersGrades.map((grade) => {
      return {
        skillId: grade.id,
        grade: grade.votes,
      };
    });

    if (isEditing) {
      updateWilder({
        variables: {
          data: {
            id,
            name,
            city,
            description,
            grades: gradesToSend,
          },
        },
      });
    } else {
      createNewWilder({
        variables: {
          data: {
            name,
            city,
            description,
            grades: gradesToSend,
          },
        },
      });
    }
    setWilderToEdit({
      isEditing: false,
      editName: "",
      editCity: "",
      editDescription: "",
      editGrades: [],
    });
    setAddNewWilder(false);
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue :(</p>;

  return (
    <form
      className={`${styles.form} card`}
      onSubmit={(e) => e.preventDefault()}
    >
      <h3>Ajouter un nouveau wilder</h3>
      <fieldset className={styles.fieldset}>
        <label className={styles.labels} htmlFor="name">
          Nom :
        </label>
        <input
          type="text"
          title="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label className={styles.labels} htmlFor="city">
          Ville :
        </label>

        <input
          type="text"
          title="city"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
        />
      </fieldset>
      <fieldset className={styles.fieldset}>
        <label className={styles.labels} htmlFor="description">
          Description :{" "}
        </label>
        <textarea
          value={description}
          cols={30}
          rows={10}
          required
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </fieldset>
      <h4>Compétences</h4>
      <ul className="skills" style={{ gap: "7px" }}>
        {wildersGrades.map((grade) => {
          return (
            <Skill
              key={`${name}-skill-${grade.id}`}
              title={grade.title}
              votes={grade.votes}
            />
          );
        })}
      </ul>
      <button
        onClick={() => {
          setAddingNewGrade(!addingNewGrade);
        }}
        className={styles.actionButton}
      >
        Ajouter une nouvelle compétence
      </button>
      {addingNewGrade && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <select
            name="skill"
            value={newGradeId}
            onChange={(e) => {
              setNewGradeId(parseInt(e.target.value));
            }}
          >
            <option value={0} disabled>
              {" "}
              Choisir une compétence{" "}
            </option>
            {data.getAllSkills.map((skill: ISkill) => {
              return (
                <option key={"option-" + skill.title} value={skill.id}>
                  {skill.title}
                </option>
              );
            })}
          </select>
          <label htmlFor="newGrade">Note : </label>
          <input
            type="number"
            name="newGrade"
            value={newGradeGrade}
            min={0}
            max={10}
            onChange={(e) => {
              setNewGradeGrade(parseInt(e.target.value));
            }}
          />

          <button
            onClick={handleAddGrade}
            disabled={newGradeGrade === 0 || newGradeId === 0}
            className={styles.actionButton}
            style={{ margin: "0" }}
          >
            Ajouter la compétence
          </button>
        </div>
      )}
      <button onClick={(e) => handleSubmit(e)} className={styles.actionButton}>
        Sauvegarder le Wilder
      </button>
    </form>
  );
};

export default AddWilder;
