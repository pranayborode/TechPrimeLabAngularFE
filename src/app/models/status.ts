export class Status {
    statusId?:number;
    statusName?:string;

    constructor(statusId: number, statusName: string) {
        this.statusId = statusId;
        this.statusName = statusName;
    }
}
