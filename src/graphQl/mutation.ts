import {gql} from '@apollo/client';

export const ROOM_INSERT = gql`
    mutation room_insert(
        $input:RoomInsertInput){
        room_insert(input:$input){
            id
        }
    }
`;

export const ROOM_UPDATE = gql`
    mutation room_update(
        $input:RoomUpdateInput){
        room_update(input:$input){
            id
        }
    }
`;

export const ROOM_DELETE = gql`
    mutation room_delete(
        $input:RoomDeleteInput){
        room_delete(input:$input){
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

export const RESERVE_UPDATE = gql`
    mutation reserve_update(
        $input:ReserveUpdateInput){
        reserve_update(input:$input){
            id
        }
    }
`;

export const RESERVE_DELETE = gql`
    mutation reserve_delete(
        $input:ReserveDeleteInput){
        reserve_delete(input:$input){
            id
        }
    }
`;


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
