import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { unwrapResolvedMetadata } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData{
    kind:string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean;
}
@Injectable({providedIn:'root'})
export class AuthService{
  user=new Subject<User>();
    constructor(private http:HttpClient)
    {

    }
    signup(email:string,password:string)
    {
       return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCqhqlkNZ-trta_MzG09hYl3blR0-uA9Is',
       {
         email:email,
         password:password,
         returnSecureToken:true
       }
       ).pipe(catchError(this.handleError),tap(resData=>{
         this.handleAuthentication(
         resData.email,resData.localId,resData.idToken,+resData.expiresIn
        );
      })
      );
    }
    login(email:string,password:string)
    {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCqhqlkNZ-trta_MzG09hYl3blR0-uA9Is',
        {
          email:email,
          password:password,
          returnSecureToken:true
        }
        ).pipe(catchError(this.handleError),tap(resData=>{
          this.handleAuthentication(
          resData.email,resData.localId,resData.idToken,+resData.expiresIn
         );
       })
       );
    }
    private handleAuthentication(email:string,userId:string,token:string,expiresIn:number)
    {
      const expirationDate=new Date(
        new Date().getTime()+ expiresIn*1000
      );
      const user=new User(
        email,
        userId,
        token,
        expirationDate
      );
      this.user.next(user);
    }
    private handleError(errorRes:HttpErrorResponse)
    {
      let errorMessage='An unkown error occurred!!';
      if(!errorRes.error || !errorRes.error.error)
      {
        return throwError(errorMessage);
      }
     switch(errorRes.error.error.message)
     {
         case 'EMAIL_EXISTS':
          errorMessage='This email exists already';
          break;
          case 'EMAIL_NOT_FOUND':
            errorMessage='email is not found';
            break;
            case 'INVALID_PASSWORD':
              errorMessage='invalid password';
              break;
     }
     return throwError(errorMessage);
    }
}