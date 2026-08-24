import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SALES_PIPELINE_STAGE_OPTIONS } from 'src/constants/lender-options';

export const SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER =
  '43746b24-6b24-4d7f-8cf6-7788eb932be4';

export default defineField({
  universalIdentifier: SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.SELECT,
  name: 'salesPipelineStage',
  label: 'Sales pipeline stage',
  description: 'Current stage of the lender relationship',
  icon: 'IconRoute',
  isNullable: true,
  options: [...SALES_PIPELINE_STAGE_OPTIONS],
});
