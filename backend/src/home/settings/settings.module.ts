import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/home/user/user.entity';
import { UserService } from 'src/home/user/user.service';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SessionEntity } from 'src/session/session.entity'; 
import { SessionService } from 'src/session/session.service';
import { TwoFactorService } from 'src/auth/two-factor/two-factor.service';
import { MailService } from 'src/shared/mail/mail.service';
import { TwoFactorEntity } from 'src/auth/two-factor/two-factor.entity';
import { FriendEntity } from '../friends/friend.entity';
import { FriendService } from '../friends/friend.service';

@Module({
    imports: [ TypeOrmModule.forFeature([UserEntity, SessionEntity, TwoFactorEntity, FriendEntity])],
    controllers: [SettingsController],
    providers: [
		SettingsService,UserService, SessionService, TwoFactorService, MailService, FriendService
	]
})
export class SettingsModule {}
