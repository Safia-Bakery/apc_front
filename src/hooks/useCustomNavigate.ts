import { useLocation, useNavigate } from "react-router-dom";

export const useNavigateParams = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const navigation = (options: { [key: string]: any }) => {
    const queryParams = new URLSearchParams(search);

    for (const [key, value] of Object.entries(options)) {
      queryParams.set(key, value);
    }

    navigate(`?${queryParams.toString()}`);
  };
  return navigation;
};

export const useRemoveParams = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const navigation = (remove: string[]) => {
    const searchParams = new URLSearchParams(search);
    remove.map((item) => searchParams.delete(item));
    navigate({ search: searchParams.toString() });
  };

  return navigation;
};
