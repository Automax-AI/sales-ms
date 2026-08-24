import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CURRENT_VALUATION_PROVIDERS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-current-valuation-providers.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: '68fe844a-7134-4b52-9b72-d70178323e5d',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier:
    CURRENT_VALUATION_PROVIDERS_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.business.universalIdentifier,
  position: 15,
  isVisible: true,
});
