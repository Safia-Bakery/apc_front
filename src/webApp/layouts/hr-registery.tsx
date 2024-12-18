import { Outlet } from "react-router-dom";

const HrRegisterty = () => {
  return (
    <div className="absolute inset-0 bg-white h-full overflow-y-auto">
      <Outlet />
    </div>
  );
};

export default HrRegisterty;
