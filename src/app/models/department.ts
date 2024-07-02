export class Department {
    departmentId?:number;
    departmentName?:string;

    constructor(departmentId:number,departmentName:string){
        this.departmentId = departmentId;
        this.departmentName =departmentName;
    }
}
