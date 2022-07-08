import { gql } from "@apollo/client";

export const TOKENS_QUERY = gql`
{
        tokens {
            id
            symbol
            priceUsd
        }
    }
`;