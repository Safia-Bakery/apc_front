import { notification } from "antd";

const errorToast = (message: string, description?: string) =>
  notification.error({
    message,
    description,
    duration: 3,
  });

export default errorToast;
