import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AddInventoryRequest = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/tg/inventory-request/type", { replace: true });
  }, []);

  return null;
};

export default AddInventoryRequest;
