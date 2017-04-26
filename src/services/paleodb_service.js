import DefaultHttpService from './default_http_service';

class PaleoDB extends DefaultHttpService {
    
    static eolKey = '8239ccda0cde365a89da00592c3eda16389a64f6';
    
    constructor(){
        super();
    }
    
    static getNode( name, method = 'name' ){
        
        return this.generic_call( `http://paleobiodb.org/data1.2/taxa/single.json?${method}=${name}&show=attr&show=img&show=app&show=nav`, 'get' )
        .catch( (error) => {
            alert( error.errors[0] );    
        });
    }
    
    static getChildren( id ){
        
        return new Promise(( parent_resolve, parent_reject) => {
            
            this.generic_call( `http://paleobiodb.org/data1.2/taxa/single.json?id=${id}&show=nav`, 'get' )
            .then ( (nav) => {
                
                let p_array = [];
                
                nav.records[0].chl.forEach( (item) => {
                   
                    p_array.push( PaleoDB.getNode( item.oid, 'id' ) );
                });
                
                Promise.all( p_array ).then( (values) => {
                    
                    parent_resolve( values );
                },
                (error) => {
                    parent_reject( error );
                });
            });
        });
    }

    static getWikiPage( name ){
        
        let n = encodeURI( name );
        let headers = new Headers();
        headers.append( 'Access-Control-Allow-Origin', '*' );
        
        return this.generic_call( `http://wikipedia.org/wiki/${n}`, 'get', headers );
    }

    static getFossilData( tax_id ){
        
        return this.generic_call( `https://paleobiodb.org/data1.2/occs/list.json?base_id=${tax_id}&show=loc,class,coords`, 'get' );
    }
    
    static getDetails( name ){
        
        return new Promise( (p_resolve, p_reject) => {
           
            let n = encodeURI( name );
            
            this.generic_call( `http://eol.org/api/search/1.0.json?q=${n}&page=1&exact=true&key=${PaleoDB.eolKey}`, 'get' )
            .then( (result) => {


                if ( !result.hasOwnProperty( 'results' ) || result.results.length < 1 ){
                    p_reject( 'No information found for this item.' );
                    return;
                }

                let result_to_use = result.results.reduce( (item, winner) => {
                    
                    let winner_count = winner.content.split( ';' ).length;
                    let item_count = item.content.split( ';' ).length;
                    
                    if ( item_count > winner_count ){
                        winner = item;
                    }
                    
                    return winner;
                });
                
                let pageId = result_to_use.id;

                this.generic_call( `http://eol.org/api/pages/1.0.json?batch=false&id=${pageId}&images_per_page=100&images_page=1&videos_per_page=10&videos_page=1&sounds_per_page=100&sounds_page=1&maps_per_page=0&maps_page=0&texts_per_page=100&texts_page=1&subjects=overview&licenses=all&details=true&common_names=true&synonyms=true&references=true&taxonomy=true&vetted=0&cache_ttl=&language=en&key=${PaleoDB.eolKey}`, 'get').then( (result) => {

                    p_resolve( result );
                });
            });
        });
    }
}

export default PaleoDB;