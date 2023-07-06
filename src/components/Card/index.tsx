import { FC, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import Container from "../Container";

const Card: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <div className={styles.card}>{children}</div>
    </Container>
  );
};

export default Card;
