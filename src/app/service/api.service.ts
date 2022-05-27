import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { asapScheduler, EMPTY, Observable, of, scheduled } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { User } from '@models/user.model';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  @Output('apiAuthEvent') apiAuthEvent: EventEmitter<string> = new EventEmitter<string>();
  baseUri: string = environment.baseUri;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  get accessTokenCookie() { return 'access_token' }
  currentUser: User;

  constructor(
    public router: Router,
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private ngZone: NgZone,
    private toastr: ToastrService) { }

  // Create
  createRegistrationCode(data): Observable<any> {
    let url = `${this.baseUri}/registration-code/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(e => {
          this.errorMgmt(e); return EMPTY;
        })
      )
  }
  createRSVP(data): Observable<any> {
    let url = `${this.baseUri}/rsvp/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(e => {
          this.errorMgmt(e); return EMPTY;
        })
      )
  }
  createRole(data): Observable<any> {
    let url = `${this.baseUri}/role/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(e => {
          this.errorMgmt(e); return EMPTY;
        })
      )
  }
  createTest(data): Observable<any> {
    let url = `${this.baseUri}/test/create`;
    return this.http.post(url, data)
      .pipe(
        catchError(e => {
          this.errorMgmt(e); return EMPTY;
        })
      )
  }

  // Get all
  getRegistrationCodes() {
    return this.http.get(`${this.baseUri}/registration-code/list`);
  }
  getRSVPs() {
    return this.http.get(`${this.baseUri}/rsvp/list`);
  }
  getUsers() {
    return this.http.get(`${this.baseUri}/user/list`);
  }
  getRoles() {
    return this.http.get(`${this.baseUri}/role/list`);
  }
  getTests() {
    return this.http.get(`${this.baseUri}/test/list`);
  }

  // Get single
  getRSVP(id): Observable<any> {
    let url = `${this.baseUri}/rsvp/read/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  hasCurrentUserRSVPed(): Observable<String> {
    let url = `${this.baseUri}/rsvp/user/`
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: any) => {
        return res && res._id;
      }),
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    );
  }
  
  getUser(id): Observable<any> {
    let api = `${this.baseUri}/user/read/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {}
      }),
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  getCurrentUser(): Observable<User> {
    let api = `${this.baseUri}/user/current/`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: any) => {
        this.currentUser = res.msg;
        return res.msg || {}
      }),
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  getUserRelatedData(id: string) {
    let api = `${this.baseUri}/data/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: any) => {
        return res || {}
      }),
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  getRole(id): Observable<any> {
    let url = `${this.baseUri}/role/read/${id}`;
    return this.http.get(url, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {}
      }),
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }

  // Update
  updateRSVP(id, data): Observable<any> {
    let url = `${this.baseUri}/rsvp/update/${id}`;
    return this.http.post<any>(url, data, { headers: this.headers }).pipe(
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  updateUser(id, data): Observable<any> {
    let url = `${this.baseUri}/user/update/${id}`;
    return this.http.post<any>(url, data, { headers: this.headers }).pipe(
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  updateRole(id, data): Observable<any> {
    let url = `${this.baseUri}/role/update/${id}`;
    return this.http.post<any>(url, data, { headers: this.headers }).pipe(
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }


  // Delete
  deleteRSVP(id): Observable<any> {
    let url = `${this.baseUri}/rsvp/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  deleteUser(id): Observable<any> {
    let url = `${this.baseUri}/user/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }
  deleteRole(id): Observable<any> {
    let url = `${this.baseUri}/role/delete/${id}`;
    return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(e => {
        this.errorMgmt(e); return EMPTY;
      })
    )
  }

  // register
  register(user: User): Observable<any> {
    let api = `${this.baseUri}/user/register`;
    return this.http.post(api, user)
      .pipe(
        map((res: Response) => {
          this.ngZone.run(() => this.router.navigateByUrl('/user/login'));
        }),
        catchError(e => { this.errorMgmt(e); return EMPTY; })
      )
  }

  // Sign-in
  login(user: User) {
    return this.http.post<any>(`${this.baseUri}/user/login`, user)
      .subscribe((res: any) => {
        this.token = res.token;
        this.currentUser = res.user;
        this.toastr.success('Login successful.');
        let returnUrl = this.router.parseUrl(this.router.url).queryParams['returnUrl'];
        this.apiAuthEvent.emit('login');
        if (returnUrl)
          this.ngZone.run(() => this.router.navigateByUrl(returnUrl));
        else
          this.ngZone.run(() => this.router.navigateByUrl('user/profile/' + res.user._id));
      },
        (err: any) => {
          if (err.status === 476){
            this.ngZone.run(() => this.router.navigateByUrl('user/verify'));
          }
          else
            this.toastr.error(err.message);
        });
  }

  verify(email: string, uuid: string): Observable<any> {
    const api = `${this.baseUri}/user/verify`;
    
    return this.http.post(api, {
      email: email,
      emailVerificationUUID: uuid
    });
  }

  sendPasswordReset(email: string): Observable<any> {
    const api = `${this.baseUri}/user/sendpasswordreset`;
    
    return this.http.post(api, {
      email: email
    });
  }

  passwordReset(data: any): Observable<any> {
    const api = `${this.baseUri}/user/resetpassword`;
    
    return this.http.post(api, {
      email: data.email,
      uuid: data.uuid,
      newPassword: data.newPassword,
      newPasswordConf: data.newPasswordConf
    });
  }

  get token() {
    return localStorage.getItem(this.accessTokenCookie);
  }

  set token(input: string) {
    localStorage.setItem(this.accessTokenCookie, input)
  }

  get isLoggedIn(): boolean {
    return (this.token !== null) ? true : false;
  }

  logout() {
    let removeToken = localStorage.removeItem(this.accessTokenCookie);
    this.apiAuthEvent.emit('logout');
    if (removeToken == null) {
      this.ngZone.run(() => this.router.navigateByUrl('login'));
    }
  }

  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';

    if (error.error) {
      // Get client-side error
      if (error.error.message) {
        errorMessage = error.error.message;
        // Get server-side error
        if (error.error.message.indexOf('Your session has expired') >= 0 || error.error.message.indexOf('jwt expired') >= 0) {
          this.logout();
          this.toastr.info("You've been signed out due to inactivity.");
          return;
        }
      } else if (Array.isArray(error.error)){
        error.error.forEach(err => {
          errorMessage += `${err.message}\r\n`;
        });
      } else {
        errorMessage = error.error;
      }
    }
    else {
      errorMessage = `Error Code: ${error.status} - Message: ${error.message}`;
    }
    if (!environment.production) 
      console.log(error);
    if ([401, 403].indexOf(error.status) === -1) //hide auth errors
      this.toastr.error(errorMessage);
  }
}