/**
 * @file page-scroll.ts
 * @description Watches page scroll to the bottom. If page scroll reaches to the bottom, it emits an event.
 * 
 * 
 * 
 * 
 * 
 * @note 페이지를 reload 할 때,
 *      reload 하기 직전에 이미 페이지가 중간으로 스크롤이 되어져 있다면,
 *      reloda 를 해도, 페이지가 중간으로 스크롤 된 상태가 된다.
 *      즉, 이렇게 되면, 페이지가 열리자 마자 페이지가 중간으로 스크롤리 되어버리는데,
 *      이 경우, scroll 이벤트가 한번 발생한다.
 * 
 * @code Example codes. Use example 2.
 
    watch = null;
    inLoading: boolean = false;
    pageNo: number = 0;
    ngOnInit() {
      this.watch = this.pageScroll.watch( 'section.content' ).subscribe( e => {
        if ( this.inLoading ) {
          console.info("Page is in loading...");
          return;
        }
        this.inLoading = true;
        this.pageNo ++;
        console.info("Going to load Page No. ", this.pageNo );
        setTimeout( () => { this.inLoading = false; console.info(`Page No. ${this.pageNo} loaded!`); }, 3000 );
      });
    }
    
    ngOnDestroy() {
      this.watch.unsubscribe();
    }

 * @endcode
 * 
 * 
 * @code example 2 - 게시판 페이지 별로 로딩 할 때 좋음.
    
    watch;
    inLoading: boolean = false;
    pageNo: number = 0;
    noMorePosts: boolean = false;
    constructor( private pageScroll: PageScroll ) {
        this.loadPage();
    }
    ngOnInit() {
      this.watch = this.pageScroll.watch( 'section.content', 350 ).subscribe( e => this.loadPage() );
    }
    
    ngOnDestroy() {
      this.watch.unsubscribe();
    }

    loadPage() {
      if ( this.noMorePosts ) return;
      if ( this.inLoading ) return;
      else this.inLoading = true;
      this.pageNo++;

      let option: PAGE_OPTION = {
        post_id: POST_ID,
        page_no: this.pageNo
      };

      this.post.page( option, (page: PAGE) => { 
          this.inLoading = false;
          if ( page.posts.length == 0 || page.posts.length < LIMIT ) {
            this.noMorePosts = true;
          }
          this.pages.push( page );
      },
      error => {
        this.inLoading = false;
      },
      () => {} );
  }

 * 
 * 
 * 
 * @endcode
 * 
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

@Injectable()
export class PageScroll {
    scrollCount: number = 0;
    scrollCountOnDistance: number = 0;
    constructor() {

    }

    /**
     * 
     * @attention - distance 거리에서는 이벤트가 계속 발생하므로, 이 함수를 사용하는 코드에서 적절히 사용해야 한다.
     *      예를 들면, 게시판 글을 무한 로딩한다면, 아래와 같이 하면 된다.
     *          (1) 로딩 중이 아니면,
     *          (2) 로딩 중이라고 표시하고, (페이지를 1 증가하고,) 다음 페이지를 로딩한다.
     *          (3) 로딩이 끝나면, 로딩 중이 아니라고 표시한다.
     * 
     * 
     * @param selector - 어떤 element 를 스크롤 할 지 선택한다.
     * @param distance - bottom 으로 부터 얼마나 거리를 둘지, 그 거리 내에 들어가면 scroll 이벤트를 발생 시킬지를 결정한다.
     * 
     * 
     * @return Observable
     */
    watch(selector: string, distance: number = 300): Observable<any> {

        let element = document.querySelector(selector);
        if (element === void 0 || !element) {
            console.error("No element to watch on scrolling. Wrong query selector.");
            return;
        }

        return Observable.fromEvent(document, 'scroll')        // 스크롤은 window 또는 document 에서 발생.
            .debounceTime(100)
            .map((e: any) => {
                this.scrollCount++;
                // console.log("scrollCount: ", this.scrollCount);
                return e;
            })
            .filter((x: any) => {
                if (element['offsetTop'] === void 0) return false; // @attention this is error handling for some reason, especially on first loading of each forum, it creates "'offsetTop' of undefined" error.
                let elementHeight = element['offsetTop'] + element['clientHeight'];
                let windowYPosition = window.pageYOffset + window.innerHeight;
                // console.log("page scroll reaches at bottom: windowYPosition=" + windowYPosition + ", elementHeight-distance=" + (elementHeight-distance));
                if (windowYPosition > elementHeight - distance) { // page scrolled. the distance to the bottom is within 200 px from
                    this.scrollCountOnDistance++;
                    // console.log( "scrollCountOnDistance", this.scrollCountOnDistance );
                    return true;
                }

                return false;
            });

    }

    stop() {

    }


}