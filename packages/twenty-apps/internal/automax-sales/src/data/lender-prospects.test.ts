import { describe, expect, it } from 'vitest';

import {
  APPRAISAL_REPORT_TYPE_OPTIONS,
  LENDING_PRODUCT_OPTIONS,
  ORDERING_SYSTEM_OPTIONS,
  SALES_PIPELINE_STAGE,
  SALES_PIPELINE_STAGE_OPTIONS,
  VALUATION_PROVIDER_OPTIONS,
} from 'src/constants/lender-options';
import { LENDER_PROSPECTS } from 'src/data/lender-prospects';

const optionValues = (options: readonly { value: string }[]): Set<string> =>
  new Set(options.map((option) => option.value));

describe('lender prospects', () => {
  it('should include each requested lender exactly once', () => {
    const lenderNames = LENDER_PROSPECTS.map(
      (lenderProspect) => lenderProspect.name,
    );

    expect(lenderNames).toHaveLength(12);
    expect(new Set(lenderNames).size).toBe(lenderNames.length);
    expect(lenderNames).toEqual([
      'Newrez',
      'Flyhomes',
      'Granite Bank',
      'Gumtree Mortgage',
      'The Mortgage Foundation',
      'Wintrust',
      'Prime Lending',
      'Truist',
      'Mortgage Solutions Financial',
      'Point',
      'Unlock',
      'Splitero',
    ]);
  });

  it('should include a valid official domain for every lender', () => {
    for (const lenderProspect of LENDER_PROSPECTS) {
      const domainUrl = new URL(lenderProspect.domainName);

      expect(domainUrl.protocol).toBe('https:');
      expect(domainUrl.pathname).toBe('/');
    }
  });

  it('should include an acquisition channel for every lender', () => {
    for (const lenderProspect of LENDER_PROSPECTS) {
      expect(lenderProspect.channel.trim().length).toBeGreaterThan(0);
    }
  });

  it('should use only declared select option values', () => {
    const stageValues = optionValues(SALES_PIPELINE_STAGE_OPTIONS);
    const reportTypeValues = optionValues(APPRAISAL_REPORT_TYPE_OPTIONS);
    const productValues = optionValues(LENDING_PRODUCT_OPTIONS);
    const providerValues = optionValues(VALUATION_PROVIDER_OPTIONS);
    const orderingSystemValues = optionValues(ORDERING_SYSTEM_OPTIONS);

    for (const lenderProspect of LENDER_PROSPECTS) {
      expect(stageValues.has(lenderProspect.salesPipelineStage)).toBe(true);
      expect(
        lenderProspect.appraisalReportTypes.every((value) =>
          reportTypeValues.has(value),
        ),
      ).toBe(true);
      expect(
        lenderProspect.lendingProducts.every((value) =>
          productValues.has(value),
        ),
      ).toBe(true);
      expect(
        lenderProspect.currentValuationProviders.every((value) =>
          providerValues.has(value),
        ),
      ).toBe(true);
      expect(
        lenderProspect.orderingSystems.every((value) =>
          orderingSystemValues.has(value),
        ),
      ).toBe(true);
    }
  });

  it('should preserve the agreed initial stage distribution', () => {
    const stageCounts = LENDER_PROSPECTS.reduce<Record<string, number>>(
      (counts, lenderProspect) => ({
        ...counts,
        [lenderProspect.salesPipelineStage]:
          (counts[lenderProspect.salesPipelineStage] ?? 0) + 1,
      }),
      {},
    );

    expect(stageCounts).toEqual({
      [SALES_PIPELINE_STAGE.NOT_REACHED_OUT]: 3,
      [SALES_PIPELINE_STAGE.FIRST_CALL]: 2,
      [SALES_PIPELINE_STAGE.GATHERING_DATA]: 5,
      [SALES_PIPELINE_STAGE.TRIAL_APPRAISAL]: 1,
      [SALES_PIPELINE_STAGE.PRODUCTION]: 1,
    });
    expect(stageCounts[SALES_PIPELINE_STAGE.PILOT]).toBeUndefined();
  });

  it('should include actionable source notes for every lender', () => {
    for (const lenderProspect of LENDER_PROSPECTS) {
      expect(lenderProspect.notesMarkdown.length).toBeGreaterThan(100);
      expect(lenderProspect.notesMarkdown).toContain('- ');
    }

    expect(
      LENDER_PROSPECTS.find(({ name }) => name === 'Unlock')?.notesMarkdown,
    ).toContain('Effective valuation cost');
    expect(
      LENDER_PROSPECTS.find(({ name }) => name === 'Point')?.notesMarkdown,
    ).toContain('$175-$190');
    expect(
      LENDER_PROSPECTS.find(({ name }) => name === 'Splitero')?.notesMarkdown,
    ).toContain('200 appraisals per month');
  });

  it('should link the known contacts, champions, and available emails', () => {
    const contacts = LENDER_PROSPECTS.flatMap(
      (lenderProspect) => lenderProspect.contacts,
    );
    const splitero = LENDER_PROSPECTS.find(
      (lenderProspect) => lenderProspect.name === 'Splitero',
    );

    expect(contacts).toHaveLength(10);
    expect(
      contacts.filter((lenderContact) => lenderContact.isChampion === true),
    ).toHaveLength(9);
    expect(
      contacts.filter((lenderContact) => lenderContact.email !== undefined),
    ).toHaveLength(7);
    expect(splitero?.contacts).toHaveLength(2);
    expect(
      splitero?.contacts.find(
        (lenderContact) => lenderContact.firstName === 'Brandi',
      )?.isChampion,
    ).toBe(true);
  });
});
