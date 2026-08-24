import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';

import { SALES_PIPELINE_STAGE_OPTIONS } from 'src/constants/lender-options';
import { COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-champion.field';
import { ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-estimated-monthly-volume.field';
import { MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-market-coverage.field';
import { SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-sales-pipeline-stage.field';

export const LENDER_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER =
  '4db2a2a5-5db0-458c-ab2e-df2d6c1c926f';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

const GROUP_UNIVERSAL_IDENTIFIERS = [
  '516a02ba-951d-462b-a720-d94ba660164a',
  '76f9b7b5-13df-462f-b244-a270a3d4e897',
  '4007f202-8cc3-4916-9a1f-6fd4659079a9',
  'f0119ebb-08a6-4c2f-929c-ad221e028f4c',
  '7ada7f93-35d6-46d1-b060-191872751e44',
  'bf0082ac-2e8c-4da0-aa64-8cc1d262ede0',
] as const;

export default defineView({
  universalIdentifier: LENDER_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Lender Pipeline',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.KANBAN,
  icon: 'IconLayoutKanban',
  position: 0,
  mainGroupByFieldMetadataUniversalIdentifier:
    SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
  fields: [
    {
      universalIdentifier: '87f2860e-df72-49b9-92ea-c8acdbad0306',
      fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '9286e349-3544-4cec-8608-9994cf4bf105',
      fieldMetadataUniversalIdentifier:
        SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
      position: 1,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: 'ed2f658c-e2e4-4dc7-9f16-572f479a5226',
      fieldMetadataUniversalIdentifier:
        COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER,
      position: 2,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: 'af6e660b-7c30-4841-8d30-b0b68b7823b8',
      fieldMetadataUniversalIdentifier:
        ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 3,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: '63469e9e-7087-4ef8-80c9-31a7e7b997f9',
      fieldMetadataUniversalIdentifier:
        MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER,
      position: 4,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: 'b38f1802-0c20-408b-88cd-73417eb78be6',
      fieldMetadataUniversalIdentifier:
        companyFields.accountOwner.universalIdentifier,
      position: 5,
      isVisible: true,
      size: 160,
    },
  ],
  groups: SALES_PIPELINE_STAGE_OPTIONS.map((option, index) => ({
    universalIdentifier: GROUP_UNIVERSAL_IDENTIFIERS[index],
    fieldValue: option.value,
    position: index,
    isVisible: true,
  })),
  filters: [
    {
      universalIdentifier: '63194826-5e36-4042-a157-0b623280dfc5',
      fieldMetadataUniversalIdentifier:
        SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
});
