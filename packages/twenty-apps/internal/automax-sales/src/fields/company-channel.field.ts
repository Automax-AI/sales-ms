import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const CHANNEL_FIELD_UNIVERSAL_IDENTIFIER =
  'ccc29858-577f-454b-b68e-a212e40b62b5';

export default defineField({
  universalIdentifier: CHANNEL_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'channel',
  label: 'Channel',
  description: 'How the lender relationship originated',
  icon: 'IconAffiliate',
  isNullable: true,
});
