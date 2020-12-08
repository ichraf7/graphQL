export class User {
    public id : string ;
    public description:string;
    public full_name:string ;

    constructor( id: string,
        description:string,
        full_name:string ){
            this.id=id ;
            this.description=description;
            this.full_name=full_name
        }
     
}
