import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-estimated-monthly-volume.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: '9f6e8c6e-762d-430a-9d3a-3af42a55ec93',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier:
    ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.business.universalIdentifier,
  position: 10,
  isVisible: true,
});
