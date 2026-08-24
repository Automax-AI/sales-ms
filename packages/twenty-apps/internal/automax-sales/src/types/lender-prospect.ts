import {
  type APPRAISAL_REPORT_TYPE_OPTIONS,
  type LENDING_PRODUCT_OPTIONS,
  type ORDERING_SYSTEM_OPTIONS,
  type SalesPipelineStage,
  type VALUATION_PROVIDER_OPTIONS,
} from 'src/constants/lender-options';

type SelectOptionValue<TOptions extends readonly { value: string }[]> =
  TOptions[number]['value'];

export type LenderContact = {
  firstName: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  isChampion?: boolean;
};

export type LenderProspect = {
  name: string;
  domainName: string;
  channel: string;
  salesPipelineStage: SalesPipelineStage;
  estimatedMonthlyVolume?: number;
  volumeDetails?: string;
  marketCoverage?: string;
  appraisalReportTypes: SelectOptionValue<
    typeof APPRAISAL_REPORT_TYPE_OPTIONS
  >[];
  lendingProducts: SelectOptionValue<typeof LENDING_PRODUCT_OPTIONS>[];
  currentValuationProviders: SelectOptionValue<
    typeof VALUATION_PROVIDER_OPTIONS
  >[];
  orderingSystems: SelectOptionValue<typeof ORDERING_SYSTEM_OPTIONS>[];
  contacts: LenderContact[];
  notesMarkdown: string;
};
