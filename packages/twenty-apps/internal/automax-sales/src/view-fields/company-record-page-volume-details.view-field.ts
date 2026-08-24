import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { VOLUME_DETAILS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-volume-details.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: '61b2dc45-799c-4358-8065-e5546a423e92',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier: VOLUME_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.business.universalIdentifier,
  position: 11,
  isVisible: true,
});
