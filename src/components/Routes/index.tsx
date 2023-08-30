import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import {
  loginHandler,
  logoutHandler,
  permissionHandler,
  tokenSelector,
} from "src/redux/reducers/auth";
import { useEffect } from "react";
import useToken from "src/hooks/useToken";
import BreadCrump from "../BreadCrump";
import useQueriesPrefetch from "src/hooks/sync/useQueriesPrefetch";
import CustomSidebar from "../CustomSidebar";
import Loading from "../Loader";
import useQueryString from "src/hooks/useQueryString";

const Navigation = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user, error, isLoading } = useToken({});
  const tokenKey = useQueryString("key");
  const { pathname, search } = useLocation();
  const { isLoading: appLoading } = useQueriesPrefetch();

  useEffect(() => {
    if (!!user?.permissions.length)
      dispatch(permissionHandler(user?.permissions));
  }, [user?.permissions]);

  useEffect(() => {
    if (!!tokenKey) {
      dispatch(loginHandler(tokenKey));
      navigate(pathname + search);
    }
  }, [tokenKey]);

  if ((isLoading && token) || appLoading) return <Loading />;

  return (
    <>
      <CustomSidebar />
      <BreadCrump />
      <Outlet />
    </>
  );
};

export default Navigation;
