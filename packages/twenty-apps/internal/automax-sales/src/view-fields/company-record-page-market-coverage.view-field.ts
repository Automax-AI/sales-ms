import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-market-coverage.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: 'f279eda7-83d7-4733-a5b7-f24bf50b77e7',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier: MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.business.universalIdentifier,
  position: 12,
  isVisible: true,
});
