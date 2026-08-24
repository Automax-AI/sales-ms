import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ORDERING_SYSTEM_OPTIONS } from 'src/constants/lender-options';

export const ORDERING_SYSTEMS_FIELD_UNIVERSAL_IDENTIFIER =
  '38ba52b0-a90b-443a-9f38-7838c5dc9b5a';

export default defineField({
  universalIdentifier: ORDERING_SYSTEMS_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'orderingSystems',
  label: 'Ordering systems',
  description: 'LOS and appraisal ordering systems in the current workflow',
  icon: 'IconApiApp',
  isNullable: true,
  options: [...ORDERING_SYSTEM_OPTIONS],
});
