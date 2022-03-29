import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/FormControl';
import {styled} from '@mui/material/styles';
import {ViewState, EditingState,
  IntegratedEditing, MonthView} from '@devexpress/dx-react-scheduler';
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
} from '@devexpress/dx-react-scheduler-material-ui';


import {appointments} from '../data/demo';
import {Autocomplete, TextField} from '@mui/material';
import {connect} from 'react-redux';
import {roomInterface} from '../interfaces/shelduleInterfaces';

const PREFIX = 'Demo';
export const classes = {
  container: `${PREFIX}-container`,
  text: `${PREFIX}-text`,
  formControlLabel: `${PREFIX}-formControlLabel`,
};
const StyledDiv = styled('div')(({theme}) => ({
  [`&.${classes.container}`]: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
  },
  [`& .${classes.text}`]: theme.typography.h6,
  [`& .${classes.formControlLabel}`]: {
    ...theme.typography.caption,
    fontSize: '1rem',
  },
}));


const editingOptionsList = [
  {id: 'allowAdding', text: 'Adding'},
  {id: 'allowDeleting', text: 'Deleting'},
  {id: 'allowUpdating', text: 'Updating'},
  {id: 'allowResizing', text: 'Resizing'},
  {id: 'allowDragging', text: 'Dragging'},
];

const EditingOptionsSelector = ({
  options, onOptionsChange,
}) => (
  <StyledDiv className={classes.container}>
    <Typography className={classes.text}>
            Enabled Options
    </Typography>
    <FormGroup row>
      {editingOptionsList.map(({id, text}) => (
        <FormControlLabel
          control={(
            <Checkbox
              checked={options[id]}
              onChange={onOptionsChange}
              value={id}
              color="primary"
            />
          )}
          classes={{label: classes.formControlLabel}}
          label={text}
          key={id}
          disabled={(id === 'allowDragging' || id === 'allowResizing') && !options.allowUpdating}
        />
      ))}
    </FormGroup>
  </StyledDiv>
);


const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
  [`&.${classes.flexibleSpace}`]: {
    margin: '0 auto 0 0',
    display: 'flex',
    alignItems: 'center',
  },
}));

const FlexibleSpace = ({props}) => (
  <Autocomplete
    disablePortal
    id="combo-box-demo"
    options={['top100Films']}
    sx={{width: 300}}
    renderInput={(params) => <TextField {...params} label="Movie" />}
  />
);


const mapStateToProps =(state)=> {
  const {reserve}=state;
  return {reserve};
};


export const AllFeatures= connect(mapStateToProps)(({reserve}) => {
  const [data, setData] = useState([]);
  useEffect(()=>{
    const dataHandled=reserve.map((el)=>({
      title: el.name,
      startDate: new Date(el.date_start),
      endDate: new Date(el.date_end),
      id: el.id,
      location: el.room.name,
    }));
    setData(dataHandled);
  }, [reserve]);

  const [currentDate, setCurrentDate]= useState('2018-06-27');
  const [currentViewName, setCurrentViewName]= useState('Week');
  const [editingOptions, setEditingOptions] = React.useState({
    allowAdding: true,
    allowDeleting: true,
    allowUpdating: true,
    allowDragging: true,
    allowResizing: true,
  });
  const [addedAppointment, setAddedAppointment] = React.useState({});
  const [isAppointmentBeingCreated, setIsAppointmentBeingCreated] = React.useState(false);

  const {
    allowAdding, allowDeleting, allowUpdating, allowResizing, allowDragging,
  } = editingOptions;

  const onCommitChanges = React.useCallback(({added, changed, deleted}) => {
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      setData([...data, {id: startingAddedId, ...added}]);
    }
    if (changed) {
      setData(data.map((appointment) => (
                changed[appointment.id] ?
                  {...appointment, ...changed[appointment.id]} : appointment)));
    }
    if (deleted !== undefined) {
      setData(data.filter((appointment) => appointment.id !== deleted));
    }
    setIsAppointmentBeingCreated(false);
  }, [setData, setIsAppointmentBeingCreated, data]);
  const onAddedAppointmentChange = React.useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  });
  const handleEditingOptionsChange = React.useCallback(({target}) => {
    const {value} = target;
    const {[value]: checked} = editingOptions;
    setEditingOptions({
      ...editingOptions,
      [value]: !checked,
    });
  });

  // eslint-disable-next-line react/display-name
  const TimeTableCell = React.useCallback(React.memo(({onDoubleClick, ...restProps}) => (
    <WeekView.TimeTableCell
      {...restProps}
      onDoubleClick={allowAdding ? onDoubleClick : undefined}
    />
  )), [allowAdding]);

  const CommandButton = React.useCallback(({id, ...restProps}) => {
    if (id === 'deleteButton') {
      return <AppointmentForm.CommandButton id={id} {...restProps} disabled={!allowDeleting} />;
    }
    return <AppointmentForm.CommandButton id={id} {...restProps} />;
  }, [allowDeleting]);

  const allowDrag = React.useCallback(
      () => allowDragging && allowUpdating,
      [allowDragging, allowUpdating],
  );
  const allowResize = React.useCallback(
      () => allowResizing && allowUpdating,
      [allowResizing, allowUpdating],
  );


  return (
    <React.Fragment>
      <Paper>
        <Scheduler
          data={data}
          height={600}
        >
          {/* <Toolbar flexibleSpaceComponent={FlexibleSpace} />*/}
          <Toolbar />
          <ViewState
            currentDate={currentDate}
            onCurrentDateChange={setCurrentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}

          />
          <DateNavigator />
          <TodayButton/>
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
          <DayView/>
          <ViewSwitcher />


          <EditingState
            onCommitChanges={onCommitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={onAddedAppointmentChange}
          />

          <IntegratedEditing />
          <WeekView
            startDayHour={9}
            endDayHour={19}
            timeTableCellComponent={TimeTableCell}
          />

          <Appointments />

          <AppointmentTooltip
            showOpenButton
            showDeleteButton={allowDeleting}
          />
          <AppointmentForm
            commandButtonComponent={CommandButton}
            readOnly={isAppointmentBeingCreated ? false : !allowUpdating}
          />
          <DragDropProvider
            allowDrag={allowDrag}
            allowResize={allowResize}
          />


        </Scheduler>
      </Paper>
    </React.Fragment>
  );
});
