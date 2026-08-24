export const SALES_PIPELINE_STAGE = {
  NOT_REACHED_OUT: 'NOT_REACHED_OUT',
  FIRST_CALL: 'FIRST_CALL',
  GATHERING_DATA: 'GATHERING_DATA',
  TRIAL_APPRAISAL: 'TRIAL_APPRAISAL',
  PILOT: 'PILOT',
  PRODUCTION: 'PRODUCTION',
} as const;

export type SalesPipelineStage =
  (typeof SALES_PIPELINE_STAGE)[keyof typeof SALES_PIPELINE_STAGE];

export const SALES_PIPELINE_STAGE_OPTIONS = [
  {
    id: '289cb03e-ddff-4640-98a5-9f6ecc9f29a9',
    value: SALES_PIPELINE_STAGE.NOT_REACHED_OUT,
    label: 'Not reached out',
    position: 0,
    color: 'gray' as const,
  },
  {
    id: 'f66156c5-2ea8-4068-8987-9e5a79ae3efa',
    value: SALES_PIPELINE_STAGE.FIRST_CALL,
    label: 'First Call',
    position: 1,
    color: 'blue' as const,
  },
  {
    id: 'a73b021d-cb8a-4f6c-8ad0-2d223e9ad044',
    value: SALES_PIPELINE_STAGE.GATHERING_DATA,
    label: 'Gathering Data',
    position: 2,
    color: 'yellow' as const,
  },
  {
    id: 'bd454c0d-ca06-4cb6-a920-0a1690119942',
    value: SALES_PIPELINE_STAGE.TRIAL_APPRAISAL,
    label: 'Trial appraisal scheduled/done',
    position: 3,
    color: 'orange' as const,
  },
  {
    id: '07788b6d-6023-4f79-b72e-5ae39faf0259',
    value: SALES_PIPELINE_STAGE.PILOT,
    label: 'Pilot',
    position: 4,
    color: 'purple' as const,
  },
  {
    id: '76a8bc73-e461-485d-b7ce-f75ce9dffaa0',
    value: SALES_PIPELINE_STAGE.PRODUCTION,
    label: 'Production',
    position: 5,
    color: 'green' as const,
  },
] as const;

export const APPRAISAL_REPORT_TYPE_OPTIONS = [
  {
    id: '76a535f0-2507-45cd-b389-c94e61c03c94',
    value: 'FULL_APPRAISAL',
    label: 'Full appraisal',
    position: 0,
    color: 'blue' as const,
  },
  {
    id: '1f325fdd-7ef9-4d47-a62f-24ede6de6ac0',
    value: 'DESKTOP',
    label: 'Desktop',
    position: 1,
    color: 'cyan' as const,
  },
  {
    id: 'f3b61c87-8b23-4987-bf90-6ce6c274c481',
    value: 'HYBRID',
    label: 'Hybrid',
    position: 2,
    color: 'purple' as const,
  },
  {
    id: 'c8d489e7-874d-491e-b7f2-538f042eb6b4',
    value: 'SELF_INSPECTION_HYBRID',
    label: 'Self-inspection hybrid',
    position: 3,
    color: 'pink' as const,
  },
  {
    id: 'a4b250ec-8e33-4aca-b946-7e52a2af959e',
    value: 'PDR',
    label: 'PDR',
    position: 4,
    color: 'orange' as const,
  },
  {
    id: '42e8d72c-f4dc-47d3-9646-68b4b6f595c3',
    value: 'CDA',
    label: 'CDA',
    position: 5,
    color: 'yellow' as const,
  },
  {
    id: 'eb55bb80-c150-46d0-8612-d928e490ae3c',
    value: 'PCR',
    label: 'PCR',
    position: 6,
    color: 'lime' as const,
  },
  {
    id: '60a2c4b9-9772-4894-8de2-4f5f7608f702',
    value: 'AVM',
    label: 'AVM',
    position: 7,
    color: 'gray' as const,
  },
  {
    id: '43fdf7bc-cc03-4c69-b46e-805141b690a9',
    value: 'UAD_3_6',
    label: 'UAD 3.6',
    position: 8,
    color: 'green' as const,
  },
  {
    id: 'b6e3280a-ba76-4cdb-8163-728a563e39d0',
    value: 'PDC',
    label: 'PDC',
    position: 9,
    color: 'red' as const,
  },
  {
    id: '9c2d1f16-34ba-46eb-ab48-a709457bd090',
    value: 'FORM_1004',
    label: '1004',
    position: 10,
    color: 'blue' as const,
  },
] as const;

export const LENDING_PRODUCT_OPTIONS = [
  {
    id: '094032ee-eeb3-4e9e-b72d-38874b7133e6',
    value: 'CONVENTIONAL',
    label: 'Conventional',
    position: 0,
    color: 'blue' as const,
  },
  {
    id: '9f4a9ac2-e8d8-41eb-87a7-40fd2533ffe4',
    value: 'GOVERNMENT',
    label: 'Government',
    position: 1,
    color: 'gray' as const,
  },
  {
    id: 'cfa18e78-3e38-440c-9065-9c401e487fa0',
    value: 'VA',
    label: 'VA',
    position: 2,
    color: 'green' as const,
  },
  {
    id: '6c32ce49-938f-4847-97e4-045b302a9627',
    value: 'NON_QM',
    label: 'Non-QM',
    position: 3,
    color: 'orange' as const,
  },
  {
    id: '9730e8b9-131c-4a90-a14b-b19d24e7bb52',
    value: 'HEI',
    label: 'Home equity investment',
    position: 4,
    color: 'purple' as const,
  },
  {
    id: '3cacbd19-98fb-469c-a3ed-44a40be2d37e',
    value: 'BRIDGE',
    label: 'Bridge',
    position: 5,
    color: 'yellow' as const,
  },
  {
    id: '5f88472f-e5ac-4dd2-ace4-2aef34c9291f',
    value: 'CASH_OFFER',
    label: 'Cash offer',
    position: 6,
    color: 'pink' as const,
  },
  {
    id: '6453c8b3-f7e4-4b77-877e-6b5536562b7d',
    value: 'REFINANCE',
    label: 'Refinance',
    position: 7,
    color: 'cyan' as const,
  },
  {
    id: 'eb844861-4e40-4c28-8bf7-6e7eaff0930a',
    value: 'HOME_EQUITY',
    label: 'Home equity',
    position: 8,
    color: 'red' as const,
  },
] as const;

export const VALUATION_PROVIDER_OPTIONS = [
  {
    id: '7cc7e4ef-be6d-490b-bde5-51c925dfaa53',
    value: 'E_STREET',
    label: 'E-Street AMC',
    position: 0,
    color: 'blue' as const,
  },
  {
    id: '7a9eafa9-3338-4f38-8e47-e56bbcfc3845',
    value: 'MERCURY_PANEL',
    label: 'Mercury panel',
    position: 1,
    color: 'cyan' as const,
  },
  {
    id: '56a979bc-55d0-4824-9cb6-8d2e77b5114a',
    value: 'REGGORA',
    label: 'Reggora',
    position: 2,
    color: 'purple' as const,
  },
  {
    id: 'f391561d-e841-4121-a2d5-3abab3b6844c',
    value: 'CLEAR_CAPITAL',
    label: 'Clear Capital',
    position: 3,
    color: 'orange' as const,
  },
  {
    id: '3201c6b9-438c-4b64-a2aa-c5b08be3d7df',
    value: 'APPRAISAL_WORKS',
    label: 'AppraisalWorks',
    position: 4,
    color: 'yellow' as const,
  },
  {
    id: '772d5f4c-61c5-4ffc-bf8a-dd580b96ff17',
    value: 'ACCURATE_GROUP',
    label: 'Accurate Group',
    position: 5,
    color: 'green' as const,
  },
] as const;

export const ORDERING_SYSTEM_OPTIONS = [
  {
    id: 'a3262ec8-2db1-4975-88d0-d520987ed6f3',
    value: 'ENCOMPASS',
    label: 'Encompass',
    position: 0,
    color: 'blue' as const,
  },
  {
    id: '3e2d713d-4572-415a-8cae-89813d997cf2',
    value: 'MERCURY',
    label: 'Mercury',
    position: 1,
    color: 'cyan' as const,
  },
  {
    id: 'c38264c2-4445-401a-9636-d3b2599df21d',
    value: 'REGGORA',
    label: 'Reggora',
    position: 2,
    color: 'purple' as const,
  },
  {
    id: 'a8829ea5-4951-43ef-a9be-83e16c81ffd7',
    value: 'APPRAISAL_WORKS_API',
    label: 'AppraisalWorks API',
    position: 3,
    color: 'orange' as const,
  },
  {
    id: '0cf837a9-160a-46bd-9d8c-fa83a2454052',
    value: 'PROPRIETARY_LOS',
    label: 'Proprietary LOS',
    position: 4,
    color: 'green' as const,
  },
] as const;
