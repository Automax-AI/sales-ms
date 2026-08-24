import {
  defineField,
  FieldType,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CHAMPION_COMPANIES_FIELD_UNIVERSAL_IDENTIFIER,
  COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER,
} from './company-champion.field';

export default defineField({
  universalIdentifier: CHAMPION_COMPANIES_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  type: FieldType.RELATION,
  name: 'championCompanies',
  label: 'Companies championed',
  icon: 'IconBuildingCommunity',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.ONE_TO_MANY,
  },
});
