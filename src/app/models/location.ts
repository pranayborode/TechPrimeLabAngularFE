export class Location {
    locationId?:number;
    locationName?:string;

    constructor(locationId:number,locationName:string){
        this.locationId = locationId;
        this.locationName = locationName;
    }
}
