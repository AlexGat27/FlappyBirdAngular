import { NgModule } from '@angular/core';
import { CameraService } from './services/camera.service';
import { HandsService } from './services/hands.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    CameraService, 
    HandsService
  ],
})
export class CoreModule { }
