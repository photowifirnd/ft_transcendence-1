import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from 'src/home/chat/chat.entity';
import { ChatService } from 'src/home/chat/chat.service';
import { FriendEntity } from 'src/home/friends/friend.entity';
import { FriendService } from 'src/home/friends/friend.service';
import { UserEntity } from 'src/home/user/user.entity';
import { UserService } from 'src/home/user/user.service';
import { SessionEntity } from 'src/session/session.entity';
import { SessionService } from 'src/session/session.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
	imports: [ TypeOrmModule.forFeature([UserEntity, SessionEntity, FriendEntity, ChatEntity])],
	providers : [SocketGateway, SessionService, FriendService, SocketService, UserService, ChatService]
})
export class SocketModule {}
