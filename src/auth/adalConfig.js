import { AuthenticationContext, adalGetToken } from "react-adal";

export const adalConfig = {
  tenant: process.env.REACT_APP_TENANT_ID,
  clientId: process.env.REACT_APP_CLIENT_ID,
  cacheLocation: "localStorage",
  endpoints: {
    api: "" // TODO no idea what's this yet
  },
  callback: console.log, // adal need callback when call adalGetToken.
  loadFrameTimeout: 30000, // adal need timeout value, set to 30 seconds
  redirectUri: window.location.origin
};

export const authContext = new AuthenticationContext(adalConfig);

export const getToken = async () => {
  // adalGetToken first will get token from cache, if it expire it will require new token.
  if (process.env.REACT_APP_SKIP_LOGIN === "true")
    return window.localStorage.getItem("mockToken");
  try {
    return await adalGetToken(authContext, adalConfig.clientId);
  } catch (error) {
    console.log("line 20, getToken error:", error);
  }
};
