import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER =
  'c5e292b5-d759-4a99-986d-204d0e72a525';
export const CHAMPION_COMPANIES_FIELD_UNIVERSAL_IDENTIFIER =
  'e8cbe3f0-998b-4485-aea5-ddfc4e2f1afb';

export default defineField({
  universalIdentifier: COMPANY_CHAMPION_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.RELATION,
  name: 'champion',
  label: 'Champion',
  description: 'Primary advocate or point of contact at the lender',
  icon: 'IconUserStar',
  relationTargetObjectMetadataUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.person.universalIdentifier,
  relationTargetFieldMetadataUniversalIdentifier:
    CHAMPION_COMPANIES_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'championId',
  },
});
