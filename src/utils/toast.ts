import { toast } from "react-toastify";

export const successToast = (title: string) => toast.success(title);
export const errorToast = (title: string) => toast.error(title);
export const infoToast = (title: string) => toast.info(title);
export const warnToast = (title: string) => toast.warn(title);
