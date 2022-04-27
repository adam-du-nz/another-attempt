import axios from "axios";
import { getToken } from "../auth/adalConfig";

const buildApiGatewayClient = async () => {
  return axios.create({
    baseURL: process.env.REACT_APP_API_GATEWAY_WEBMERGE_BASE_URL || "/",
    validateStatus: null
  });
};

export const getWebMergeContractPreview = async ({ formId, formType }) => {
  const token = await getToken();
  const apiGatewayClient = await buildApiGatewayClient();
  const data = {
    Input: {
      formId: formId,
      type: formType
    }
  };
  return await apiGatewayClient.post("/", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
