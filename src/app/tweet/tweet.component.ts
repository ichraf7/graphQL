import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo} from 'apollo-angular';
import { Tweet } from '../tweets.model';
import gql from 'graphql-tag';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

const GET_TWEETS = gql`
query Tweets {
  tweet {
    user {
      description
      full_name
    }
    tags
    text
    tweet_id
  }
}`;

const ADD_TWEET = gql `
mutation ADD_TWEET($tags:String! ,$text: String! , $user_id: uuid!) {
  insert_tweet(objects: {tags: $tags, text: $text, user_id: $user_id}) {
    returning {
      tags
      text
      tweet_id
      user {
        description
        full_name
        user_id
      }
    }
  }
}` ;

const UPDATE_TWEET= gql `
mutation UPDATE_TWEET($tweet_id: uuid!, $text: String!) {
  update_tweet(where: {tweet_id: {_eq: $tweet_id}}, _set: {text: $text}) {
    returning {
      tags
      text
      tweet_id
      user {
        description
        full_name
        user_id
      }
    }
  }
}`;

const DELETE_TWEET = gql `
mutation DELETE_TWEET($user_id: uuid!, $tweet_id: uuid!) {
  delete_tweet(where: {user_id: {_eq: $user_id}, tweet_id: {_eq: $tweet_id}}){
    returning {
      tags
      text
      tweet_id
      user_id
    }
  }
}
`;

@Component({
  selector: 'tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})

export class TweetComponent implements OnInit , OnDestroy {
  private tweets$ :  Subscription = new Subscription();
  allTweets: Tweet[]= [];

  form: FormGroup | any;

  constructor(private apollo :Apollo, private fb :FormBuilder) { }
  
  localStorage :any= localStorage.setItem("user", "3e44e477-2333-49d9-afec-fdbfaf0b3670");
  
  ngOnInit(): void {
    
    this.form=this.fb.group({
      tags : new FormControl('' , Validators.required),
      text : new FormControl('', Validators.required) ,
      user_id : new FormControl(localStorage.getItem('user'))
    })
    // query all tweets
    this.tweets$=this.apollo.watchQuery({
    query :GET_TWEETS
   }).valueChanges.subscribe((res :any) =>{
     this.allTweets= res.data.tweet
   }) 

  }

  ngOnDestroy(): void{
   this.tweets$.unsubscribe()
 }

 addTweet(){
 // add the tweet to tweet array 
 let tweet : Tweet = new Tweet(this.form.value.tags,this.form.value.text,this.form.value.user_id)
 this.allTweets.push(tweet)
 
 
    this.apollo.mutate({
      mutation : ADD_TWEET, 
      variables:{
        tags:this.form.value.tags ,
        text: this.form.value.text,
        user_id: this.form.value.user_id
      },
    }).subscribe((response : any)=>{
      console.log(response)
    })
 }

 updateTweet(tweetId: string, text: string){
    this.apollo.mutate({
     mutation : UPDATE_TWEET ,
     variables :{
      tweet_id:tweetId ,
      text: text,
     }
   }).subscribe((response : any)=>{
  })
 }

 deleteTweet(tweetId: any){
   this.allTweets= this.allTweets.filter(item =>item.id  !== tweetId)
  let user_id: any = localStorage.get("user")
  this.apollo.mutate({
    mutation : DELETE_TWEET ,
    variables :{
     tweet_id:tweetId ,
     user_id: user_id,
    }
  }).subscribe((response : any)=>{
    console.log(response.data)
  })
}

}
