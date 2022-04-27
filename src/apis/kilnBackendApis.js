import { stringify } from "query-string";
import axios from "axios";

import { getToken } from "../auth/adalConfig";
import UserFactory from "../factories/UserFactory";

const buildKilnBackendClient = async () => {
  const token = await getToken();
  return axios.create({
    baseURL: process.env.REACT_APP_KILN_BACKEND_BASEURL || "/",
    headers: {
      Authorization: `Bearer ${token}`
    },
    validateStatus: null
  });
};

export const getCurrentUser = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/users/current");
};

export const getUsers = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/users");
};

export const getUsersClass = async () => {
  const response = await getUsers();
  return UserFactory.createFromArray(response.data);
};

export const checkPermission = async type => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(`/api/forms/${type}/authority`);
};

/************** FILES ENDPOINTS ********************/
export const uploadFile = async file => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post("/api/files", file, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const getDownloadLink = async query => {
  const kilnBackendClient = await buildKilnBackendClient();
  return (await kilnBackendClient.get(`/api/files?${stringify(query)}`)).data;
};

/************** DEPARTURE ENDPOINTS ********************/
export const submitDepartureForm = async data => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post("/api/departure-forms", data);
};

export const submitEditDepartureForm = async (id, data) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(`/api/departure-forms/${id}`, data);
};

export const cancelDepartureForm = async (formId, cancelReason) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/departure-forms/${formId}/cancel`,
    {
      cancelReason
    }
  );
};

export const getForms = async query => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(
    `/api/departure-forms?${stringify(query)}`
  );
};

export const getDepartureFormByIdResponse = async formId => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(`/api/departure-forms/${formId}`);
};

/************** PARENTAL LEAVE ENDPOINTS ********************/
export const submitParentalLeaveForm = async data => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post("/api/parental-leave-forms", data);
};

/************** THIRD-PARTY CONTRACTOR ENDPOINTS ********************/
export const submitThirdPartyContractorForm = async data => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post(
    "/api/third-party-contractor-forms",
    data
  );
};

/************** ORGANISATION ENDPOINTS ********************/

export const getFunctions = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/org/functions");
};

export const getVerticals = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/org/verticals");
};

export const getCostCentres = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/org/cost-centres");
};

export const getProjectCostCentres = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/org/project-cost-centres");
};

export const getPositionTitles = async () => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get("/api/org/position-titles");
};

/************** ONBOARDING ENDPOINTS ********************/
export const getOnboardingFormByCornerstoneId = async (
  jobReqId,
  applicantId
) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(
    `/api/onboarding-forms/cs/${jobReqId}/applicant/${applicantId}`
  );
};

export const getOnboardingFormById = async id => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(`/api/onboarding-forms/${id}`);
};

export const submitOnboardingForm = async data => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post("/api/onboarding-forms", data);
};

export const updateOnboardingForm = async (formId, data) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(`/api/onboarding-forms/${formId}`, data);
};

export const requestUpdateToOnboardingForm = async (
  formId,
  updateRequestReason
) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post(
    `/api/onboarding-forms/ticket/${formId}`,
    { data: updateRequestReason }
  );
};

export const getOnboardingForms = async query => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(
    `/api/onboarding-forms?${stringify(query)}`
  );
};

export const cancelOnboardingForm = async (formId, cancelReason) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/onboarding-forms/${formId}/cancel`,
    {
      cancelReason
    }
  );
};

export const reopenOnboardingForm = async formId => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/onboarding-forms/${formId}/reopen`
  );
};

export const skipOnboardingContract = async (formId, data) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/onboarding-forms/${formId}/skip`,
    data
  );
};

export const skipOnboardingContractAndEmploymentForms = async (
  formId,
  data
) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/onboarding-forms/${formId}/skip-form`,
    data
  );
};

export const checkPermissionForOnboarding = async id => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(`/api/onboarding-forms/authority/${id}`);
};

/************** ROLE UPDATE ENDPOINTS ********************/

export const submitRoleUpdateForm = async data => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.post("/api/role-update-forms", data);
};

export const checkPermissionForRoleUpdate = async id => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(`/api/role-update-forms/authority/${id}`);
};

export const getRoleUpdateFormById = async id => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(`/api/role-update-forms/${id}`);
};

export const updateRoleUpdateForm = async (formId, data) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/role-update-forms/${formId}`,
    data
  );
};

export const cancelRoleUpdateForm = async (formId, cancelReason) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/role-update-forms/${formId}/cancel`,
    {
      cancelReason
    }
  );
};

export const reopenRoleUpdateForm = async id => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(`/api/role-update-forms/${id}/reopen`);
};

export const skipRoleUpdateContract = async (formId, data) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/role-update-forms/${formId}/skip`,
    data
  );
};

export const skipRoleUpdateContractAndEmploymentForms = async (
  formId,
  data
) => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.patch(
    `/api/role-update-forms/${formId}/skip-form`,
    data
  );
};

export const getRoleUpdateForms = async query => {
  const kilnBackendClient = await buildKilnBackendClient();
  return await kilnBackendClient.get(
    `/api/role-update-forms?${stringify(query)}`
  );
};
