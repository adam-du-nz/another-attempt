import React, { useState } from "react";

const StatusContext = React.createContext([{ disabled: false }, () => {}]);

const StatusProvider = props => {
  const [status, setStatus] = useState({ disabled: false });
  return (
    <StatusContext.Provider value={[status, setStatus]}>
      {props.children}
    </StatusContext.Provider>
  );
};

export { StatusContext, StatusProvider };
