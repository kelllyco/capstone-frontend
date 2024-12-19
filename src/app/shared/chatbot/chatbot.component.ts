import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotHttpService } from "../../services/chatbot.service";
import { BehaviorSubject, concatMap, map, take } from 'rxjs';
import  * as marked from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messageWrapper') messageWrapper!: ElementRef;
  chatLog$: BehaviorSubject<chat[]> = new BehaviorSubject<chat[]>([]);
  messageInput: string = '';

  constructor(private chatbotHttp: ChatbotHttpService, private sanitizer: DomSanitizer) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messageWrapper) {
      const element = this.messageWrapper.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  chat() {
    const message = this.messageInput;
    this.chatLog$.pipe(
      take(1),
      map(chatLog => {
        const updatedChatLog = chatLog.concat({ message: message, response: null });
        this.chatLog$.next(updatedChatLog);
    })
    ).subscribe();

    setTimeout(() => {
      this.chatbotHttp.chat(message).pipe(
        take(1),
        concatMap(res => {
          return this.chatLog$.pipe(
            take(1),
            map(async chatLog =>         { 
              let markdownRes = marked.parse(res.response);
              if (markdownRes instanceof Promise) {
                markdownRes = await markdownRes;
              }
              chatLog[chatLog.length - 1].response = this.sanitizer.bypassSecurityTrustHtml(markdownRes);
              this.chatLog$.next([...chatLog]);

            return chatLog;})
          )
        })
      ).subscribe();
    }, 1000);
    this.messageInput = '';
  }
}

export interface chat {
  message: string;
  response: SafeHtml | null;
}

