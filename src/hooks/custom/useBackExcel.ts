import { baseURL } from "@/main";

// useBackExcel
const useBackExcel = (excel: string) => {
  const url = `${baseURL}/${excel}`;
  const a = document.createElement("a");
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default useBackExcel;
