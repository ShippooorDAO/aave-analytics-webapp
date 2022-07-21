import { AccountsGraphQLSchemaType } from "./AaveAnalyticsApi.type";
import { AccountsQueryParams } from "./AaveAnalyticsApiQueries";

export const cacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        accounts: {
          keyArgs: [
            '$sortBy',
            '$sortDirection',
            '$filter',
            '$search',
            '$simulatedPriceOracles',
          ],
          merge(
            existing: AccountsGraphQLSchemaType | undefined,
            incoming: AccountsGraphQLSchemaType,
            options: { args: AccountsQueryParams | null }
          ): AccountsGraphQLSchemaType {
            const args = options.args;
            const pageNumber = args?.pageNumber ?? 1;
            const pageSize = args?.pageSize ?? 25;

            // Slicing is necessary because the existing data is
            // immutable, and frozen in development.
            const mergedAccounts = existing ? existing.accounts.slice(0) : [];
            for (let i = 0; i < incoming.accounts.length; ++i) {
              mergedAccounts[(pageNumber - 1) * pageSize + i] =
                incoming.accounts[i]!;
            }
            return {
              totalEntries: incoming.totalEntries,
              totalPages: incoming.totalPages,
              accounts: mergedAccounts,
            };
          },
          read(
            existing: AccountsGraphQLSchemaType | undefined,
            options: { args: AccountsQueryParams | null }
          ): AccountsGraphQLSchemaType | undefined {
            // A read function should always return undefined if existing is
            // undefined. Returning undefined signals that the field is
            // missing from the cache, which instructs Apollo Client to
            // fetch its value from your GraphQL server.
            if (!existing) {
              return undefined;
            }

            const args = options.args;
            const pageNumber = args?.pageNumber ?? 1;
            const pageSize = args?.pageSize ?? 25;

            if (pageNumber * pageSize > existing.accounts.length) {
              return undefined;
            }

            return {
              totalEntries: existing.totalEntries,
              totalPages: existing.totalPages,
              accounts: existing.accounts.slice(
                (pageNumber - 1) * pageSize,
                pageNumber * pageSize
              ),
            };
          },
        },
      },
    },
  },
};