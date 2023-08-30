import { Outlet } from "react-router-dom";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector, tokenSelector } from "src/redux/reducers/auth";
import useToken from "src/hooks/useToken";
import BreadCrump from "../BreadCrump";
import useQueriesPrefetch from "src/hooks/sync/useQueriesPrefetch";
import CustomSidebar from "../CustomSidebar";
import Loading from "../Loader";

const Navigation = () => {
  const token = useAppSelector(tokenSelector);
  const { isLoading } = useToken({});
  const { isLoading: appLoading } = useQueriesPrefetch();
  const permission = useAppSelector(permissionSelector);

  if ((isLoading && token) || appLoading) return <Loading />;

  return (
    <>
      {!!permission && <CustomSidebar />}
      <BreadCrump />
      <Outlet />
    </>
  );
};

export default Navigation;
