import { useState } from "react";
import "./App.css";
import Wilder from "./components/Wilder";
import AddWilder from "./components/AddWilder";
import { useQuery, gql } from "@apollo/client";
import {
  IncomingWilder,
  IWilderData,
  IWilderToEdit,
} from "./interfaces/interfaces";
import { Route, Routes } from "react-router-dom";
import SkillsList from "./components/SkillsList";

export const refactorData = (data: IncomingWilder[]): IWilderData[] => {
  return data.map((wilder: IncomingWilder) => {
    const refactoredSkills = wilder.grades.map((grade) => {
      return {
        id: grade.id,
        title: grade.skill.title,
        votes: grade.grade,
      };
    });
    return {
      id: wilder.id,
      name: wilder.name,
      city: wilder.city,
      description: wilder.description,
      grades: refactoredSkills,
    };
  });
};

export const GET_WILDERS = gql`
  query getAllWilders {
    getAllWilders {
      id
      name
      description
      city
      grades {
        id
        grade
        skill {
          title
        }
      }
    }
  }
`;

const App = () => {
  const [addNewWilder, setAddNewWilder] = useState(false);
  const [wilderToEdit, setWilderToEdit] = useState<IWilderToEdit>({
    isEditing: false,
    editName: "",
    editCity: "",
    editDescription: "",
    editGrades: [],
  });

  const { loading, error, data } = useQuery(GET_WILDERS);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue :(</p>;

  const Home = () => {
    return (
      <>
        <div className="topActions">
          <button
            onClick={() => {
              setWilderToEdit({
                isEditing: false,
                editName: "",
                editCity: "",
                editDescription: "",
                editGrades: [],
              });
              setAddNewWilder(!addNewWilder);
            }}
          >
            {addNewWilder
              ? "Annuler l'ajout"
              : wilderToEdit.isEditing
              ? "Sauvegarder le Wilder"
              : "Ajouter un nouveau Wilder"}
          </button>
        </div>
        {addNewWilder && (
          <AddWilder
            isEditing={Object.hasOwn(wilderToEdit, "editId")}
            setWilderToEdit={setWilderToEdit}
            setAddNewWilder={setAddNewWilder}
            wilders={refactorData(data.getAllWilders)}
            editId={wilderToEdit.editId}
            editName={wilderToEdit.editName}
            editCity={wilderToEdit.editCity}
            editDescription={wilderToEdit.editDescription}
            editGrades={wilderToEdit.editGrades}
          />
        )}
        <h2>Wilders</h2>
        <section className="card-row">
          {refactorData(data.getAllWilders).map(
            (wilder: IWilderData, index: number) => {
              return (
                <Wilder
                  key={`wilder-${index}`}
                  id={wilder.id}
                  name={wilder.name}
                  city={wilder.city}
                  description={wilder.description}
                  grades={wilder.grades}
                  setAddNewWilder={setAddNewWilder}
                  setWilderToEdit={setWilderToEdit}
                  wilders={refactorData(data.getAllWilders)}
                />
              );
            }
          )}
        </section>
      </>
    );
  };

  return (
    <div>
      <header>
        <div className="container header">
          <h1>Wilders Book</h1>
          <div className="links">
            <a href="/">Accueil</a>
            <a href="/skills">Compétences</a>
          </div>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="skills" element={<SkillsList />} />
        </Routes>
      </main>
      <footer>
        <div className="container">
          <p>&copy; 2022 Wild Code School</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
