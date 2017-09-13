# Sonub

# TODO

* 재택 강의 시스템을 소너브와 연결한다. 그래야지만, 온튜도 살고 소너브도 산다. 온튜는 콜센터 대안으로 꼭 필요하다.
* 필고와 소너브를 연결한다.
    * 중요: 소너브 정보를 필고에 보여 줄 수 있도록 한다.
    * 중요: 소너브 정보로 앱을 만든다. 장터앱, 구인구직앱, 식당앱, 
    * 중요: 소너브에 하우스메이드 정보 다 이동시키고,
        http://helper.sonub.com/ 으로 해서, 
        앱을 만들고,
        그 앱을 <app-root></app-root> 와 같이 필고 페이지에 추가하고,
        앱을 실행한다.
        
* 메인 - 메뉴는 그냥 페이지만 보여줄 것. 글쓰기 모달 보이지 말것.

* @done fix column-c at bottom when it is scrolled.
* @done customize app-shell by include 'xapi/etc/app-shell.php'


# No-Wait

* When app needs to acces mutiple database like
    * wordpress backend dataase ==> firebase database ==> philgo database
    * Sometimes it must NOT wait until the database access complete.
    * This has an extra functinality.

        * when a browser does not support firebase sdk api ( like Electron ),
            it still need to continue browsing.






# Coding Guide

````
this.app.wp.post({route: 'wordpress.get_attachment_from_guid', guid: '....'})
    .subscribe((file: FILE) => {
        console.log("got file: ", file);
    }, e => this.app.waring(e));
````
