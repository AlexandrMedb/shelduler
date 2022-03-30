import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Box} from '@mui/material';
import {connect} from 'react-redux';
import {roomInterface} from '../interfaces/shelduleInterfaces';
import {RootState} from '../store/store';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {FormDialog} from '../components/formDialog';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import {useMutation, useQuery} from '@apollo/client';
import {ROOM_DELETE} from '../graphQl/mutation';
import {GET_ROOMS} from '../graphQl/query';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

const mapStateToProps =({rooms}:RootState)=>({rooms});

interface props{
    rooms:roomInterface[],
  refetch:()=>any

}
export const RoomsContainer= connect(mapStateToProps )((props:props)=>{
  const {refetch, rooms}=props;


  const [roomDelete] = useMutation(ROOM_DELETE);
  const [modalOpen, setModalOpen] =useState(false);
  const [activeRoom, setActiveRoom] =useState<roomInterface>({id: -1, name: ''});


  const clickHandler=()=>{
    setModalOpen(true);
  };

  const deleteHandler =()=>{
    roomDelete({variables: {input: {id: activeRoom.id}}}).then(()=>{
      refetch();
    }).catch((error)=>{
      console.log(error);
    });
  };

  return (
    <Box sx={{width: '100%',
      display: 'flex', justifyContent: 'center'}}>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell >Название комнаты</TableCell>
              <TableCell sx={{display: 'flex', alignItems: 'center'}}
                align="right"> <AddCircleIcon onClick={clickHandler}
                  sx={{ml: 1, cursor: 'pointer'}}/>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((row) => (
              <TableRow
                key={row.id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell align="right">
                  {row.id===activeRoom.id?(
                      <>
                        <CheckIcon sx={{mr: 2, cursor: 'pointer'}} onClick={deleteHandler}/>
                        <DoNotDisturbOnIcon sx={{cursor: 'pointer'}}
                          onClick={()=>setActiveRoom({id: -1, name: ''})}/>
                      </>

                  ):
                      <>
                        <ModeEditOutlineIcon
                          onClick={()=> {
                            setActiveRoom(row);
                            setModalOpen(true);
                          } }
                          sx={{mr: 2, cursor: 'pointer'}}/>
                        <DeleteIcon sx={{cursor: 'pointer'}} onClick={()=>setActiveRoom(row)}/>
                      </>

                  }


                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FormDialog open={modalOpen}
        setOpen={setModalOpen}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
        refetch={refetch} />
    </Box>
  );
});
