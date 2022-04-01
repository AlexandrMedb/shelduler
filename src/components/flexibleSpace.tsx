import React from 'react';
import {Autocomplete, Box, TextField} from '@mui/material';
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

  const roomsToLabel = rooms.map((el) => ({label: el.name, id: el.id, color: el.color}));
  // currentRoom
  const label = {label: currentRoom.name, id: currentRoom.id, color: '#3787d7'};

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
        renderInput={(params) => <TextField {...params} size="small"/>}
        renderOption={(props, option) => (
          <Box component="li" sx={{'& > img': {mr: 2, flexShrink: 0}}} {...props}>
            <div style={{
              background: option.color,
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              marginRight: '10px',
            }}>

            </div>
            {option.label}
          </Box>
        )}
      />
    </div>

  );
});
