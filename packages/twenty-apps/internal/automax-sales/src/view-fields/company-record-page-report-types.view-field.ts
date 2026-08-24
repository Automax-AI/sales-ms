import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APPRAISAL_REPORT_TYPES_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-appraisal-report-types.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: '15a3d98c-7d57-4f5d-9683-bf7f3d2035e4',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier:
    APPRAISAL_REPORT_TYPES_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.business.universalIdentifier,
  position: 13,
  isVisible: true,
});
