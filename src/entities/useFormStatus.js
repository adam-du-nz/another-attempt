import { useContext } from "react";
import { StatusContext } from "./StatusContext";

const useFormStatus = () => {
  // eslint-disable-next-line no-unused-vars
  const [status, setStatus] = useContext(StatusContext);

  function toggleStatus() {
    setStatus(status => ({ ...status, disabled: !status.disabled }));
  }

  return {
    toggleStatus
  };
};

export default useFormStatus;
