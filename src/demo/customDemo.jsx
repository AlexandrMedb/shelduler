import * as React from 'react';
import {
  darken, alpha, lighten,
} from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import {ViewState, EditingState} from '@devexpress/dx-react-scheduler';

import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  Resources,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';

import {owners} from './data/demoData';


const getBorder = (theme) => (`1px solid ${
    theme.palette.mode === 'light' ?
        lighten(alpha(theme.palette.divider, 1), 0.88) :
        darken(alpha(theme.palette.divider, 1), 0.68)
}`);

const DayScaleCell = (props) => (
  <MonthView.DayScaleCell {...props} style={{textAlign: 'center', fontWeight: 'bold'}} />
);


const appointments = [
  {
    id: 0,
    title: 'Watercolor Landscape',
    startDate: new Date(2018, 6, 23, 9, 30),
    endDate: new Date(2018, 6, 23, 11, 30),
    ownerId: 1,
  }, {
    id: 1,
    title: 'Monthly Planning',
    startDate: new Date(2018, 5, 28, 9, 30),
    endDate: new Date(2018, 5, 28, 11, 30),
    ownerId: 1,
  }, {
    id: 2,
    title: 'Recruiting students',
    startDate: new Date(2018, 6, 9, 12, 0),
    endDate: new Date(2018, 6, 9, 13, 0),
    ownerId: 2,
  }, {
    id: 3,
    title: 'Oil Painting',
    startDate: new Date(2018, 6, 18, 14, 30),
    endDate: new Date(2018, 6, 18, 15, 30),
    ownerId: 2,
  }, {
    id: 4,
    title: 'Open Day',
    startDate: new Date(2018, 6, 20, 12, 0),
    endDate: new Date(2018, 6, 20, 13, 35),
    ownerId: 6,
  }, {
    id: 5,
    title: 'Watercolor Landscape',
    startDate: new Date(2018, 6, 6, 13, 0),
    endDate: new Date(2018, 6, 6, 14, 0),
    rRule: 'FREQ=WEEKLY;BYDAY=FR;UNTIL=20180816',
    exDate: '20180713T100000Z,20180727T100000Z',
    ownerId: 2,
  }, {
    id: 6,
    title: 'Meeting of Instructors',
    startDate: new Date(2018, 5, 28, 12, 0),
    endDate: new Date(2018, 5, 28, 12, 30),
    rRule: 'FREQ=WEEKLY;BYDAY=TH;UNTIL=20180727',
    exDate: '20180705T090000Z,20180719T090000Z',
    ownerId: 5,
  }, {
    id: 7,
    title: 'Oil Painting for Beginners',
    startDate: new Date(2018, 6, 3, 11, 0),
    endDate: new Date(2018, 6, 3, 12, 0),
    rRule: 'FREQ=WEEKLY;BYDAY=TU;UNTIL=20180801',
    exDate: '20180710T080000Z,20180724T080000Z',
    ownerId: 3,
  }, {
    id: 8,
    title: 'Watercolor Workshop',
    startDate: new Date(2018, 6, 9, 11, 0),
    endDate: new Date(2018, 6, 9, 12, 0),
    ownerId: 3,
  },
];

const resources = [{
  fieldName: 'ownerId',
  title: 'Owners',
  instances: owners,
}];


export class CustomDemo extends React.PureComponent {
  // #FOLD_BLOCK
  constructor(props) {
    super(props);

    this.state = {
      data: appointments,
    };
  }


  render() {
    const {data} = this.state;

    return (
      <Paper>
        <Scheduler
          data={data}
        >
          <EditingState
            // onCommitChanges={this.commitChanges}
          />
          <ViewState
            defaultCurrentDate="2018-07-17"
          />

          <MonthView
          />
          <Resources
            data={resources}
          />
          <Appointments
          />

          <Toolbar
          />
          <DateNavigator />
          <EditRecurrenceMenu />
          <AppointmentTooltip
            showCloseButton
            showDeleteButton
            showOpenButton
          />
          <AppointmentForm />
          <DragDropProvider />
        </Scheduler>
      </Paper>
    );
  }
}
