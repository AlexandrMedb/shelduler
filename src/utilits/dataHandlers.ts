import {
  appointmentInterface,
  creatorInterface, reserveAddInterface,
  reserveInterface,
  roomInterface,
} from 'interfaces/shelduleInterfaces';

export const reservesToAppointments=(data:reserveInterface[])=>(
  data.map((el)=>({
    title: el.name,
    startDate: new Date(el.date_start),
    endDate: new Date(el.date_end),
    id: el.id,
    location: el.room.name,
  })));


export const appointmentToReserve =({data, room, user}:{
  data:appointmentInterface,
  room:roomInterface,
  user:creatorInterface,
} ):reserveAddInterface=>({
  date_start: data.startDate.toISOString(),
  date_end: data.endDate.toISOString(),
  // eslint-disable-next-line max-len
  // date_end: new Date(new Date(data.startDate).setHours(data.startDate.getHours()+1)).toISOString(),
  name: data.title,
  room: {
    connect: room.id,
  },
  creator: {
    connect: user.id,
  },
});

