import {
  pluck,
  values,
  has,
  hasIn,
  __,
  complement,
  allPass,
  pipe,
  uniq,
  filter
} from "ramda";
import { roleUpdateMetaData } from "../../common/roleUpdateMetaData";
import { commonMetaData } from "../../../common/commonMetaData";
import RoleUpdateFormFrontendDto from "../RoleUpdateFormFrontendDto";

const removeNilAndDuplicates = pipe(
  filter(item => item),
  uniq
);

const ALL_METADATA_NAMES = removeNilAndDuplicates(
  values(
    pluck("NAME", [
      ...values(roleUpdateMetaData.employeeDetails),
      ...values(roleUpdateMetaData.changeType),
      ...values(roleUpdateMetaData.newPosition),
      ...values(roleUpdateMetaData.agreementDetails),
      ...values(roleUpdateMetaData.itDetails),
      ...values(commonMetaData),
      ...values(commonMetaData.projectCostCentres),
      ...values(commonMetaData.financeDetails),
      ...values(commonMetaData.phoneSystems),
      ...values(commonMetaData.mobilePhone),
      ...values(commonMetaData.software)
    ])
  )
);

const roleUpdateFormDto = RoleUpdateFormFrontendDto.create();
const dtoHas = has(__, roleUpdateFormDto);
const dtoHasIn = hasIn(__, roleUpdateFormDto);

describe("check whether every meta data entry is included in DTO's own fields", () => {
  const unmatchedKey = [...ALL_METADATA_NAMES].filter(
    eachKey => eachKey && complement(allPass([dtoHas, dtoHasIn]))(eachKey)
  );
  it("should have no unmatched keys", () => {
    expect(unmatchedKey).toStrictEqual([]);
  });
});
