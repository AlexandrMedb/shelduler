import React, {useEffect, useState} from 'react';
import {useQuery} from '@apollo/client';
import {GET_ROOMS, GET_USER} from '../graphQl/query';
import {connect} from 'react-redux';
import {setRooms} from 'reducer/roomsReducer';
import {roomInterface} from '../interfaces/shelduleInterfaces';
import {setRoom} from 'reducer/currentRoomReducer';
import AdminPanel from '../components/adminPanel';
import {Route, Routes} from 'react-router-dom';
import {RoomsContainer} from '../containers/roomsContainer';
import {Box, CircularProgress, Tooltip, useMediaQuery} from '@mui/material';
import {Schedule} from '../containers/schedule';

import styles from './sheldulePage.module.scss';
import {UsersContainer} from '../containers/userContainer';
import {RootState} from '../store/store';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';


const mapStateToProps =({user: {uid}}:RootState)=>({uid});

interface props{
  setRooms:(data:roomInterface[])=>void
  setRoom:(data:roomInterface)=>void
  logout:()=>void
  uid:string

}

export const SchedulePage=connect(mapStateToProps, {setRooms, setRoom})((props:props)=>{
  const {setRooms, setRoom, logout, uid}=props;

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


  const [isAdmin, setISAdmin]=useState(false);
  const [user, setUser]=useState({name: ''});

  const input= uid?{filter: {id: {eq: uid}}}:{};
  const {data: userGql = {}, loading} = useQuery(GET_USER, {variables: input});
  useEffect(() => {
    if (userGql?.user) {
      if (userGql?.user[0]) {
        console.log(userGql?.user[0]);
        setUser(userGql?.user[0]);
        setISAdmin(!!userGql?.user[0]?.is_admin);
      }
    }
  }, [userGql]);


  const matchesAdmin = useMediaQuery('(min-width:768px)');


  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'}}>
        <CircularProgress />
      </Box>);
  }


  return (
    <>

      <main className={styles.wrapper}>
        <header>
          <Typography>
            {user.name}
          </Typography>

          <Tooltip title={'Logout'}>
            <LogoutIcon onClick={logout} sx={{ml: 2, cursor: 'pointer'}}/>
          </Tooltip>
        </header>
        <div className={styles.container}>
          {matchesAdmin && isAdmin && <AdminPanel/>}
          <Routes>
            {/* @ts-ignore*/}
            <Route path="/" element={<Schedule />}/>
            {isAdmin && <>
              <Route path="/rooms" element={<RoomsContainer refetch={refetch}/>}/>
              <Route path="/users" element={<UsersContainer />}/>
            </>}
            {/* @ts-ignore*/}
            <Route path="*" element={<Schedule logout={logout}/>}/>
          </Routes>
        </div>

      </main>
      <div className={styles.mobileVersion}>
        <h1>Мобильная версия пока не поддерживается</h1>
      </div>
    </>

  );
});
