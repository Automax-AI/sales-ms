import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { CHANNEL_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-channel.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: 'ba80571f-d482-48e4-b8ba-7166cc72f1e6',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier: CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.system.universalIdentifier,
  position: 5,
  isVisible: true,
});
