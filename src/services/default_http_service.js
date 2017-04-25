class DefaultHttpService {
    
    static generic_call( url, method, headers, body = undefined ){
        
        return new Promise( (resolve, reject) => {
         
            let to = {
                method: method,
                headers: headers
            };
            
            if ( body !== undefined ){
                to.body = body;
            }
            
            fetch( url, to ).then( (response) => {
                
                response.json().then( (j_str) => {
                    
                    if ( j_str.errors != undefined && j_str.errors.length > 0 ){
                        reject( j_str );
                        return;
                    }
                    
                    resolve( j_str ); 
                });
            })
            .catch( (error) => {
                reject( error );
            });
        });
    }
}

export default DefaultHttpService;