import { Component } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { send } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Chat Client';
  private hubConnection: HubConnection;
  username = 'Suresh';
  message = 'Hi!';
  messages: Message[] = [];
  joinForm: boolean = true;
  chatForm: boolean = false;

  ngOnInit() {
  }

  public join(): void {
    this.hubConnection = new HubConnectionBuilder().withUrl("http://localhost:12081/chat").build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :( ' + err));

    this.hubConnection.on('sendToAll', (nick: string, receivedMessage: string) => {
      this.messages.push(new Message(nick, receivedMessage));
    });
    this.joinForm = false;
    this.chatForm = true;
  }

  public sendMessage(): void {
    this.hubConnection
      .invoke('sendToAll', this.username, this.message)
      .catch(err => console.error(err));
    this.message = '';
  }
}

export class Message {
  public sender: string;
  public message: string;
  constructor(sender: string, msg: string) {
    this.sender = sender;
    this.message = msg;
  }
}
