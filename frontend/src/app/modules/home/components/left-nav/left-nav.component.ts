import { Component, Type, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationStart, Event, NavigationEnd, NavigationError } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalConfirm } from './modal-logout.component'
import { Nav } from 'src/app/shared/enums/eUser'

@Component({
selector: 'app-left-nav',
templateUrl: './left-nav.component.html',
styleUrls: ['./left-nav.component.css'],
})
export class LeftNavComponent implements OnInit {
	@Output() newItemEvent = new EventEmitter<string>();
	url: string;
	MODALS: {[name: string]: Type<any>} = {
		focusFirst: NgbdModalConfirm,
	};
	constructor(
		private router: Router,
		private modalService: NgbModal
	) {
		this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
				console.log("navigation start: ", event);
            }
            if (event instanceof NavigationEnd) {
				console.log("navigation end: ", event);
				this.url = event.url;
				this.newItemEvent.emit(this.url);
            }
            if (event instanceof NavigationError) {
                console.log(event.error);
            }
        });
	}

	ngOnInit(): void {
		//console.log("lets load: ", this.page);
	}
	
	home(): void { this.navigate(Nav.HOME); }
	play(): void { this.navigate(Nav.GAME); }
	live(): void { this.navigate(Nav.LIVE); }
	chat(): void { this.navigate(Nav.CHAT); }
	conf(): void { this.navigate(Nav.CONF); }
	open(name: string) {
		this.modalService.open(this.MODALS[name], { centered: true, animation: true });
	}
	navigate(path: string){
		this.newItemEvent.emit(path);
		this.router.navigateByUrl(path);
	}
}
