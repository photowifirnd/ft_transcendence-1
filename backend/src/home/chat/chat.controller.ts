import { Controller, Post, Body, Headers, Get } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('/api/users/chat')
export class ChatController {
    constructor(private chatService: ChatService){}
    @Post('/saveMessage')
    async saveMessage(@Body() body, @Headers() headers): Promise<any>{
        return (await this.chatService.saveMessage(body, headers.authorization));
    }

    @Post('/saveGroupMessage')
    async saveGroupMessage(@Body() body, @Headers() headers): Promise<any>{
        return (await this.chatService.saveGroupMessage(body, headers.authorization));
    }

    @Post('/getMessages')
    async getMessages(@Body() body, @Headers() headers): Promise<any>{
        return (await this.chatService.getMessages(body, headers.authorization));
    }

    @Post('/getGroupMessages')
    async getGroupMessages(@Body() body, @Headers() headers): Promise<any>{
        return (await this.chatService.getGroupMessages(body, headers.authorization));
    }

    @Post('/saveChatGroup')
    async saveChat(@Body() body, @Headers() headers): Promise<any>{
        return (await this.chatService.saveChatGroup(body, headers.authorization));
    }

    @Get('/getChatGroups')
    async getChatGroups(@Headers() headers): Promise<any>{
        return (await this.chatService.getChatGroups(headers.authorization));
    }

    @Post('/addChannel')
    async addChannel(@Body() body, @Headers() headers): Promise<any> {
        console.log("Body: ", body);
        return (await this.chatService.saveChatGroup(body, headers.authorization));
    }
    @Post('banuser')
    async banUser(@Body() body, @Headers() headers): Promise<any> {
        //console.log('Body is: ', body);
        return (await this.chatService.banUser(body.members, headers.authorization));
    }
    @Post('getChatUsers')
    async getChatUsers(@Body() body, @Headers() headers): Promise<any>
    {
        console.log("ChatInfo: ", body);
        return (await this.chatService.getChatUsers(body, headers.authorization));
    }
}