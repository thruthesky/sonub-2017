# Sonub

````
this.app.wp.post({route: 'wordpress.get_attachment_from_guid', guid: '....'})
    .subscribe((file: FILE) => {
        console.log("got file: ", file);
    }, e => this.app.waring(e));
````
