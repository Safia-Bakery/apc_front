import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

const Brigades = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <Card>
      <Header title={"Brigades"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
    </Card>
  );
};

export default Brigades;
