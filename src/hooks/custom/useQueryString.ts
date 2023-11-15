import { useLocation } from "react-router-dom";

const useQueryString = (query: string) => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const element = searchParams.get(query);

  return element;
};
export default useQueryString;
