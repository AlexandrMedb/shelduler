import {useCallback, useEffect, useState} from 'react';
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

const mapStateToProps =({currentRoom, rooms})=> ({currentRoom, rooms});

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

export const Schedule= connect(mapStateToProps)(({currentRoom, rooms}) => {
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
      if (filter?.room?.id?.eq!==-1) {
        setData( reservesToAppointments(reserveGql.reserve));
      }
    }
  }, [reserveGql, currentRoom]);


  const [createReserve] = useMutation(RESERVE_INSERT);
  const [updateReserve] = useMutation(RESERVE_UPDATE);
  const [deleteReserve] = useMutation(RESERVE_DELETE);


  const [currentDate, setCurrentDate]= useState(new Date().toISOString().split('T')[0]);
  const [currentViewName, setCurrentViewName]= useState('Week');

  const Comp =(props)=> {
    console.log(props);
    return <div></div>;
  };

  const onCommitChanges = useCallback(({added, changed, deleted}) => {
    if (added) {
      const input =appointmentToReserve(
          {data: added,
            added: added.room,
            room: currentRoom,
            user: {id: 'user1', name: '2'}});
      console.log(input);

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


  const roomsToResources = rooms.map((el)=>({
    text: el.name,
    id: el.id,
    color: el.color || 'black',
  }));


  const resources = [{
    fieldName: 'room',
    title: 'Rooms',
    instances: roomsToResources,
  }];

  const BasicLayout = ({onFieldChange, appointmentData, ...restProps}) => {
    console.log(restProps);
    const onCustomFieldChange = (nextValue) => {
      onFieldChange({customField: nextValue});
    };

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        {/* <AppointmentForm.Label*/}
        {/*  text="Custom Field"*/}
        {/*  type="title"*/}
        {/* />*/}
        {/* <AppointmentForm.TextEditor*/}
        {/*  value={appointmentData.customField}*/}
        {/*  onValueChange={onCustomFieldChange}*/}
        {/*  placeholder="Custom field"*/}
        {/* />*/}
      </AppointmentForm.BasicLayout>
    );
  };

  const CommandButton = React.useCallback(({id, ...restProps}) => {
    console.log(id);
    console.log(restProps);
    if (id === 'deleteButton') {
      return <AppointmentForm.CommandButton id={id} {...restProps} disabled={!allowDeleting} />;
    }
    return <AppointmentForm.CommandButton id={id} {...restProps} />;
  });

  // const allowDrag = React.useCallback(
  //     () => allowDragging && allowUpdating,
  //     [allowDragging, allowUpdating],
  // );
  // const allowResize = React.useCallback(
  //     () => allowResizing && allowUpdating,
  //     [allowResizing, allowUpdating],
  // );


  return (
    <Paper
      className={currentRoom.id!==-1?'paper':''}
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
        <Toolbar flexibleSpaceComponent={FlexibleSpace} />
        <DateNavigator />

        <WeekView
          timeTableCellComponent={TimeTableCell}
          startDayHour={6}
          // endDayHour={19}

        />
        <ViewSwitcher />
        <MonthView/>
        <DayView/>
        <Appointments/>

        <Resources data={resources}/>

        <EditingState
          onCommitChanges={onCommitChanges}
        />

        <IntegratedEditing />


        <AppointmentTooltip
          showOpenButton
          showDeleteButton={true}
        />
        <AppointmentForm
          // basicLayoutComponent={BasicLayout}
          commandButtonComponent={CommandButton}
        />
        <Comp/>
        <DragDropProvider
          allowDrag={() => true}
          allowResize={()=>true}
        />

      </Scheduler>
    </Paper>

  );
});


