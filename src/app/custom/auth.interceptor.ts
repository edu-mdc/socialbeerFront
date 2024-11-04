import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //debugger;
  console.log("interceptor lo tiene")

  if(req.url.indexOf("Acceso")>0)return next(req);

  const token = localStorage.getItem("token");

  if(token){
    const clonRequest = req.clone({
      setHeaders:{
        Authorization:`${token.trim()}`
      }
    });
    return next(clonRequest);
  }
  
  return next(req);
};
