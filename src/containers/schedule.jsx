import {useCallback, useEffect, useRef, useState} from 'react';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {connect} from 'react-redux';
import styles from './schedule.module.scss';
import './scheldule.css';
import {ViewState, EditingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
  DateNavigator,
  Toolbar,
  ViewSwitcher,
  DayView,
  MonthView, Resources,
} from '@devexpress/dx-react-scheduler-material-ui';


import {useMutation, useQuery} from '@apollo/client';
import {RESERVE_DELETE, RESERVE_INSERT, RESERVE_UPDATE} from '../graphQl/mutation';
import {appointmentToReserve, reservesToAppointments} from '../utilits/dataHandlers';
import {GET_RESERVE} from '../graphQl/query';
import {FlexibleSpace} from '../components/flexibleSpace';
import {Snackbar, Tooltip} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';


import Button from '@mui/material/Button';


const mapStateToProps = ({currentRoom, rooms, user: {uid}}) => ({currentRoom, rooms, uid});


export const Schedule = connect(mapStateToProps)(({currentRoom, rooms, uid}) => {
  const [data, setData] = useState([]);


  const filter = {};
  if (currentRoom.id !== -1) {
    filter.room = {
      id: {
        eq: +currentRoom.id,
      },
    };
  }

  const {data: reserveGql = {}, refetch} = useQuery(GET_RESERVE, {
    variables: {
      filter: {...filter},
    },
  });
  useEffect(() => {
    if (reserveGql.reserve) {
      if (filter?.room?.id?.eq !== -1) {
        setData(reservesToAppointments(reserveGql.reserve));
      }
    }
  }, [reserveGql, currentRoom]);


  const [createReserve] = useMutation(RESERVE_INSERT);
  const [updateReserve] = useMutation(RESERVE_UPDATE);
  const [deleteReserve] = useMutation(RESERVE_DELETE);


  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentViewName, setCurrentViewName] = useState('Week');

  const [curData, setCurData] = useState(false);


  const [openSnackbar, setOpenSnackbar] =useState(false);
  const [snackbarText, setSnackbarText] =useState('Empty title');

  const handleSnackbarClose =()=>{
    setOpenSnackbar(false);
  };

  const handleSnackbarOpen=()=>{
    setSnackbarText('Error action');
    setOpenSnackbar(true);
  };

  const onCommitChanges = useCallback(({added, changed, deleted}) => {
    if (added) {
      const input = appointmentToReserve(
          {
            data: added,
            added: added.room,
            room: currentRoom,
            user: {id: uid, name: ''},
          });
      createReserve({variables: {input}}).then(() => refetch()).catch((error) => {
        console.log(error);
        handleSnackbarOpen();
      });
    }
    if (changed) {
      const id = Object.keys(changed)[0];
      const inputAppointment = {id, ...changed[id]};
      const input = {id};

      Object.keys(inputAppointment).forEach((el) => {
        switch (el) {
          case 'startDate':
            input.date_start = inputAppointment[el].toISOString();
            break;
          case 'endDate':
            input.date_end = inputAppointment[el].toISOString();
            break;
          case 'title':
            input.name = inputAppointment[el];
            break;
        }
      });

      updateReserve({variables: {input}}).then(() => refetch()).catch((error) => {
        handleSnackbarOpen();
        console.log(error);
      });
    }


    if (deleted !== undefined) {
      deleteReserve({variables: {input: {id: deleted}}}).then(() => refetch()).catch((error) => {
        console.log(error);
        handleSnackbarOpen();
      });
    }
  }, [currentRoom]);

  // eslint-disable-next-line react/display-name
  const TimeTableCellWeek = useCallback(React.memo(({onDoubleClick, ...restProps}) => (
    <WeekView.TimeTableCell
      {...restProps}
      onClick={onDoubleClick}
    >
      <div className={styles.cellText}>click to create</div>
    </WeekView.TimeTableCell>
  )), []);

  // eslint-disable-next-line react/display-name
  const TimeTableCellMonth = useCallback(React.memo(({onDoubleClick, ...restProps}) => (
    <MonthView.TimeTableCell
      {...restProps}
      onClick={()=>{
        setSnackbarText('Switch to week');
        setOpenSnackbar(true);
      }}
    >
      <div className={styles.cellText}>click to create</div>
    </MonthView.TimeTableCell>
  )), []);


  const roomsToResources = rooms.map((el) => ({
    text: el.name,
    id: el.id,
    color: el.color || 'black',
  }));


  const resources = [{
    fieldName: 'room',
    title: 'Rooms',
    instances: roomsToResources,
  }];

  const save = useRef(null);
  const cancel = useRef(null);


  return (
    <>
      <Paper
        className={currentRoom.id !== -1 ? 'paper' : ''}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            save.current.click();
          }
          if (e.key === 'Escape') {
            console.log('3');
            cancel.current.click();
          }
        }}
        onKeyUp={(e)=>{
          if (e.key==='Escape') {
            cancel.current.click();
          }
        }}
      >
        <Scheduler
          data={data}
          height={window.innerHeight}
        >
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}

          />
          <Toolbar flexibleSpaceComponent={FlexibleSpace}/>
          <DateNavigator/>

          <WeekView
            timeTableCellComponent={TimeTableCellWeek}
            startDayHour={6}

          />
          <ViewSwitcher/>
          <MonthView
            timeTableCellComponent={TimeTableCellMonth}
          />
          <DayView/>
          <Appointments/>

          <Resources data={resources}/>

          <EditingState
            defaultAddedAppointment = {{room: 10}}
            onCommitChanges={onCommitChanges}

            onAppointmentChangesChange={(props) => {
              if (!curData && props.title ) {
                setCurData(true);
              }
              if (curData && !props.title) {
                setCurData(false);
              }
            }}
            onAddedAppointmentChange={(props) => {
              if (currentRoom.id!==-1) {
                if (!curData && props.title) setCurData(true);
              } else {
                if (!curData && props.title && props.room) setCurData(true);
              }
              if (curData && !props.title) {
                setCurData(false);
              }
            }}
          />

          <IntegratedEditing/>


          <AppointmentTooltip
            showOpenButton
            showDeleteButton={true}
          />
          <AppointmentForm
            commandLayoutComponent={
              (props) => {
                return <AppointmentForm.CommandLayout {...props}
                  disableSaveButton={!curData}
                  commandButtonComponent={
                    (props) => {
                      if (props.id==='cancelButton') {
                        return <div ref={cancel}
                          style={{
                            marginRight: 'auto',
                            cursor: 'pointer',
                          }} onClick={props.onExecute}>
                          <CloseIcon/></div>;
                      }
                      if (props.id==='deleteButton') {
                        return <DeleteIcon
                          onClick={props.onExecute}
                          sx={{
                            cursor: 'pointer',
                            color: 'rgba(0, 0, 0, 0.54)',
                            borderRight: '1px solid rgba(0, 0, 0, 0.54)',
                            mr: 0.5,
                          }}
                        />;
                      }

                      return <Button sx={{color: !curData?'lightgray':''}}
                        ref={save} variant={'contained'}

                        onClick={props.onExecute}>Save</Button>;
                    }
                  }
                  onCommitButtonClick={(propses) => {
                    if (!curData) {
                      setSnackbarText('Please fill form');
                      setOpenSnackbar(true);
                    } else {
                      props.onCommitButtonClick(propses);
                    }
                  }}
                />;
              }
            }
            textEditorComponent={(props) => {
              return <AppointmentForm.TextEditor {...props} autoFocus={true}/>;
            }}
          />
          <DragDropProvider
            allowDrag={() => true}
            allowResize={() => true}
          />

        </Scheduler>

      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarText}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      />
    </>
  );
});


