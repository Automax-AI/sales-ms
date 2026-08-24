import {
  defineView,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
  ViewFilterOperand,
  ViewType,
} from 'twenty-sdk/define';

import { APPRAISAL_REPORT_TYPES_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-appraisal-report-types.field';
import { CHANNEL_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-channel.field';
import { COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-champion.field';
import { CURRENT_VALUATION_PROVIDERS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-current-valuation-providers.field';
import { ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-estimated-monthly-volume.field';
import { LENDING_PRODUCTS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-lending-products.field';
import { MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-market-coverage.field';
import { ORDERING_SYSTEMS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-ordering-systems.field';
import { SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-sales-pipeline-stage.field';
import { VOLUME_DETAILS_FIELD_UNIVERSAL_IDENTIFIER } from 'src/fields/company-volume-details.field';

export const LENDERS_VIEW_UNIVERSAL_IDENTIFIER =
  '3caa2b25-5165-4ed3-92e9-102a84549fc7';

const companyFields = STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.fields;

export default defineView({
  universalIdentifier: LENDERS_VIEW_UNIVERSAL_IDENTIFIER,
  name: 'Lenders',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: ViewType.TABLE,
  icon: 'IconBuildingBank',
  position: 1,
  fields: [
    {
      universalIdentifier: '4281d2b1-3515-4bf8-a929-235c6becf5ab',
      fieldMetadataUniversalIdentifier: companyFields.name.universalIdentifier,
      position: 0,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: '46821a0e-709e-4820-b576-71cec5789d24',
      fieldMetadataUniversalIdentifier:
        SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
      position: 1,
      isVisible: true,
      size: 190,
    },
    {
      universalIdentifier: '5360b102-22e2-4694-a347-9af37e4be581',
      fieldMetadataUniversalIdentifier:
        companyFields.accountOwner.universalIdentifier,
      position: 2,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: '3b7785b6-5843-46ff-8244-cfdf48804f77',
      fieldMetadataUniversalIdentifier:
        COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER,
      position: 3,
      isVisible: true,
      size: 160,
    },
    {
      universalIdentifier: '342e9adb-33aa-4f5a-8ff3-5f03f416bdf7',
      fieldMetadataUniversalIdentifier:
        ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER,
      position: 4,
      isVisible: true,
      size: 140,
    },
    {
      universalIdentifier: '4f393768-d590-4bca-b0ab-e754c4a4bc1c',
      fieldMetadataUniversalIdentifier:
        VOLUME_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 5,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '2f9322fa-df37-4640-b15f-e740660c9097',
      fieldMetadataUniversalIdentifier:
        MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER,
      position: 6,
      isVisible: true,
      size: 180,
    },
    {
      universalIdentifier: '0b1381fe-5a5e-46f8-9703-1a68a70dedf4',
      fieldMetadataUniversalIdentifier: CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
      position: 7,
      isVisible: true,
      size: 188,
    },
    {
      universalIdentifier: '024f3ca0-f3ce-4e16-a769-4d2b816d7d6d',
      fieldMetadataUniversalIdentifier:
        APPRAISAL_REPORT_TYPES_FIELD_UNIVERSAL_IDENTIFIER,
      position: 8,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: '344a6237-1255-4e2b-86be-74252a9e75bb',
      fieldMetadataUniversalIdentifier:
        LENDING_PRODUCTS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 9,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: '1f383185-babf-48b5-a0a1-3c2bb36bc414',
      fieldMetadataUniversalIdentifier:
        CURRENT_VALUATION_PROVIDERS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 10,
      isVisible: true,
      size: 220,
    },
    {
      universalIdentifier: 'd03a9f7b-9a3a-45ed-8cf9-12059a8b7dcf',
      fieldMetadataUniversalIdentifier:
        ORDERING_SYSTEMS_FIELD_UNIVERSAL_IDENTIFIER,
      position: 11,
      isVisible: true,
      size: 200,
    },
    {
      universalIdentifier: 'e1f20537-f65e-4201-ba2c-a2a179c80649',
      fieldMetadataUniversalIdentifier:
        companyFields.noteTargets.universalIdentifier,
      position: 12,
      isVisible: true,
      size: 180,
    },
  ],
  filters: [
    {
      universalIdentifier: 'f242c981-a910-4a9e-b5ca-a1df4b048f57',
      fieldMetadataUniversalIdentifier:
        SALES_PIPELINE_STAGE_FIELD_UNIVERSAL_IDENTIFIER,
      operand: ViewFilterOperand.IS_NOT_EMPTY,
      value: '',
    },
  ],
});
