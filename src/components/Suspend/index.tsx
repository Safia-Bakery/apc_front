import { FC, PropsWithChildren, Suspense } from "react";
import Loading from "../Loader";

const Suspend: FC<PropsWithChildren> = ({ children }) => {
  return <Suspense fallback={<Loading absolute />}>{children}</Suspense>;
};

export default Suspend;
