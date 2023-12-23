import { useLocation } from "react-router-dom";

const useUpdateQueryStr = (query: string) => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const element = searchParams.get(query);

  return element;
};
export default useUpdateQueryStr;
