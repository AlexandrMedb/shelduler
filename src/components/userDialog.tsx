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
    activeUser: { id:string, name:string }
    setOpen:Dispatch<SetStateAction<boolean>>,
    refetch:()=>void
    setActiveUser:Dispatch<SetStateAction<{ id:string, name:string }>>
}

export const UserDialog=({open, setOpen, activeUser, refetch, setActiveUser}:props)=> {
  const [createRoom] = useMutation(ROOM_INSERT);
  const [updateRoom] = useMutation(ROOM_UPDATE);
  const [value, setValue] =useState(activeUser?.name);


  useEffect(()=>{
    setValue(activeUser.name);
  }, [activeUser]);


  const handleClose = () => {
    setOpen(false);
    setActiveUser({id: '-1', name: ''});
  };

  const handleSubmit=()=>{
    if (value) {
      if (activeUser.id!=='-1') {
        updateRoom({variables: {input: {name: value, id: activeUser.id}}}).then(()=>{
          refetch();
          handleClose();
        }).catch((error)=>{
          console.log(error);
          handleClose();
        });
      } else {
        createRoom({variables: {input: {name: value}}}).then(()=>{
          refetch();
          handleClose();
        }).catch((error)=>{
          console.log(error);
          handleClose();
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {activeUser?.id!=='-1'?'Редактировать':'Создать пользователя'}

      </DialogTitle>
      <DialogContent >
        <TextField
          autoFocus
          label={'name'}
          margin="dense"
          id="name"
          placeholder="Название комнаты"
          type="text"
          fullWidth
          variant="standard"
          value={value}
          onChange={(e)=>{
            setValue(e.target.value);
          }}
        />
        <TextField
          label={'password'}
          margin="dense"
          type="text"
          fullWidth
          variant="standard"
          // value={color}
          // onChange={(e)=>{
          //   setColor(e.target.value);
          // }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit}>{activeUser.id!='-1'?'Сохранить': 'Создать'}</Button>
      </DialogActions>
    </Dialog>
  );
};
