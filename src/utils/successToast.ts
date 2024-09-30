import { notification } from "antd";

const successToast = (message: string, description?: string) =>
  notification.success({
    message,
    description,
    duration: 1,
  });

export default successToast;
