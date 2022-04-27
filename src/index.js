import { runWithAdal } from "react-adal";

import { authContext } from "./auth/adalConfig";

runWithAdal(
  authContext,
  () => {
    require("./indexApp.jsx");
  },
  process.env.REACT_APP_SKIP_LOGIN === "true"
);
