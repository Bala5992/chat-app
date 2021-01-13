import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chat-app';

  hasJoined:boolean=false;
  room:string='Standard';
  isUserAvailable:boolean=true;
  // username:string;
  // message:string;
  messageArray:any=[];
  rooms={};
  users:string[]=[];

  username = new FormControl('', [Validators.required]);
  message = new FormControl('', [Validators.required]);

  constructor(private chatService:ChatService) {
    chatService.joinRoom().subscribe(data=>{

      this.users=data.rooms;
      console.log(data.rooms);
      if (data.error) {
        this.isUserAvailable=false;
        this.reset();
        return false;
      }
      this.messageArray.push(data);
    });
    chatService.leaveRoom().subscribe(data=>{
      this.users=data.rooms;
      this.messageArray.push(data);
      console.log(data.rooms);
    });
    chatService.sendMessage().subscribe(data=>{
      this.users=data.rooms;
      this.messageArray.push(data);
      console.log(data.rooms);
    });
  }

  join() {
    this.chatService.makeEvent('join',{user:this.username.value,room:this.room});
    this.hasJoined=true;
  }

  leave() {
    this.reset();
    this.isUserAvailable=true;
    this.chatService.makeEvent('leave',{user:this.username.value,room:this.room});
  }

  send() {
    this.chatService.makeEvent('message',{user:this.username.value,room:this.room,message:this.message.value});
    this.resetMessage();
  }

  resetMessage() {
    this.message=new FormControl('', [Validators.required]);
  }

  reset() {
    this.hasJoined=false;
    this.resetMessage();
    this.messageArray=[];
    this.users=[];

  }
}
