import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const isAllowed = authService.getLoggedInStatus()
  if (authService.getLoggedInStatus()) {
    return true;
  } else {
    router.navigate(['/login']);
    toastr.warning('You do not have permission to access this page');
    return false;
  }
};
