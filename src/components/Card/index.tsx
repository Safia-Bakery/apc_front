import { FC, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import Container from "../Container";
import cl from "classnames";

interface Props extends PropsWithChildren {
  className?: string;
}

const Card: FC<Props> = ({ children, className }) => {
  return (
    <Container>
      <div className={cl(className, styles.card)}>{children}</div>
    </Container>
  );
};

export default Card;
