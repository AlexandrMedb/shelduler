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
import {RoomDialog} from '../components/roomDialog';
import CheckIcon from '@mui/icons-material/Check';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import {useMutation, useQuery} from '@apollo/client';
import {ROOM_DELETE, USER_DELETE} from '../graphQl/mutation';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import {GET_ROOMS, GET_USER} from '../graphQl/query';
import {UserDialog} from '../components/userDialog';

const mapStateToProps = () => ({});

interface user {
    id: string,
    name: string
}

export const UsersContainer = connect(mapStateToProps)(() => {
  const {data: userGql = {}, refetch} = useQuery(GET_USER);
  const [users, setUsers] = useState<user[]>([]);
  const [activeUser, setActiveUser] = useState<user>({id: '-1', name: ''});

  useEffect(() => {
    if (userGql.user) {
      setUsers(userGql.user);
    }
  }, [userGql]);

  const [userDelete] = useMutation(USER_DELETE);
  const [modalOpen, setModalOpen] = useState(false);


  const clickHandler = () => {
    setModalOpen(true);
  };

  const deleteHandler = () => {
    userDelete({variables: {input: {id: activeUser.id}}}).then(() => {
      refetch();
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <Box sx={{
      width: '100%',
      display: 'flex', justifyContent: 'center',
    }}>

      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Пользователи</TableCell>
              <TableCell sx={{display: 'flex', alignItems: 'center'}}
                align="right"> <AddCircleIcon onClick={clickHandler}
                  sx={{
                    ml: 1,
                    cursor: 'pointer',
                  }}/>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell align="right">
                  {row.id === activeUser.id ? (
                      <>
                        <CheckIcon sx={{mr: 2, cursor: 'pointer'}} onClick={deleteHandler}/>
                        <DoNotDisturbOnIcon sx={{cursor: 'pointer'}}
                          onClick={() => setActiveUser({id: '-1', name: ''})}/>
                      </>
                      ) :
                      <>
                        <ModeEditOutlineIcon
                          onClick={() => {
                            setActiveUser(row);
                            setModalOpen(true);
                          }}
                          sx={{mr: 2, cursor: 'pointer'}}/>
                        <DeleteIcon sx={{cursor: 'pointer'}} onClick={() => setActiveUser(row)}/>
                      </>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <UserDialog open={modalOpen}
        setOpen={setModalOpen}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        refetch={refetch}
      />
    </Box>
  );
});
