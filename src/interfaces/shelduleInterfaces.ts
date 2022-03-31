interface common {
    id:number,
    name:string
}

export interface roomInterface extends common{
    color?:string
}

export interface creatorInterface {
    id:string,
    name:string
}

export interface reserveInterface extends common{
    date_end: string,
    date_start: string,
    room: roomInterface,
    creator: creatorInterface,
}

export interface reserveAddInterface{
    name:string,
    date_end: string,
    date_start: string,
    room: {
        connect: number
    },
    creator:{
        connect:string
    }
}

export interface reserveUpdateInterface{
    id:number;
    name?:string,
    date_end?: string,
    date_start?: string,
    room?: {
        connect: number
    },
    creator?:{
        connect:string
    }
}

export interface appointmentInterface {
    title: string,
    startDate: Date,
    endDate: Date,
    id: number,
    location: string,
}
