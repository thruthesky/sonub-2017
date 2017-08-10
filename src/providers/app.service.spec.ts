// // src/app/user.service.spec.ts
// import { TestBed, inject } from '@angular/core/testing';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { WordpressApiService } from './wordpress-api/wordpress-api.service';
// import { UserService } from './wordpress-api/user.service';
// import { ForumService } from './wordpress-api/forum.service';
// import { FileService } from './wordpress-api/file.service';
// import { USER_REGISTER, USER_REGISTER_RESPONSE } from './wordpress-api/interface';



// describe('AppServiceTest', () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 HttpClient,
//                 HttpHandler,
//                 WordpressApiService,
//                 UserService,
//                 ForumService,
//                 FileService
//             ],
//             imports: [
//             ]
//         });
//     });


//     it('user.isLogin should return false', inject([UserService], (user: UserService) => {
//         expect(user.isLogin).toBeFalsy();
//     }));

//     it('user.isLogin should return true after login', inject([WordpressApiService, UserService], (client: HttpClient, user: UserService) => {

//     }));
// });