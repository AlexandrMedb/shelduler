import React from 'react';
import {Autocomplete, TextField} from '@mui/material';
import {connect} from 'react-redux';
import {RootState} from '../store/store';
import {roomInterface} from '../interfaces/shelduleInterfaces';
import {setRoom} from '../reducer/currentRoomReducer';


const mapStateToProps = ({rooms, currentRoom}: RootState) => ({rooms, currentRoom});

interface props {
    rooms: roomInterface[]
    currentRoom: roomInterface
    setRoom: (data: roomInterface) => void
}

export const FlexibleSpace = connect(mapStateToProps, {setRoom})((props: props) => {
  const {rooms, currentRoom, setRoom} = props;

  const roomsToLabel = rooms.map((el) => ({label: el.name, id: el.id}));
  // currentRoom
  const label = {label: currentRoom.name, id: currentRoom.id};

  return (
    <div style={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
      <Autocomplete

        onChange={(e, value)=>{
          console.log(value);
          if (value) {
            setRoom({id: value.id, name: value.label});
            sessionStorage.setItem('curRoom', `${value.id}`);
          } else setRoom({id: -1, name: ''});
        }}
        disablePortal
        autoSelect={true}
        id="combo-box-demo"
        options={roomsToLabel}
        value={label}
        sx={{width: 300, p: 2}}
        renderInput={(params) => <TextField sx={{p: 0}} {...params}/>}
      />
    </div>

  );
});
