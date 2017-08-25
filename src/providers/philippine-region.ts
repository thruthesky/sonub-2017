import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PhilippineRegion {

    apiEndpointLocation = 'https://www.philgo.com/etc/location/philippines/json.php';

    constructor(
        private http: Http
    ) {
    }

    get_province( successCallback, errorCallback) {
        this.http.get( this.apiEndpointLocation )
            .subscribe( data => {
                try {
                    let re = JSON.parse( data['_body'] );
                    if ( re['code'] ) return errorCallback( re['message'] );
                    successCallback( re );
                }
                catch( e ){
                    errorCallback( data['_body']);
                }
            }, e => console.error("failed to get province"));
    }

    get_cities( data, successCallback, errorCallback) {
        this.http.get( this.apiEndpointLocation + '?province='+data  )
            .subscribe( data => {
                try {
                    let re = JSON.parse( data['_body'] );
                    if ( re['code'] ) return errorCallback( re['message'] );
                    successCallback( re );
                }
                catch( e ){
                    errorCallback( data['_body']);
                }
            });
    }


}
