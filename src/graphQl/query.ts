import {gql} from '@apollo/client';

export const GET_ROOMS = gql`
    query {
        room {
            id
            name
        }
    }
`;

export const GET_RESERVE = gql`
    query($filter:ReserveFilterInput){
        reserve(filter:$filter){
            date_end,
            date_start,
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


// {
//     "filter": {
//     "room":{
//         "id": {
//             "eq": 1
//         }
//     }
// }
// }

export const GET_USER = gql`
    query($filter:UserFilterInput) {
        user(filter:$filter) {
            id
            name
        }
    }
`;

// {
//     "filter": {
//     "id": {
//         "eq": "user1"
//     }
// }
// }