import { Cascader, CascaderAutoProps } from "antd";
import { PropsWithChildren } from "react";

const AntCascader = ({ ...props }: PropsWithChildren<CascaderAutoProps>) => {
  return <Cascader changeOnSelect {...props} />;
};

export default AntCascader;
