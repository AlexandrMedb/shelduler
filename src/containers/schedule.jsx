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
import {TextField} from '@mui/material';

const mapStateToProps = ({currentRoom, rooms}) => ({currentRoom, rooms});

// interface props {
//   reserve: reserveInterface[]
// }

// interface schedule {
//   title: string,
//   startDate: SetStateAction<Date>,
//   endDate: SetStateAction<Date>,
//   id: number,
//   location: string,
// }

export const Schedule = connect(mapStateToProps)(({currentRoom, rooms}) => {
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

  const [curData, setCurData] = useState({});

  console.log(curData);

  const onCommitChanges = useCallback(({added, changed, deleted}) => {
    if (added) {
      const input = appointmentToReserve(
          {
            data: added,
            added: added.room,
            room: currentRoom,
            user: {id: 'user1', name: '2'},
          });

      createReserve({variables: {input}}).then(() => refetch()).catch((error) => {
        console.log(error);
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
        console.log(error);
      });
    }


    if (deleted !== undefined) {
      deleteReserve({variables: {input: {id: deleted}}}).then(() => refetch()).catch((error) => {
        console.log(error);
      });
    }
  }, []);

  // eslint-disable-next-line react/display-name
  const TimeTableCell = useCallback(React.memo(({onDoubleClick, ...restProps}) => (
    <WeekView.TimeTableCell
      {...restProps}
      onClick={onDoubleClick}
    >
      <div className={styles.cellText}>click to create</div>
    </WeekView.TimeTableCell>
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
    <Paper onKeyDown={(e) => {
      if (e.key === 'Enter') {
        save.current.click();
      }
      if (e.key==='Esc') {
        cancel.current.click();
      }
    }}
    className={currentRoom.id !== -1 ? 'paper' : ''}
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
          timeTableCellComponent={TimeTableCell}
          startDayHour={6}
          // endDayHour={19}

        />
        <ViewSwitcher/>
        <MonthView/>
        <DayView/>
        <Appointments/>

        <Resources data={resources}/>

        <EditingState
          onCommitChanges={onCommitChanges}
          // preCommitChanges={(a)=>{
          //   console.log('preCommitChanges', a);
          //   // return 'a'
          // }}
          onAppointmentChangesChange={(a) => {
            console.log('onAppointmentChangesChange', a);
            // return 'a'
          }}
          onAddedAppointmentChange={(a) => {
            console.log('onAddedAppointmentChange', a);
            setCurData(a);
            // return 'a'
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
              console.dir(props);
              return <AppointmentForm.CommandLayout {...props}

                commandButtonComponent={
                  (props) => {
                    console.log(props);

                    return <button ref={props.id === 'saveButton' ? save : undefined}
                      onClick={props.onExecute}>{props.id}</button>;
                  }
                }
                onCommitButtonClick={(propss) => {
                  console.log(propss);
                  console.log(curData);
                  if (!curData.title) {
                    alert('!!!!!!!!!!');
                  } else {
                    props.onCommitButtonClick(props);
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

  );
});


