import { notification } from "antd";

const warnToast = (message: string, description?: string) =>
  notification.warning({
    message,
    description,
    duration: 3,
  });

export default warnToast;
