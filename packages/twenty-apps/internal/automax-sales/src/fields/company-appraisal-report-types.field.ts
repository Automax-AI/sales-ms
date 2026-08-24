import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { APPRAISAL_REPORT_TYPE_OPTIONS } from 'src/constants/lender-options';

export const APPRAISAL_REPORT_TYPES_FIELD_UNIVERSAL_IDENTIFIER =
  '29ec7cf2-8e7f-4b56-9dd4-13c0ddee1f84';

export default defineField({
  universalIdentifier: APPRAISAL_REPORT_TYPES_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'appraisalReportTypes',
  label: 'Appraisal report types',
  description: 'Current or evaluated valuation report formats',
  icon: 'IconFileDescription',
  isNullable: true,
  options: [...APPRAISAL_REPORT_TYPE_OPTIONS],
});
