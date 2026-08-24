import {
  defineViewField,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import { SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-sales-pipeline-stage.field';

const recordPage =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields;

export default defineViewField({
  universalIdentifier: 'aa5c5623-8c6b-41e3-b4be-bce04c94f093',
  viewUniversalIdentifier: recordPage.universalIdentifier,
  fieldMetadataUniversalIdentifier:
    SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
  viewFieldGroupUniversalIdentifier:
    recordPage.viewFieldGroups.general.universalIdentifier,
  position: 10,
  isVisible: true,
});
