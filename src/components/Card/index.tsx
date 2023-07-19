import { FC, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import Container from "../Container";
import cl from "classnames";

const Card: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Container>
      <div className={cl(styles.card, "overflow-hidden")}>{children}</div>
    </Container>
  );
};

export default Card;
