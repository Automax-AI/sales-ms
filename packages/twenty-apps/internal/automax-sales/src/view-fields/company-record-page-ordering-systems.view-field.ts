import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ORDERING_SYSTEMS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-ordering-systems.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: '428b0671-b84c-4a4a-922b-fefb651e0533',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier: ORDERING_SYSTEMS_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.business.universalIdentifier,
  position: 16,
  isVisible: true,
});
