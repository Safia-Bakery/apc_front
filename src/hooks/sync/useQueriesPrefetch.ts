import { permissionSelector, tokenSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import useBrigadas from "src/hooks/useBrigadas";
import useRoles from "src/hooks/useRoles";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";
import { MainPerm } from "src/utils/types";

const useQueriesPrefetch = () => {
  const token = useAppSelector(tokenSelector);
  const permissions = useAppSelector(permissionSelector);

  const { isLoading: rolesLoading } = useRoles({
    enabled: !!token && permissions?.[MainPerm.get_roles],
  });
  const { isLoading: brigadaLoading } = useBrigadas({
    enabled: !!token && permissions?.[MainPerm.get_brigadas],
  });
  const { isLoading: branchLoading } = useBranches({
    enabled: !!token && permissions?.[MainPerm.get_fillials_list],
    origin: 0,
  });
  const { isLoading: categoryLoading } = useCategories({
    enabled: !!token && permissions?.[MainPerm.get_category],
  });

  return {
    isLoading:
      (permissions?.[MainPerm.get_roles] && rolesLoading) ||
      (permissions?.[MainPerm.get_brigadas] && brigadaLoading) ||
      (permissions?.[MainPerm.get_fillials_list] && branchLoading) ||
      (permissions?.[MainPerm.get_category] && categoryLoading),
  };
};

export default useQueriesPrefetch;
