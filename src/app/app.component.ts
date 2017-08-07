import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AppService } from './../providers/app.service';
import { HeaderWidget } from './../widgets/header/header';
import {
  POST_LIST, POST,
  PAGE
} from './../providers/wordpress-api/interface';


import { PostCreateEditModalService } from './../modules/forum/modals/post-create-edit/post-create-edit.modal';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('headerWidget') headerWidget: HeaderWidget;

  advSidebar: POST;
  news: PAGE;
  constructor(
    private router: Router,
    public app: AppService,
    private postCreateEditModal: PostCreateEditModalService
  ) {



    document.addEventListener('deviceready', () => this.onDeviceReady(), false);
    this.loadNews();
    this.loadAdvertisement();

  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit() {

    this.app.headerWidget = this.headerWidget;
  }



  onDeviceReady() {
    this.app.push.initCordova();
  }


  loadNews() {

    let req: POST_LIST = {
      category_name: 'news',
      paged: 1,
      posts_per_page: 5,
      thumbnail: '32x32'
    };
    this.news = this.app.cacheGetPage(req);
    // console.log("cached: ", this.news);
    this.app.forum.postList(req).subscribe((page: PAGE) => {
      console.log('Page::', page);
      this.app.cacheSetPage(req, page);
      this.news = page;
    }, err => this.app.displayError(this.app.getErrorString(err)));


  }

  onClickCreateNews() {

    if (!this.app.user.isLogin) {
      this.app.alert.notice('login', 'login_first');
      return;
    }

    this.postCreateEditModal.open({ category: 'news' }).then(id => {
      this.loadNews();
    }, err => console.error(err));
  }

  loadAdvertisement() {
    this.app.wp.post({route: 'wordpress.get_advertisement', position: 'sidebar'} )
      .subscribe( (post: POST) => {
        console.log('adv: ', post);
        this.advSidebar = post;
      }, e => this.app.warning(e));
  }
}
