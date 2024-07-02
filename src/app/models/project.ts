import { Category } from "./category";
import { Department } from "./department";
import { Division } from "./division";
import { Location } from "./location";
import { Priority } from "./priority";
import { Reason } from "./reason";
import { Status } from "./status";
import { Types } from "./types";

export class Project {
    projectId?: number;
    projectName?: string;
    reason?: Reason;
    reasonName?:Reason;
    types?: Types;
    typeName?:Types;
    division?: Division;
    divisionName?:Division;
    category?: Category;
    categoryName?:Category;
    priority?: Priority;
    priorityName?:Priority;
    department?: Department;
    departmentName?:Department;
    location?: Location;
    locationName?:Location;
    status?: Status;
    statusName?:Status;
    startDate?: Date;
    endDate?: Date;
    
}
