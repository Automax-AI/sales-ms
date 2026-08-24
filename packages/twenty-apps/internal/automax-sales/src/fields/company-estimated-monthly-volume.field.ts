import {
  defineField,
  FieldType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

export const ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER =
  '5c35ddc6-4ef9-4035-9915-8d5a3835cec3';

export default defineField({
  universalIdentifier: ESTIMATED_MONTHLY_VOLUME_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  type: FieldType.NUMBER,
  name: 'estimatedMonthlyVolume',
  label: 'Estimated monthly volume',
  description: 'Estimated appraisal orders per month',
  icon: 'IconChartBar',
  isNullable: true,
});
