import * as React from 'react';
import List from '@mui/material/List';
import {Link} from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export default function AdminPanel() {
  return (
    <List sx={{width: 190, borderRight: '1px solid lightgray', minHeight: '100vh',
      boxSizing: 'borderBox'}}>
      <NavBarItem icon={<CalendarMonthIcon/>} link={'/'} text={'Календарь'}/>
      <NavBarItem icon={<RoomPreferencesIcon/>} link={'/rooms'} text={'Комнаты'}/>
      {/* <NavBarItem icon={<GroupIcon/>} link={'/users'} text={'Пользователи'}/>*/}
    </List>
  );
}

interface props {
    link: string,
    icon: any,
    text: string
}

export const NavBarItem = ({text, icon, link}:props) => {
  return (
    <Link to={link} style={{color: 'rgb(68,68,68)', textDecoration: 'none'}}>
      <ListItem sx={{p: 1}}>
        {icon}
        <ListItemText sx={{ml: 2}}
          primary={text}
        />
      </ListItem>
    </Link>
  );
};
