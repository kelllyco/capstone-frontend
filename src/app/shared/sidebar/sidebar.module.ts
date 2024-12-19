import { NgModule } from "@angular/core";
import { SidebarComponent } from "./sidebar.component";
import { SharedModule } from "../shared.module";
import { ChatbotModule } from "../chatbot/chatbot.module";

@NgModule({
    declarations: [
        SidebarComponent,
    ],
    exports: [
        SidebarComponent,
    ],
    imports: [
    SharedModule,
    ChatbotModule
]
})
export class SidebarModule {

}