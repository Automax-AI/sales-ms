import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-champion.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: '1964bc05-3d93-4550-b29c-71db9bddd167',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier: COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.contact.universalIdentifier,
  position: 10,
  isVisible: true,
});
