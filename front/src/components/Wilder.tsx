import blank_profile from "../assets/blank_profile.png";
import Skill from "./Skill";
import { IWilderProps } from "../interfaces/interfaces";
import { useMutation, gql } from "@apollo/client";
import { GET_WILDERS } from "../App";

const DELETE_WILDER = gql`
  mutation deleteWilder($deleteWilderId: Float!) {
    deleteWilder(id: $deleteWilderId)
  }
`;

const Wilder = ({
  id,
  name,
  city,
  description,
  grades,
  setAddNewWilder,
  setWilderToEdit,
}: IWilderProps) => {
  const [deleteWilder] = useMutation(DELETE_WILDER, {
    refetchQueries: [{ query: GET_WILDERS }, "getAllWilders"],
  });
  const handleDelete = async () => {
    deleteWilder({ variables: { deleteWilderId: id } });
  };
  const handleEdit = () => {
    setWilderToEdit({
      isEditing: true,
      editName: name,
      editCity: city,
      editDescription: description,
      editGrades: grades,
      editId: id,
    });

    setAddNewWilder(true);
  };

  return (
    <article className="card">
      <div className="actions">
        <button onClick={handleEdit}>Editer</button>
        <button onClick={handleDelete}>Supprimer</button>
      </div>
      <img src={blank_profile} alt="profil" />
      <h3>{name}</h3>
      <h4>{city}</h4>
      <p style={{ flexGrow: "1" }}>{description}</p>
      {grades.length > 0 ? <h4>Compétences</h4> : null}
      <ul className="skills">
        {grades.map((grade, index) => {
          return (
            <Skill
              key={`${name}-skill-${index}`}
              id={grade.id}
              title={grade.title}
              votes={grade.votes}
            />
          );
        })}
      </ul>
    </article>
  );
};

export default Wilder;
