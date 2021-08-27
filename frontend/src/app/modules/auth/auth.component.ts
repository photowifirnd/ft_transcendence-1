import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserStatus } from 'src/app/shared/enums/eUser';
import { UserI } from 'src/app/shared/interface/user';
import { LocalStorageQueryService } from '../../shared/service/local-storage-query.service';
import { AuthService } from './auth.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {

	user: UserI = <UserI>{};
	data: any = this.sQuery.getStatus();
	isLoading: boolean = false;
	constructor(
		private sQuery: LocalStorageQueryService,
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService
	) {}

	async ngOnInit(): Promise<void> {
		console.log('OnInit: Auth');
		
		const queryParam = await this.route.queryParams;
		const code = this.getCode(queryParam);
		if (code !== undefined) {
			this.isLoading = true;
			this.user = await this.authService.getUserData(code);
			this.isLoading = false;
			console.log('Response from auth component:', this.user);
		}
		if (!this.data) this.router.navigateByUrl('auth/login');
		else if (this.data == UserStatus.UNREGISTERED)
			this.router.navigateByUrl('auth/registration');
		else if (this.data == UserStatus.UNCONFIRMED)
			this.router.navigateByUrl('auth/confirmation');
		else this.router.navigateByUrl('');
	}

	showLogin(): boolean {
		if (!this.data || !this.user === undefined) 
			return true;
		return false;
	}

	showRegister(): boolean {
		if (this.user !== undefined && this.user.status == UserStatus.UNREGISTERED) 
			return true;
		return false;
	}

	showConfirm(): boolean {
		if (this.data == UserStatus.UNCONFIRMED) return true;
		return false;
	}

	getCode(resp: any): string | undefined {
		if (resp._value.code !== undefined) return resp._value.code;
		else if (resp._value.error) return '401';
		return undefined;
	}
}
