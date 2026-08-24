import { config } from 'dotenv';
import { CoreApiClient } from 'twenty-client-sdk/core';

import { LENDER_PROSPECTS } from 'src/data/lender-prospects';
import {
  type LenderContact,
  type LenderProspect,
} from 'src/types/lender-prospect';

config({ path: process.env.ENV_FILE ?? '.env.local' });

type Edge<TNode> = {
  node: TNode;
};

type Connection<TNode> = {
  edges: Edge<TNode>[];
};

type CompanyNode = {
  id: string;
};

type PersonNode = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  } | null;
};

type NoteNode = {
  id: string;
};

type NoteTargetNode = {
  id: string;
};

type CompaniesQueryResponse = {
  companies?: Connection<CompanyNode>;
};

type PeopleQueryResponse = {
  people?: Connection<PersonNode>;
};

type NotesQueryResponse = {
  notes?: Connection<NoteNode>;
};

type NoteTargetsQueryResponse = {
  noteTargets?: Connection<NoteTargetNode>;
};

type CreateCompanyResponse = {
  createCompany: CompanyNode;
};

type CreatePersonResponse = {
  createPerson: PersonNode;
};

type CreateNoteResponse = {
  createNote: NoteNode;
};

type ConfigurableCoreApiClientConstructor = new (options: {
  url: string;
  headers: Record<string, string>;
}) => CoreApiClient;

const requireEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} environment variable`);
  }

  return value;
};

const getNodes = <TNode>(connection: Connection<TNode> | undefined): TNode[] =>
  connection?.edges.map((edge) => edge.node) ?? [];

const buildCompanyData = (
  lenderProspect: LenderProspect,
): Record<string, unknown> => ({
  name: lenderProspect.name,
  domainName: {
    primaryLinkUrl: lenderProspect.domainName,
  },
  channel: lenderProspect.channel,
  salesPipelineStage: lenderProspect.salesPipelineStage,
  appraisalReportTypes: lenderProspect.appraisalReportTypes,
  lendingProducts: lenderProspect.lendingProducts,
  currentValuationProviders: lenderProspect.currentValuationProviders,
  orderingSystems: lenderProspect.orderingSystems,
  ...(lenderProspect.estimatedMonthlyVolume === undefined
    ? {}
    : {
        estimatedMonthlyVolume: lenderProspect.estimatedMonthlyVolume,
      }),
  ...(lenderProspect.volumeDetails === undefined
    ? {}
    : { volumeDetails: lenderProspect.volumeDetails }),
  ...(lenderProspect.marketCoverage === undefined
    ? {}
    : { marketCoverage: lenderProspect.marketCoverage }),
});

const upsertCompany = async (
  client: CoreApiClient,
  lenderProspect: LenderProspect,
): Promise<string> => {
  const companiesQueryResponse = (await client.query({
    companies: {
      __args: {
        filter: {
          name: {
            eq: lenderProspect.name,
          },
        },
        first: 1,
      },
      edges: {
        node: {
          id: true,
        },
      },
    },
  } as never)) as unknown as CompaniesQueryResponse;

  const existingCompany = getNodes(companiesQueryResponse.companies)[0];
  const companyData = buildCompanyData(lenderProspect);

  if (existingCompany) {
    await client.mutation({
      updateCompany: {
        __args: {
          id: existingCompany.id,
          data: companyData,
        },
        id: true,
      },
    } as never);

    return existingCompany.id;
  }

  const createCompanyResponse = (await client.mutation({
    createCompany: {
      __args: {
        data: companyData,
      },
      id: true,
    },
  } as never)) as unknown as CreateCompanyResponse;

  return createCompanyResponse.createCompany.id;
};

const namesMatch = (
  personNode: PersonNode,
  lenderContact: LenderContact,
): boolean =>
  personNode.name?.firstName === lenderContact.firstName &&
  personNode.name.lastName === (lenderContact.lastName ?? '');

const findExistingPerson = (
  people: PersonNode[],
  lenderContact: LenderContact,
): PersonNode | undefined => {
  const exactMatch = people.find((personNode) =>
    namesMatch(personNode, lenderContact),
  );

  if (exactMatch) {
    return exactMatch;
  }

  const firstNameMatches = people.filter(
    (personNode) =>
      personNode.name?.firstName === lenderContact.firstName,
  );

  return firstNameMatches.length === 1 ? firstNameMatches[0] : undefined;
};

const upsertContact = async (
  client: CoreApiClient,
  companyId: string,
  lenderContact: LenderContact,
): Promise<string> => {
  const peopleQueryResponse = (await client.query({
    people: {
      __args: {
        filter: {
          companyId: {
            eq: companyId,
          },
        },
        first: 100,
      },
      edges: {
        node: {
          id: true,
          name: {
            firstName: true,
            lastName: true,
          },
        },
      },
    },
  } as never)) as unknown as PeopleQueryResponse;

  const existingPerson = findExistingPerson(
    getNodes(peopleQueryResponse.people),
    lenderContact,
  );
  const personData = {
    name: {
      firstName: lenderContact.firstName,
      lastName: lenderContact.lastName ?? '',
    },
    companyId,
    ...(lenderContact.email === undefined
      ? {}
      : {
          emails: {
            primaryEmail: lenderContact.email,
          },
        }),
    ...(lenderContact.jobTitle === undefined
      ? {}
      : { jobTitle: lenderContact.jobTitle }),
  };

  if (existingPerson) {
    await client.mutation({
      updatePerson: {
        __args: {
          id: existingPerson.id,
          data: personData,
        },
        id: true,
      },
    } as never);

    return existingPerson.id;
  }

  const createPersonResponse = (await client.mutation({
    createPerson: {
      __args: {
        data: personData,
      },
      id: true,
      name: {
        firstName: true,
        lastName: true,
      },
    },
  } as never)) as unknown as CreatePersonResponse;

  return createPersonResponse.createPerson.id;
};

const upsertContacts = async (
  client: CoreApiClient,
  companyId: string,
  lenderProspect: LenderProspect,
): Promise<void> => {
  let championId: string | undefined;

  for (const lenderContact of lenderProspect.contacts) {
    const personId = await upsertContact(client, companyId, lenderContact);

    if (lenderContact.isChampion === true) {
      championId = personId;
    }
  }

  if (championId) {
    await client.mutation({
      updateCompany: {
        __args: {
          id: companyId,
          data: {
            championId,
          },
        },
        id: true,
      },
    } as never);
  }
};

const upsertNote = async (
  client: CoreApiClient,
  companyId: string,
  lenderProspect: LenderProspect,
): Promise<void> => {
  const noteTitle = `Initial sales context — ${lenderProspect.name}`;
  const notesQueryResponse = (await client.query({
    notes: {
      __args: {
        filter: {
          title: {
            eq: noteTitle,
          },
        },
        first: 1,
      },
      edges: {
        node: {
          id: true,
        },
      },
    },
  } as never)) as unknown as NotesQueryResponse;

  const existingNote = getNodes(notesQueryResponse.notes)[0];
  const noteData = {
    title: noteTitle,
    bodyV2: {
      blocknote: null,
      markdown: lenderProspect.notesMarkdown,
    },
  };
  let noteId: string;

  if (existingNote) {
    await client.mutation({
      updateNote: {
        __args: {
          id: existingNote.id,
          data: noteData,
        },
        id: true,
      },
    } as never);
    noteId = existingNote.id;
  } else {
    const createNoteResponse = (await client.mutation({
      createNote: {
        __args: {
          data: noteData,
        },
        id: true,
      },
    } as never)) as unknown as CreateNoteResponse;
    noteId = createNoteResponse.createNote.id;
  }

  const noteTargetsQueryResponse = (await client.query({
    noteTargets: {
      __args: {
        filter: {
          noteId: {
            eq: noteId,
          },
          targetCompanyId: {
            eq: companyId,
          },
        },
        first: 1,
      },
      edges: {
        node: {
          id: true,
        },
      },
    },
  } as never)) as unknown as NoteTargetsQueryResponse;

  if (getNodes(noteTargetsQueryResponse.noteTargets).length === 0) {
    await client.mutation({
      createNoteTarget: {
        __args: {
          data: {
            noteId,
            targetCompanyId: companyId,
          },
        },
        id: true,
      },
    } as never);
  }
};

const main = async (): Promise<void> => {
  const baseUrl = requireEnvironmentVariable('AUTOMAX_SALES_API_URL').replace(
    /\/$/,
    '',
  );
  const apiKey = requireEnvironmentVariable('AUTOMAX_SALES_API_KEY');
  const ConfigurableCoreApiClient =
    CoreApiClient as unknown as ConfigurableCoreApiClientConstructor;
  const client = new ConfigurableCoreApiClient({
    url: `${baseUrl}/graphql`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  for (const lenderProspect of LENDER_PROSPECTS) {
    const companyId = await upsertCompany(client, lenderProspect);

    await upsertContacts(client, companyId, lenderProspect);
    await upsertNote(client, companyId, lenderProspect);
    console.log(`[seed] ${lenderProspect.name}`);
  }

  console.log(`[seed] completed ${LENDER_PROSPECTS.length} lenders`);
};

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
