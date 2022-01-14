import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "inspector";
import { SessionEntity } from "src/session/session.entity";
import { mDate } from "src/shared/utils/date";
import { SocketService } from "src/socket/socket.service";
import { In, Like, Repository } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { User } from "../user/userClass";
import { UserPublicInfoI } from "../user/userI";
import { ePlay, eRequestPlayer } from "./ePlay";
import { PlayerI, WaitRoomI } from "./iPlay";
import { PlayEntity } from "./play.entity";

@Injectable()
export class PlayService {
    constructor(@InjectRepository(UserEntity)
                private userRepository: Repository<UserEntity>,
                @InjectRepository(PlayEntity)
                private playRepository: Repository<PlayEntity>,
                @Inject(forwardRef(() => UserService)) // forwardRef solves circular dependencies: 
				private userService: UserService,
				private socketService: SocketService){}
    
    async newInviation(me: UserEntity, oponent: UserPublicInfoI): Promise<UserEntity>{
        try {
        
        const opUsr = await this.userService.findByLogin(oponent.login);
        
        /*Checks if invitation exists */
        const invitation = await this.playRepository.findOne({where: [
            {player_1: me.id, player_2: opUsr.id},
            {player_2: me.id, player_1: opUsr.id}
        ]});
        

        if (invitation !== undefined)
            return (null);
            await this.playRepository.insert({player_1: me, player_2: opUsr});
        return (opUsr);
        } catch(e){
            console.log("Error invitating oponent... from playService");
            return (null);
        }
    }
  

	async getAllGameInvitations(user: UserEntity): Promise<UserPublicInfoI[]>
	{
		var userProfiles: UserPublicInfoI[] = [];
		const invitations = await this.playRepository.find({
			relations: ["player_1", "player_2"],
			where: {player_2: user.id, confirmed: false}
		});
		for (let i = 0; i < invitations.length; i++) {
			const element = invitations[i].player_1;
			userProfiles.push(User.getPublicInfo(element))
		}
		return (userProfiles);
	}

	async acceptGameInvitation(me: UserEntity, user: UserPublicInfoI): Promise<PlayEntity>{
		const usrEntity = await this.userService.findByLogin(user.login);
		const invitation = await this.playRepository.findOne({
			relations: ["player_1", "player_2"],
			where: {player_1: usrEntity.id, player_2: me.id}
		})
		invitation.confirmed = true;
		invitation.p2_status = eRequestPlayer.ACCEPTED;
		invitation.expiration_time = mDate.setExpirationTime(120);
		const tmp = await this.playRepository.find({
			where: [
				{player_1: usrEntity.id, confirmed: true},
				{player_2: usrEntity.id, confirmed: true}
			]
		})
		if (tmp.length > 0)
			console.log("Sorry your oponent is in game");
		await this.playRepository.save(invitation);
		return (invitation);
	}
	async declineGameInvitation(me: UserEntity, user: UserPublicInfoI){
		const usrEntity = await this.userService.findByLogin(user.login);
		const invitation = await this.playRepository.findOne({
			where: {player_1: usrEntity.id, player_2: me.id}
		})
		if (invitation !== undefined)
			await this.playRepository.delete(invitation);
	}

	async removePlayRoom(waitRoom: WaitRoomI)
	{
		const playRoom = await this.playRepository.findOne({
			where: {id: waitRoom.id}
		})
		if (playRoom !== undefined)
			await this.playRepository.delete(playRoom);
	}

	async acceptWaitRoom(me: UserEntity, waitRoom: WaitRoomI): Promise<PlayEntity>
	{
		const invitation = await this.playRepository.findOne({
			relations: ["player_1", "player_2"],
			where: {id: waitRoom.id}
		})
		if (invitation.player_1.login == me.login)
			invitation.p1_status = eRequestPlayer.ACCEPTED;
		else
			invitation.p2_status = eRequestPlayer.ACCEPTED;
		await this.playRepository.save(invitation);
		return(invitation);
	}

	async rejecttWaitRoom(me: UserEntity, waitRoom: WaitRoomI): Promise<PlayEntity>
	{
		const invitation = await this.playRepository.findOne({
			relations: ["player_1", "player_2"],
			where: {id: waitRoom.id}
		})
		if (invitation.player_1.login == me.login)
			invitation.p1_status = eRequestPlayer.REJECTED;
		else
			invitation.p2_status = eRequestPlayer.REJECTED;
		return(invitation);
	}
	async getPlayer(player: PlayerI): Promise<UserEntity>
	{
		return (await this.userService.findByLogin(player.login));
	}
	async getActivePlayRoom(me: UserEntity): Promise<PlayEntity>
	{
		const playRoom = await this.playRepository.findOne({
			relations: ["player_1", "player_2"],
			where: [
				{player_1: me.id, confirmed: true},
				{player_2: me.id, confirmed: true}
			]
		})
		return (playRoom);
	}




	async onTest(me: UserEntity, user: UserPublicInfoI){
		const usrEntity = await this.userService.findByLogin(user.login);
		return (usrEntity);
		//await this.playRepository.delete(invitation);
	}
	

	async endGame(data: any): Promise<any> {
        console.log("<debug> PlayService.endGame:", data);
        if (data.game.player1.winner == true) {
			//find user and update score
            let user1 = await this.userRepository.findOne({login: data.game.player1.login});
            user1.victories += 1;
            await this.userRepository.save(user1);
            let user2 = await this.userRepository.findOne({login: data.game.player2.login});
            user2.defeats += 1;
            await this.userRepository.save(user2);
		}
        else if (data.game.player2.winner == true) {
            //find user and update score
            let user2 = await this.userRepository.findOne({login: data.game.player2.login});
            user2.victories += 1;
            await this.userRepository.save(user2);
            let user1 = await this.userRepository.findOne({login: data.game.player1.login});
            user1.defeats += 1;
            await this.userRepository.save(user1);
        }
    }
    
}