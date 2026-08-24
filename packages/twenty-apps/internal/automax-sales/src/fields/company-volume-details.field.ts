import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const VOLUME_DETAILS_FIELD_UNIVERSAL_IDENTIFIER =
  '856804b7-b383-4981-906d-f0c2620d9ba6';

export default defineField({
  universalIdentifier: VOLUME_DETAILS_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.TEXT,
  name: 'volumeDetails',
  label: 'Volume details',
  description: 'Source range, cadence, and relevant volume context',
  icon: 'IconNotes',
  isNullable: true,
});
