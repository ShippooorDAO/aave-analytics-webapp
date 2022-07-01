import { gql } from "@apollo/client";

export const ACCOUNTS_QUERY = gql`
    getAccounts($searchQuery: string!) {
        accounts {

        }
    }
`