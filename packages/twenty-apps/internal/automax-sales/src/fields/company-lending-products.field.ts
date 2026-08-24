import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { LENDING_PRODUCT_OPTIONS } from 'src/constants/lender-options';

export const LENDING_PRODUCTS_FIELD_UNIVERSAL_IDENTIFIER =
  'ab848f6d-1d61-44ee-811c-dc4cff5a3724';

export default defineField({
  universalIdentifier: LENDING_PRODUCTS_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.MULTI_SELECT,
  name: 'lendingProducts',
  label: 'Lending products',
  description: 'Loan and home-equity products supported by the lender',
  icon: 'IconHomeDollar',
  isNullable: true,
  options: [...LENDING_PRODUCT_OPTIONS],
});
