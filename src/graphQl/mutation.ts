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
    mutation create_user_action($input:CreateCustomUserInput) {
        create_user_action(input:$input){
            user{
                id
            }
        }
    }
`;

export const USER_DELETE = gql`
    mutation delete_user_action($input:DeleteCustomUserInput) {
        delete_user_action(input:$input){
            user{
                id
            }
        }
    }
`;

export const USER_UPDATE = gql`
    mutation edit_user_action($input:EditCustomUserInput) {
        edit_user_action(input:$input){
            user{
                id
            }
        }
    }
`;

