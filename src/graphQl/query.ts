import {gql} from '@apollo/client';

export const GET_ROOMS = gql`
    query {
        room {
            id
            name
            color
        }
    }
`;

export const GET_RESERVE = gql`
    query($filter:ReserveFilterInput){
        reserve(filter:$filter){
            date_end,
            date_start,
            name,
            id,
            room{
                name
                id
            },
            creator{
                name,
                id
            }
        }
    }
`;

export const GET_USER = gql`
    query($filter:UserFilterInput) {
        user(filter:$filter) {
            id
            name
            email
        }
    }
`;


