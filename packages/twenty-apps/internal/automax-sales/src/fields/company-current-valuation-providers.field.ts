import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { VALUATION_PROVIDER_OPTIONS } from 'src/constants/lender-options';

export const CURRENT_VALUATION_PROVIDERS_FIELD_UNIVERSAL_IDENTIFIER =
  '5612c9c5-d5d9-4aa0-9903-aaec6faedee3';

export default defineField({
  universalIdentifier: CURRENT_VALUATION_PROVIDERS_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'currentValuationProviders',
  label: 'Current valuation providers',
  description: 'AMCs, panels, and valuation providers used today',
  icon: 'IconBuildingBank',
  isNullable: true,
  options: [...VALUATION_PROVIDER_OPTIONS],
});
