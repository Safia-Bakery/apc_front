import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "src/store/utils/types";
import { logoutHandler, tokenSelector } from "src/store/reducers/auth";
import { Outlet, useNavigate } from "react-router-dom";
import useToken from "src/hooks/useToken";
import Loading from "../Loader";
import CustomSidebar from "../Sidebar";
import BreadCrump from "../BreadCrump";
import {
  permissionHandler,
  permissionSelector,
  sidebarItemsHandler,
  sidebatItemsSelector,
} from "src/store/reducers/sidebar";
import useUpdateEffect from "src/hooks/useUpdateEffect";

const normalizeURL = (path: string) =>
  path.replace(/\/+/g, "/").replace(/\/$/, "");

const WebRooutes = () => {
  const token = useAppSelector(tokenSelector);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const permission = useAppSelector(permissionSelector);
  const { error, data: user, isLoading } = useToken({});

  const sidebarItems = useAppSelector(sidebatItemsSelector);

  useEffect(() => {
    if (!token) navigate("/login");
    if (!!error) dispatch(logoutHandler());
  }, [token, error]);

  const renderSidebar = useMemo(() => {
    if (!!permission && !!token)
      return (
        <>
          <CustomSidebar />
          <BreadCrump />
        </>
      );
  }, [permission, token]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const normalizedPath = normalizeURL(currentPath);
    if (currentPath !== normalizedPath)
      navigate(normalizedPath, { replace: true });

    if (window.location.pathname === "/") navigate("/home");
  }, []);

  useEffect(() => {
    if (!!user?.permissions.length && !!token)
      dispatch(permissionHandler(user?.permissions));
  }, [user?.permissions, token]);

  useUpdateEffect(() => {
    if (permission) dispatch(sidebarItemsHandler());
  }, [permission]);

  if ((isLoading || !sidebarItems?.length) && token)
    return <Loading absolute />;

  return (
    <>
      {renderSidebar}
      <div className="flex flex-col flex-1">
        <Outlet />
      </div>
    </>
  );
};

export default WebRooutes;