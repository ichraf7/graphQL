import { User } from './user.model';

export class Tweet {

  id? : string;
  tags: string;
  text: string;
  user:User ;
  user_id? :string
  constructor (tags: string,text: string,user_id :string ,user?:User, id?: string ) {
   
  this.tags=tags ;
  this.text=text ;
  this.user_id=user_id
  this.user=user? 
  this.id=id?
}
}
