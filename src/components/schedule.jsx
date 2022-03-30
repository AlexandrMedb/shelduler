import {useCallback, useEffect, useState} from 'react';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {connect} from 'react-redux';
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
  TodayButton, ViewSwitcher,
  DayView,
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui';
// import {AppointmentForm} from '@devexpress/dx-react-scheduler';
import {useMutation, useQuery} from '@apollo/client';
import {RESERVE_DELETE, RESERVE_INSERT, RESERVE_UPDATE} from '../graphQl/mutation';
import {appointmentToReserve, reservesToAppointments} from '../utilits/dataHandlers';
import {GET_RESERVE} from '../graphQl/query';
import {FlexibleSpace} from '../components/flexibleSpace';

const mapStateToProps =({reserve, currentRoom})=> ({reserve, currentRoom});

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

export const Schedule= connect(mapStateToProps)(({reserve, currentRoom}) => {
  const [data, setData] = useState([]);


  const filter={};
  if (currentRoom.id!==-1) {
    filter.room={
      id: {
        eq: +currentRoom.id,
      },
    };
  }

  const {data: reserveGql = {}, refetch} = useQuery(GET_RESERVE, {
    variables: {
      filter: {...filter},
    }});
  useEffect(() => {
    if (reserveGql.reserve) {
      if (filter.room.id.eq!==-1) {
        setData( reservesToAppointments(reserveGql.reserve));
      }
    }
  }, [reserveGql, currentRoom]);


  const [createReserve] = useMutation(RESERVE_INSERT);
  const [updateReserve] = useMutation(RESERVE_UPDATE);
  const [deleteReserve] = useMutation(RESERVE_DELETE);


  const [currentDate, setCurrentDate]= useState(new Date().toISOString().split('T')[0]);
  const [currentViewName, setCurrentViewName]= useState('Week');
  const [addedAppointment, setAddedAppointment] = useState({});


  const onCommitChanges = useCallback(({added, changed, deleted}) => {
    if (added) {
      const input =appointmentToReserve(
          {data: added, room: currentRoom, user: {id: 'user1', name: '2'}});
      createReserve({variables: {input}}).then(()=>refetch()).catch((error)=>{
        console.log(error);
      });
    }
    if (changed) {
      const id=Object.keys(changed)[0];
      const inputAppointment={id, ...changed[id]};
      const input ={id};

      Object.keys(inputAppointment).forEach((el)=> {
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

      updateReserve({variables: {input}}).then(()=>refetch()).catch((error)=>{
        console.log(error);
      });
    }


    if (deleted !== undefined) {
      deleteReserve({variables: {input: {id: deleted}}}).then(()=>refetch()).catch((error)=>{
        console.log(error);
      });
    }
  }, [setData, data]);


  return (
    <Paper>
      <Scheduler
        data={data}
        height={window.innerHeight}
      >
        <Toolbar flexibleSpaceComponent={FlexibleSpace} />

        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={setCurrentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}

        />
        <DateNavigator />
        {/* <TodayButton/>*/}
        <WeekView
          startDayHour={10}
          endDayHour={19}
        />
        <WeekView
          name="Work Week"
          excludedDays={[0, 6]}
          startDayHour={9}
          endDayHour={19}
        />
        <MonthView/>
        <DayView/>
        <ViewSwitcher />


        <EditingState
          onCommitChanges={onCommitChanges}
          addedAppointment={addedAppointment}
          onAddedAppointmentChange={(appointment)=>setAddedAppointment(appointment)}
        />

        <IntegratedEditing />
        <WeekView
          startDayHour={9}
          endDayHour={19}
        />

        <Appointments />

        <AppointmentTooltip
          showOpenButton
          showDeleteButton={true}
        />
        <AppointmentForm booleanEditorComponent={()=><div></div>}/>
        <DragDropProvider
          allowDrag={() => true}
          allowResize={()=>true}
        />
      </Scheduler>
    </Paper>

  );
});
