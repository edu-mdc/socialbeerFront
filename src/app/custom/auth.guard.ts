import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
//debugger;
  const token = localStorage.getItem("token") || "";
  const router = inject(Router);

  if(token !=""){
    return true
  }else{
    // router.navigateByUrl("");
    // return false
    const url = router.createUrlTree([""])
    return url;
  }
 
};
