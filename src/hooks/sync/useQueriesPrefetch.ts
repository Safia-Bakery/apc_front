import { permissionSelector, tokenSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import useBrigadas from "src/hooks/useBrigadas";
import useRoles from "src/hooks/useRoles";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";
import { Departments, MainPermissions } from "src/utils/types";

const categoryPerm =
  MainPermissions.get_apc_category || MainPermissions.get_mark_category;

const useQueriesPrefetch = () => {
  const token = useAppSelector(tokenSelector);
  const permissions = useAppSelector(permissionSelector);

  const { isLoading: rolesLoading } = useRoles({
    enabled: !!token && !!permissions?.[MainPermissions.get_roles],
  });
  const { isLoading: brigadaLoading } = useBrigadas({
    enabled: !!token && !!permissions?.[MainPermissions.get_brigadas],
  });
  const { isLoading: branchLoading } = useBranches({
    enabled: !!token && !!permissions?.[MainPermissions.get_fillials_list],
    origin: 0,
  });
  const { isLoading: categoryLoading } = useCategories({
    enabled: !!token && !!permissions?.[categoryPerm],
  });

  return {
    isLoading:
      (!!permissions?.[MainPermissions.get_roles] && rolesLoading) ||
      (!!permissions?.[MainPermissions.get_brigadas] && brigadaLoading) ||
      (!!permissions?.[MainPermissions.get_fillials_list] && branchLoading) ||
      (!!permissions?.[categoryPerm] && categoryLoading),
  };
};

export default useQueriesPrefetch;
