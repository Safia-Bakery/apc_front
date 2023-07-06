import { store } from "src/redux/rootConfig";
import APIClient from "./axiosConfig";
const token = store.getState().auth.token;

const apiClient = new APIClient("http://185.74.5.198:8000", token);

export default apiClient;
