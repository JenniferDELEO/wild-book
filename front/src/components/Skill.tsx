import { ISkill } from "../interfaces/interfaces";

const Skill = ({ title, votes }: ISkill) => {
  return (
    <li>
      {title}
      <span className="votes">{votes}</span>
    </li>
  );
};

export default Skill;
