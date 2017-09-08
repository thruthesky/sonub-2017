# Sonub

# TODO

* fix column-c at bottom when it is scrolled.
* customize app-shell by include 'xapi/etc/app-shell.php'




# Coding Guide

````
this.app.wp.post({route: 'wordpress.get_attachment_from_guid', guid: '....'})
    .subscribe((file: FILE) => {
        console.log("got file: ", file);
    }, e => this.app.waring(e));
````
