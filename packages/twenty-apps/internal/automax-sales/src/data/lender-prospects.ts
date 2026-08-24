import { SALES_PIPELINE_STAGE } from 'src/constants/lender-options';
import { type LenderProspect } from 'src/types/lender-prospect';

export const LENDER_PROSPECTS: LenderProspect[] = [
  {
    name: 'Newrez',
    domainName: 'https://newrez.com',
    channel: 'Valon intro',
    salesPipelineStage: SALES_PIPELINE_STAGE.FIRST_CALL,
    appraisalReportTypes: [],
    lendingProducts: [],
    currentValuationProviders: ['E_STREET'],
    orderingSystems: ['MERCURY'],
    contacts: [{ firstName: 'Jennifer', isChampion: true }],
    notesMarkdown: `## Current workflow

- Owns the E-Street AMC.
- Uses Mercury and is actively switching to modern, AI-native appraisal solutions, as they did with Valon.

## Sales context and next steps

- Name-drop Valon and Dave Savage.
- Set up a second call with the other Jennifer.
- The team is very excited by the solution and looking forward to adoption.`,
  },
  {
    name: 'Flyhomes',
    domainName: 'https://flyhomes.com',
    channel: 'Inbound Intro (Samir, HousingWire)',
    salesPipelineStage: SALES_PIPELINE_STAGE.GATHERING_DATA,
    estimatedMonthlyVolume: 63,
    volumeDetails: '50-75/month; approximately $225-$350 per desktop',
    marketCoverage: 'Nationwide',
    appraisalReportTypes: [
      'FULL_APPRAISAL',
      'DESKTOP',
      'HYBRID',
      'SELF_INSPECTION_HYBRID',
      'UAD_3_6',
    ],
    lendingProducts: ['CONVENTIONAL', 'BRIDGE', 'CASH_OFFER', 'REFINANCE'],
    currentValuationProviders: [],
    orderingSystems: ['ENCOMPASS'],
    contacts: [],
    notesMarkdown: `## Current workflow

- BBYS model and bridge loans; currently only receives desktop or hybrid appraisals when underwriting them.
- Uses Encompass LOS and ideally wants to order from there.
- Current volume is approximately 50-75 orders per month, nationwide.
- Current desktop pricing is approximately $225-$350.
- Wants an ordering waterfall on the loan that can select either desktop or hybrid.

## Discovery questions

- How does pre-underwriting or pre-approval work for cash-offer loans? Are desktops used, and what is the cost?
- How can Flyhomes Mortgage underwriting replace the existing full-appraisal lane?
- How many transactions are funded directly versus refinances placed with a different lender after a cash offer?
- For bridge financing, is an appraisal completed in a home-equity style, or what is used to underwrite?
- Could a self-inspection hybrid completed at pre-approval flow directly into Flyhomes Mortgage underwriting?
- Clarify the different products and underwriting rules, including conventional GSE, non-GSE, and UAD 3.6.
- Confirm current volume, LOS, and ordering workflow.
- Which fields normally need to be entered back into Encompass? Automax will make them easy to copy and paste.
- What is the existing review system, and which checks and balances should be built in? Show the Splitero checks as an example.

## Next steps

- Define the pilot and concrete steps to begin.`,
  },
  {
    name: 'Granite Bank',
    domainName: 'https://granitebank.com',
    channel: 'HousingWire Dinner',
    salesPipelineStage: SALES_PIPELINE_STAGE.GATHERING_DATA,
    estimatedMonthlyVolume: 370,
    volumeDetails: '$1.2B/year; approximately 370 appraisals/month',
    appraisalReportTypes: ['UAD_3_6'],
    lendingProducts: [],
    currentValuationProviders: [],
    orderingSystems: ['ENCOMPASS'],
    contacts: [],
    notesMarkdown: `## Current context

- Approximately $1.2B per year and 370 appraisals per month.
- Encompass LOS integration with Automax is on the way.
- Current AMC is unknown; the source notes contained "NaN."

## Discovery questions

- Confirm total volume and which product types are performing best.
- How are appraisals handled today, and which AMC is used?

## Positioning

- Explain Automax, the appraisal landscape, and UAD 3.6.
- Appraisal timeline delays are quickly becoming the bottleneck for UAD 3.6.
- Automax provides a repurchase warranty on all UAD 3.6 loans.
- Position the technology-forward and AI-forward brand benefit, similar to the positive press received by North State Bank.
- Emphasize borrower cost savings and using appraisal innovation as a lead magnet and competitive advantage.

## Proposed sales process

1. Ask who else from the Granite team should join the discussion.
2. Hold a call with underwriting and operations to understand the current process.
3. Place three discounted test appraisals through Automax.
4. Sign a pilot for 100 appraisals.
5. Move to a full commitment.`,
  },
  {
    name: 'Gumtree Mortgage',
    domainName: 'https://gumtreemortgage.com',
    channel: 'Unspecified',
    salesPipelineStage: SALES_PIPELINE_STAGE.FIRST_CALL,
    estimatedMonthlyVolume: 42,
    volumeDetails: '500/year (approximately 42/month)',
    appraisalReportTypes: [],
    lendingProducts: ['CONVENTIONAL', 'GOVERNMENT'],
    currentValuationProviders: ['MERCURY_PANEL'],
    orderingSystems: ['MERCURY'],
    contacts: [
      {
        firstName: 'Kenneth',
        lastName: 'McNeal',
        email: 'kmcneal@gumtreemortgage.com',
        isChampion: true,
      },
    ],
    notesMarkdown: `## Current workflow

- Approximately 500 appraisals per year.
- Uses a panel on Mercury.
- Only 40-50% of production is conventional; the business is primarily a government shop.

## Sales context

- Kenneth is strongly opposed to the idea of a small panel and to the proposed Automax workflow.`,
  },
  {
    name: 'The Mortgage Foundation',
    domainName: 'https://themortgagefirm.com',
    channel: 'MISMO',
    salesPipelineStage: SALES_PIPELINE_STAGE.GATHERING_DATA,
    estimatedMonthlyVolume: 250,
    volumeDetails: '200-300/month',
    marketCoverage: '22 states, including Florida, Louisiana, and Georgia',
    appraisalReportTypes: ['PDR', 'CDA', 'UAD_3_6'],
    lendingProducts: ['NON_QM'],
    currentValuationProviders: ['REGGORA', 'CLEAR_CAPITAL'],
    orderingSystems: ['ENCOMPASS', 'REGGORA'],
    contacts: [{ firstName: 'Ty', isChampion: true }],
    notesMarkdown: `## Current workflow

- Also referred to as TMF; current contact is Ty.
- Encompass is bringing on UAD 3.6.
- Uses Reggora for appraisal management.
- Uses Clear Capital as the AMC for PDR.
- Uses Clear Capital's CDA product for non-QM.
- Operates in 22 states, including Florida, Louisiana, and Georgia.
- Volume is approximately 200-300 appraisals per month.

## Sales context

- Interested and already has a process to evaluate.`,
  },
  {
    name: 'Wintrust',
    domainName: 'https://wintrustmortgage.com',
    channel: 'MISMO',
    salesPipelineStage: SALES_PIPELINE_STAGE.NOT_REACHED_OUT,
    appraisalReportTypes: [],
    lendingProducts: [],
    currentValuationProviders: [],
    orderingSystems: [],
    contacts: [
      {
        firstName: 'Renee',
        lastName: 'Kirin',
        email: 'rkirin@wintrustmortgage.com',
        isChampion: true,
      },
    ],
    notesMarkdown: `## Contact

- Renee is the current known point of contact.
- Additional company, workflow, volume, and appraisal details are still needed.`,
  },
  {
    name: 'Prime Lending',
    domainName: 'https://primelending.com',
    channel: 'MISMO',
    salesPipelineStage: SALES_PIPELINE_STAGE.NOT_REACHED_OUT,
    appraisalReportTypes: [],
    lendingProducts: [],
    currentValuationProviders: [],
    orderingSystems: [],
    contacts: [
      {
        firstName: 'Rusty',
        lastName: 'Emory',
        email: 'remory@primelending.com',
        isChampion: true,
      },
    ],
    notesMarkdown: `## Contact

- Rusty is the current known point of contact.
- Additional company, workflow, volume, and appraisal details are still needed.`,
  },
  {
    name: 'Truist',
    domainName: 'https://truist.com',
    channel: 'MISMO',
    salesPipelineStage: SALES_PIPELINE_STAGE.NOT_REACHED_OUT,
    appraisalReportTypes: [],
    lendingProducts: [],
    currentValuationProviders: [],
    orderingSystems: [],
    contacts: [{ firstName: 'Matt', isChampion: true }],
    notesMarkdown: `## Contact

- Matt is the current known point of contact.
- Additional company, workflow, volume, and appraisal details are still needed.`,
  },
  {
    name: 'Mortgage Solutions Financial',
    domainName: 'https://mortgagesolutions.net',
    channel: 'Booked inbound',
    salesPipelineStage: SALES_PIPELINE_STAGE.GATHERING_DATA,
    estimatedMonthlyVolume: 450,
    volumeDetails: '400-500/month',
    marketCoverage: 'Approximately 30 states',
    appraisalReportTypes: ['UAD_3_6'],
    lendingProducts: ['VA', 'GOVERNMENT'],
    currentValuationProviders: ['REGGORA'],
    orderingSystems: ['REGGORA'],
    contacts: [
      {
        firstName: 'Brig',
        lastName: 'Coupe',
        email: 'brig.coupe@mortgagesolutions.net',
        jobTitle: 'VP Operations',
        isChampion: true,
      },
    ],
    notesMarkdown: `## Current workflow

- Primary contact is Brig Coupe, VP Operations.
- Independent mortgage bank operating in approximately 30 states.
- Volume is approximately 400-500 appraisals per month.
- About 50% of production is VA and government lending.
- Previously used a panel and has just switched to Reggora.
- Contracted with Reggora through October.

## Sales context

- Looking to pilot and begin with UAD 3.6.
- Aggregators are not yet accepting UAD 3.6, so the team remains tentative.`,
  },
  {
    name: 'Point',
    domainName: 'https://point.com',
    channel: 'Inbound Intro (Josh Stech)',
    salesPipelineStage: SALES_PIPELINE_STAGE.TRIAL_APPRAISAL,
    volumeDetails: 'Several hundred per month',
    marketCoverage: 'Ordering team is based in the Philippines',
    appraisalReportTypes: ['HYBRID', 'SELF_INSPECTION_HYBRID'],
    lendingProducts: ['HEI'],
    currentValuationProviders: [],
    orderingSystems: [],
    contacts: [],
    notesMarkdown: `## Current workflow

- Home equity investment product.
- Funds several hundred transactions per month.
- Ordering team is based in the Philippines.
- Strong interest in the self-inspection product.
- Wants to use human data collectors wherever possible and also discussed an agentic alpha test.

## Discovery questions

- Who on the team places orders?
- What does the review and quality-control process look like?
- Where is the team based, and can Automax come in person for onboarding?

## Alpha and rollout

- End the call by explaining the Automax process and setting up the account for orders.
- During alpha, Point may place self-inspection orders at any time.
- Inspections need to be schedulable at essentially any time on the same day.
- Train at least five people who can conduct inspections and begin building that panel.
- If alpha succeeds, Point can move Automax into a beta in July.
- Point promotes or relegates appraisal vendors quarterly based on performance.

## Pricing

- Include pricing in the follow-up email.
- Target pricing is approximately $175-$190 for a self-inspection hybrid, so Automax needs to be competitive.`,
  },
  {
    name: 'Unlock',
    domainName: 'https://unlock.com',
    channel: 'Inbound intro (Brian)',
    salesPipelineStage: SALES_PIPELINE_STAGE.GATHERING_DATA,
    estimatedMonthlyVolume: 850,
    volumeDetails: '800-900/month; volume varies by location',
    appraisalReportTypes: [
      'HYBRID',
      'SELF_INSPECTION_HYBRID',
      'AVM',
      'PDC',
      'PCR',
      'FORM_1004',
    ],
    lendingProducts: ['HEI'],
    currentValuationProviders: ['APPRAISAL_WORKS', 'ACCURATE_GROUP'],
    orderingSystems: ['APPRAISAL_WORKS_API', 'PROPRIETARY_LOS'],
    contacts: [
      {
        firstName: 'Peter',
        lastName: 'Silberstein',
        email: 'peter.silberstein@unlock.com',
        isChampion: true,
      },
    ],
    notesMarkdown: `## Current workflow

- Peter Silberstein is the Automax champion; talk to the team about Brian.
- Approximately 50% hybrid and 50% AVM.
- Uses the AppraisalWorks API.
- Volume varies by location and totals approximately 800-900 orders per month.
- Current hybrid pricing is approximately $325.
- Wants PDC with either a data collector or self-inspection.
- Ideally wants a mix of data collector and self-inspection feeding hybrid reports.
- Uses a proprietary LOS and currently places orders by API; expects the same integration from Automax.
- Accurate Group is the current provider.

## Discovery questions

- Is HEI the main product, and where is the current focus?
- Where is the office? Automax can come in person for onboarding.
- Confirm total volume.
- What is the current workflow, who do they work with, and do they use full hybrids or self-inspection?
- What are current turn times and quality-control performance?
- How is the review team structured, and what is the review process?
- What is current order pricing and geographic coverage?
- What format works best for presenting Automax internally?
- Where does pushback originate: switching cost, review team, or another concern?

## Next steps and positioning

- Send a follow-up email.
- Ask Peter to send a sample PCR and 1004.
- De-risk a small pilot of approximately 50 orders in one month to create a usable data point.
- Frame the story around Fannie Mae, Freddie Mac, the industry, and then Automax data.
- Define what "accuracy" means in an appraisal.
- Effective valuation cost = order fee + internal review cost + revision cost + replacement-order cost + delay/fallout cost.`,
  },
  {
    name: 'Splitero',
    domainName: 'https://splitero.com',
    channel: 'Inbound Intro (Judd YC)',
    salesPipelineStage: SALES_PIPELINE_STAGE.PRODUCTION,
    estimatedMonthlyVolume: 450,
    volumeDetails:
      '400-500/month overall; approximately 200/month currently with Automax',
    appraisalReportTypes: [],
    lendingProducts: ['HEI'],
    currentValuationProviders: [],
    orderingSystems: [],
    contacts: [
      {
        firstName: 'Brandi',
        lastName: 'Beasley',
        email: 'brandi.beasley@splitero.com',
        isChampion: true,
      },
      {
        firstName: 'Rachel',
        lastName: 'Westbrook',
        email: 'rachel.westbrook@splitero.com',
      },
    ],
    notesMarkdown: `## Current relationship

- Home equity investment is the primary loan type.
- Overall volume is approximately 400-500 appraisals per month.
- Splitero is in production with Automax.
- Current Automax volume is approximately 200 appraisals per month.
- Main points of contact are Brandi Beasley and Rachel Westbrook.`,
  },
];
