import {gql} from '@apollo/client';

export const ROOM_INSERT = gql`
    mutation room_insert(
        $input:RoomInsertInput){
        room_insert(input:$input){
            id
        }
    }
`;

// {
//     "input": {
//     "name": "Room1"
// }
// }

export const RESERVE_INSERT = gql`
    mutation reserve_insert(
        $input:ReserveInsertInput){
        reserve_insert(input:$input){ 
            id
        }
    }
`;

// {
//     "input": {
//     "date_start": "2022-03-28T19:39:58+03:00",
//         "date_end": "2022-03-28T19:39:58+03:00",
//         "name": "Reserve1",
//         "room": {
//         "connect": 1
//     },
//     "creator":{
//         "connect":"user1"
//     }
// }
// }

export const USER_INSERT = gql`
    mutation user_insert(
        $input:UserInsertInput){
        user_insert(input:$ input){
            id
        }
    }

`;

// {
//     "input": {
//     "name": "vasya",
//         "id":"user1"
// }
// }
