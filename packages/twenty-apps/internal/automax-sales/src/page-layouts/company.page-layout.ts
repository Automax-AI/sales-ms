import {
  definePageLayout,
  PageLayoutTabLayoutMode,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

const companyRecordPageFieldsViewIdentifier =
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.views.companyRecordPageFields
    .universalIdentifier;

export default definePageLayout({
  universalIdentifier: 'ea00b537-955b-4643-b785-1f7ded232a17',
  name: 'Lender Record Page',
  type: 'RECORD_PAGE',
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.company.universalIdentifier,
  tabs: [
    {
      universalIdentifier: '0f532c0f-8a20-4c77-bdbd-05ffa4dea78e',
      title: 'Lender',
      position: 10,
      icon: 'IconBuildingBank',
      layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
      widgets: [
        {
          universalIdentifier: '4f2abe0d-d417-4408-bd51-fa6c77bc8f80',
          title: 'Fields',
          type: 'FIELDS',
          configuration: {
            configurationType: 'FIELDS',
            viewUniversalIdentifier: companyRecordPageFieldsViewIdentifier,
          },
        },
      ],
    },
    {
      universalIdentifier: '2d1b8974-2654-4aa0-b679-623658045db3',
      title: 'Timeline',
      position: 20,
      icon: 'IconTimelineEvent',
      layoutMode: PageLayoutTabLayoutMode.CANVAS,
      widgets: [
        {
          universalIdentifier: '9680bdba-97f1-40dd-8aba-ef19385afc4b',
          title: 'Timeline',
          type: 'TIMELINE',
          configuration: {
            configurationType: 'TIMELINE',
          },
        },
      ],
    },
  ],
});
