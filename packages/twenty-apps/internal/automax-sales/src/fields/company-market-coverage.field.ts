import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER =
  'c0f08429-b672-476a-8007-040beef51bde';

export default defineField({
  universalIdentifier: MARKET_COVERAGE_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'marketCoverage',
  label: 'Market coverage',
  description: 'States, regions, or operational locations served',
  icon: 'IconMap',
  isNullable: true,
});
