import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket=io('http://localhost:4000');

  constructor() { }

  makeEvent(event,data) {
    this.socket.emit(event,data);
  }

  joinRoom() {
    let observable=new Observable<{user:string,message:string,rooms:any,error:boolean}>(obs=>{
      this.socket.on('user join', data=>{
        obs.next(data);
      });
      this.socket.on('user not available', data=>{
        obs.next(data);
      });
      return () => this.socket.disconnect();
    });

    return observable;
  }

  leaveRoom() {
    let observable=new Observable<{user:string,message:string,rooms:any}>(obs=>{
      this.socket.on('user left', data=>{
        obs.next(data);
      });
      return () => this.socket.disconnect();
    });

    return observable;
  }

  sendMessage() {
    let observable=new Observable<{user:string,message:string,rooms:any}>(obs=>{
      this.socket.on('pass message', data=>{
        obs.next(data);
      });
      return () => this.socket.disconnect();
    });

    return observable;
  }
}
