import { BallI, GameI } from "../iPlay";
import { Ball } from "./ball";
import { Boundaries } from "./iPosition";
import { Moveable } from "./moveable";
import { Paddle } from "./paddle";

export class Game {

    cWidth: number = 600;
    cHeight: number = 400; 
    ball: Ball;
    pad_1: Paddle;
    pad_2: Paddle;
    boundBall: Boundaries;
    boundPad_1: Boundaries;
    boundPad_2: Boundaries;
	start: boolean;

    constructor(private id: number) {
        this.id = id;
        this.ball = new Ball(10, 10, 1, { x: this.cWidth / 2, y: this.cHeight / 2 }, { x: 1, y: 1 });
       	this.pad_1 = new Paddle(75, 10, 10000, { x: 50, y: (this.cHeight / 2) });
	    this.pad_2 = new Paddle(75, 10, 10000, { x: this.cWidth - 50, y: (this.cHeight / 2) });
        this.boundBall = this.ball.getCollisionBoundaries();
		this.boundPad_1 = this.pad_1.getCollisionBoundaries();
		this.boundPad_2 = this.pad_2.getCollisionBoundaries();
		this.start = false;
    }
    getId (): number{
        return (this.id);
    }
    getMap() : GameI {
        return ({
            map: {
                width: this.cWidth,
                height: this.cHeight
            },
            ball: this.getMoveable(this.ball),
            pad_1: this.getMoveable(this.pad_1),
            pad_2: this.getMoveable(this.pad_2) 
        });
    }
    
    getMoveable(obj: Moveable): BallI {
        var pos = obj.getPosition();
        return ({
            pos_x: pos.x,
            pos_y: pos.y,
            width: obj.getWidth(),
            height: obj.getHeight()
        });
    }


	//Checks objects collisions. 'Till now only checks collision of the ball with four sides
	checkCollisions() {
		var left_touch = this.ball.getSpeedRatio().x < 0;
        this.boundBall = this.ball.getCollisionBoundaries();
        this.boundPad_1 = this.pad_1.getCollisionBoundaries();
        this.boundPad_2 = this.pad_2.getCollisionBoundaries();		

        //Collision ball with backPad -> may consider reabse back pad's limits
		if (this.boundBall.left > this.cWidth || this.boundBall.right < 0){
            this.start = false;
            this.ball.setSpeedBall(1);
            this.ball.reverseX();
            this.ball.setPosition({ x: this.cWidth / 2, y: this.cHeight / 2 });
		}
		else if (this.boundBall.bottom >= this.cHeight || this.boundBall.top <= 0)
			this.ball.reverseY();
		else if (this.boundBall.left <= this.boundPad_1.right && left_touch)
		{
			if (this.boundBall.bottom >= this.boundPad_1.top && this.boundBall.top <= this.boundPad_1.bottom)
			{
				var paddMid = this.boundPad_1.left + this.pad_1.getWidth() / 2;
				if (this.boundBall.left >= paddMid)
				{
					this.ball.reverseX();
				}
				else if (this.boundBall.left >= this.boundPad_1.left && this.boundBall.right <= this.boundPad_1.right)
				{
					this.ball.reverseY();
					this.ball.reverseX();
				}
				if (!this.start) {
					this.ball.setSpeedBall(2);
					this.start = true;
				}
				else 
					this.ball.incrementSpeed();
			}
		}
		else if (this.boundBall.right >= this.boundPad_2.left && !left_touch)
		{
			if (this.boundBall.bottom >= this.boundPad_2.top && this.boundBall.top <= this.boundPad_2.bottom)
			{
				var paddMid = this.boundPad_2.left + this.pad_2.getWidth() / 2;
				if (this.boundBall.right <= paddMid)
					this.ball.reverseX();
				else if (this.boundBall.right <= this.boundPad_2.right && this.boundBall.left >= this.boundPad_2.left)
				{
					this.ball.reverseY();
					this.ball.reverseX();
				}
				if (!this.start) {
					this.ball.setSpeedBall(2);
					this.start = true;
				}
				else 
					this.ball.incrementSpeed();
			}	
		}

		/* if ((this.boundBall.right >= this.boundPad_2.right && 
			(this.boundBall.bottom >= this.boundPad_2.top && this.boundBall.top <= this.boundPad_2.bottom)) ||
			(this.boundBall.right >= this.cW )){
				this.ball.setPosition({ x: this.cWidth / 2, y: this.cHeight / 2 });
		}*/
		/* else if ((this.boundBall.left <= this.boundPad_1.left && 
			(this.boundBall.bottom >= this.boundPad_1.top && this.boundBall.top <= this.boundPad_1.bottom)) ||
			(this.boundBall.left <= 0)){
			this.ball.reverseX();
			this.ball.setPosition({ x: this.cWidth / 2, y: this.cHeight / 2 });
		}

		else if (this.boundBall.left <= this.boundPad_1.right && this.boundBall.bottom >= this.boundPad_1.top && this.boundBall.top <= this.boundPad_1.bottom) {
			this.ball.reverseX(); //left collision
		}
		else if (this.boundBall.right >= this.boundPad_2.left && this.boundBall.bottom >= this.boundPad_2.top && this.boundBall.top <= this.boundPad_2.bottom) {
			this.ball.reverseX(); // Right Collision
		} 
		 */

		/* if (this.boundBall.left <= 0 || this.boundBall.right >= this.cWidth) {
			this.ball.reverseX();
			this.ball.setPosition({ x: this.cWidth / 2, y: this.cHeight / 2 });
		} */


        //Consider top/bottom pad collisions

	}

	//This function moves the elements and check if it is any colide
	fpsService() {
	/* 	this.checkCollisions();
		if (this.prefs.userInfo.login == this.prefs.game.player1.login) {
			//this.ball.move();
			if (this.moving_up && this.boundPad_1.top > 0) {
				this.pad_1.moveUp();
			}
			if (this.moving_down && this.boundPad_1.bottom < this.height) {
				this.pad_1.moveDown();
			}
		} else {
			if (this.moving_up && this.boundPad_2.top > 0) {
				this.pad_2.moveUp();
			}
			if (this.moving_down && this.boundPad_2.bottom < this.height) {
				this.pad_2.moveDown();
			}
		} */
		//console.log((this.ball.getPosition()));
	}

}