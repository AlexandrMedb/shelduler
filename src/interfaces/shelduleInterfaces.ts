export interface roomInterface{
    id:number,
    name:string
}

interface creatorInterface{
    id:number,
    name:string
}

export interface reserveInterface {
    date_end: string,
    date_start: string,
    name:string,
    id:number,
    room: roomInterface,
    creator: creatorInterface,
}

