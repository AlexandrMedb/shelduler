import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useMutation} from '@apollo/client';
import {ROOM_INSERT, ROOM_UPDATE} from '../graphQl/mutation';
import {roomInterface} from '../interfaces/shelduleInterfaces';

interface props {
    open:boolean,
    activeRoom:roomInterface
    setOpen:Dispatch<SetStateAction<boolean>>,
    refetch:()=>void,
    setActiveRoom:Dispatch<SetStateAction<roomInterface>>,
    handleSnackbarOpen:()=>void
}

export const RoomDialog=(props:props)=> {
  const {open, setOpen, activeRoom, refetch, setActiveRoom, handleSnackbarOpen}=props;
  const [createRoom] = useMutation(ROOM_INSERT);
  const [updateRoom] = useMutation(ROOM_UPDATE);
  const [value, setValue] =useState(activeRoom?.name);
  const [color, setColor] =useState(activeRoom?.color ||'#3787d7');

  useEffect(()=>{
    setValue(activeRoom.name);
  }, [activeRoom]);


  const handleClose = () => {
    setOpen(false);
    setActiveRoom({id: -1, name: ''});
  };

  const handleSubmit=()=>{
    if (value) {
      if (activeRoom.id!=-1) {
        updateRoom({variables: {input: {name: value, color: color, id: activeRoom.id}}}).then(()=>{
          refetch();
          handleClose();
        }).catch((error)=>{
          console.log(error);
          handleSnackbarOpen();
          handleClose();
        });
      } else {
        createRoom({variables: {input: {name: value, color: color}}}).then(()=>{
          refetch();
          handleClose();
        }).catch((error)=>{
          console.log(error);
          handleSnackbarOpen();
          handleClose();
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {activeRoom?.id!==-1?'Edit room':'Add room'}

      </DialogTitle>
      <DialogContent sx={{display: 'flex'}}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          placeholder="Room name"
          type="text"
          fullWidth
          variant="standard"
          value={value}
          onChange={(e)=>{
            setValue(e.target.value);
          }}
        />
        <TextField
          sx={{width: '18px'}}
          margin="dense"
          type="color"
          fullWidth
          variant="standard"
          value={color}
          onChange={(e)=>{
            setColor(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{activeRoom.id!=-1?'Save': 'Create'}</Button>
      </DialogActions>
    </Dialog>
  );
};
