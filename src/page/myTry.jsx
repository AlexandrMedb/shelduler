import  {useState} from 'react';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {DayView, MonthView, ViewState, ViewSwitcher} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Toolbar,
    DateNavigator,
    Appointments,
    TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';

import { appointments } from '../data/demo';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';



export  const MyTry =()=>  {

    const [data, setData]= useState(appointments);
    const [currentDate, setCurrentDate]= useState('2018-06-27');
    const [currentViewName, setCurrentViewName]= useState('work-week');



    return (
        <Paper>
            <Scheduler
                data={data}
                height={660}
            >
                <ViewState
                    currentDate={currentDate}
                    onCurrentDateChange={setCurrentDate}
                />
                <WeekView
                    startDayHour={9}
                    endDayHour={19}
                />
                <Toolbar />
                <DateNavigator />
                <TodayButton />
                <Appointments />
            </Scheduler>
        </Paper>

);

};







const ExternalViewSwitcher = ({
                                  currentViewName,
                                  onChange,
                              }) => (
    <RadioGroup
        aria-label="Views"
        style={{ flexDirection: 'row' }}
        name="views"
        value={currentViewName}
        onChange={onChange}
    >
        <FormControlLabel value="Week" control={<Radio />} label="Week" />
        <FormControlLabel value="Work Week" control={<Radio />} label="Work Week" />
    </RadioGroup>
);

export  class ViewTry extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: appointments,
            currentViewName: 'Month',
        };

        this.currentViewNameChange = (e) => {
            this.setState({ currentViewName: e.target.value });
        };
    }

    render() {
        const { data, currentViewName } = this.state;

        return (
            <React.Fragment>
                <ExternalViewSwitcher
                    currentViewName={currentViewName}
                    onChange={this.currentViewNameChange}
                />

                <Paper>
                    <Scheduler
                        data={data}
                        height={660}
                    >
                        <ViewState
                            defaultCurrentDate="2018-07-25"
                            currentViewName={currentViewName}
                        />
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

                        <Appointments />
                    </Scheduler>
                </Paper>
            </React.Fragment>
        );
    }
}
