import React, {useEffect} from 'react';
import {useQuery} from '@apollo/client';
import {GET_ROOMS} from '../graphQl/query';
import {connect} from 'react-redux';
import {setRooms} from 'reducer/roomsReducer';
import {roomInterface} from '../interfaces/shelduleInterfaces';
import {RoomContainer} from '../containers/roomContainer';
import {setRoom} from 'reducer/currentRoomReducer';

const mapStateToProps =({})=>({});

interface props{
  setRooms:(data:roomInterface[])=>void
  setRoom:(data:roomInterface)=>void

}

export const SchedulePage=connect(mapStateToProps, {setRooms, setRoom})((props:props)=>{
  const {setRooms, setRoom}=props;

  const {data: roomsGql = {}} = useQuery(GET_ROOMS);
  useEffect(() => {
    if (roomsGql.room) {
      setRooms(roomsGql.room);
      setRoom(roomsGql.room[0]);
    }
  }, [roomsGql]);


  return (
    <RoomContainer/>
  );
});
