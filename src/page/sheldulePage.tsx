import React, {useEffect} from 'react';
import {useQuery} from '@apollo/client';
import {GET_ROOMS} from '../graphQl/query';
import {connect} from 'react-redux';
import {setRooms} from 'reducer/roomsReducer';
import {roomInterface} from '../interfaces/shelduleInterfaces';
import {setRoom} from 'reducer/currentRoomReducer';
import AdminPanel from '../components/adminPanel';
import {Route, Routes} from 'react-router-dom';
import {RoomsContainer} from '../containers/roomsContainer';
import {useMediaQuery} from '@mui/material';
import {Schedule} from '../containers/schedule';

import styles from './sheldulePage.module.scss';
import {UsersContainer} from '../containers/userContainer';


const mapStateToProps =({})=>({});

interface props{
  setRooms:(data:roomInterface[])=>void
  setRoom:(data:roomInterface)=>void
  logout:()=>void

}

export const SchedulePage=connect(mapStateToProps, {setRooms, setRoom})((props:props)=>{
  const {setRooms, setRoom, logout}=props;

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

  const matchesAdmin = useMediaQuery('(min-width:768px)');


  return (
    <>
      <main className={styles.wrapper}>
        {matchesAdmin && <AdminPanel/>}
        <Routes>
          {/* @ts-ignore*/}
          <Route path="/" element={<Schedule logout={logout}/>}/>
          <Route path="/rooms" element={<RoomsContainer refetch={refetch}/>}/>
          <Route path="/users" element={<UsersContainer/>}/>
        </Routes>
      </main>
      <div className={styles.mobileVersion}>
        <h1>Мобильная версия пока не поддерживается</h1>
      </div>
    </>

  );
});
