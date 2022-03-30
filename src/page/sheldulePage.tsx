import React, {useContext, useEffect} from 'react';
import {useQuery} from '@apollo/client';
import {GET_ROOMS} from '../graphQl/query';
import {connect} from 'react-redux';
import {setRooms} from 'reducer/roomsReducer';
import {roomInterface} from '../interfaces/shelduleInterfaces';
import {setRoom} from 'reducer/currentRoomReducer';
import {ScheduleContainer} from '../containers/shelduleContainer';
import AdminPanel from '../components/adminPanel';
import {Route, Routes} from 'react-router-dom';
import {RoomsContainer} from '../containers/roomsContainer';


const mapStateToProps =({})=>({});

interface props{
  setRooms:(data:roomInterface[])=>void
  setRoom:(data:roomInterface)=>void

}

export const SchedulePage=connect(mapStateToProps, {setRooms, setRoom})((props:props)=>{
  const {setRooms, setRoom}=props;

  const {data: roomsGql = {}, refetch} = useQuery(GET_ROOMS);
  useEffect(() => {
    if (roomsGql.room) {
      setRooms(roomsGql.room);
      const curId = sessionStorage.getItem('curRoom');
      if (curId) {
        const room = roomsGql.room.find((i: { id: string; })=> i.id == curId);
        if (room) {
          setRoom(room);
          return;
        }
      }
      setRoom(roomsGql.room[0]);
    }
  }, [roomsGql]);


  return (
    <main style={{display: 'flex'}}>
      <AdminPanel/>
      <Routes>
        <Route path="/" element={<ScheduleContainer/>}/>
        <Route path="/rooms" element={<RoomsContainer refetch={refetch}/>}/>
        <Route path="/users" element={<div>user,</div>}/>
      </Routes>
    </main>

  );
});
