import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {AllFeatures} from 'components/allfeatures';
import {reserveInterface, roomInterface} from 'interfaces/shelduleInterfaces';
import {RootState} from 'store/store';
import {useQuery} from '@apollo/client';
import {GET_RESERVE} from '../graphQl/query';
import {setReserve} from '../reducer/recerveReducer';


const mapStateToProps =({currentRoom}:RootState)=>({currentRoom});

interface props{
  currentRoom:roomInterface
  setReserve:(data:reserveInterface[])=>void
}

export const RoomContainer = connect(mapStateToProps, {setReserve})((props:props)=>{
  const {currentRoom, setReserve}=props;

  const filter:{[key:string]:any}={};
  if (currentRoom.id!==-1) {
    filter.room={
      id: {
        eq: +currentRoom.id,
      },
    };
  }

  const {data: reserveGql = {}} = useQuery(GET_RESERVE, {
    variables: {
      filter: {...filter},
    }});
  useEffect(() => {
    if (currentRoom.id!==-1) {
      if (reserveGql.reserve) {
        setReserve(reserveGql.reserve);
      }
    }
  }, [reserveGql, currentRoom]);
  return <AllFeatures/>;
});
