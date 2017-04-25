import {observable, computed} from 'mobx';

export class Details {
    
    _texts = [];
    _images = [];
    _references = [];
    _videos = [];
    _title = '';
    _node = -1;
    @observable _now_showing = 'text';

    initialize( node, rawDetails ){
        this._title = rawDetails.scientificName;
        this._node = node;
        
        rawDetails.dataObjects.forEach( (d) => {
            
            let r = new Resource();
            
            r.initialize( d );
            
            if ( r.type === 'text/html' ){
                this.texts.push( r );
            }
            else if ( r.type.includes( 'jpg' ) || r.type.includes( 'gif' ) || r.type.includes( 'png' ) || r.type.includes( 'jpeg' ) ){
                this.images.push( r );
            }
            else if ( r.type.includes( 'mov' ) || r.type.includes( 'mp4' ) || r.type.includes( 'webm') || r.type.includes( 'video' ) ){
                this.videos.push( r );
            }
        });
    }

    get title(){
        return this._title;
    }

    get texts(){
        return this._texts;
    }

    get images(){
        return this._images;
    }

    get videos(){
        return this._videos;
    }

    get node(){
        return this._node;
    }

    get now_showing(){
        return this._now_showing;
    }

    set now_showing( place ){
        this._now_showing = place;
    }
}

export class Resource {
    
    _link = '';
    _type = 'text/html';
    _citation = '';
    _text = '';

    initialize( rawItem ){
        
        this.type = rawItem.mimeType;
        this.citation = rawItem.bibliographicCitation;
        this.link = rawItem.mediaURL;
        this.text = rawItem.description;
    }

    set link( l ){
        this._link = l;
    }

    get link(){
        return this._link;
    }

    set type( t ){
        this._type = t;
    }

    get type(){
        return this._type;
    }

    set citation( c ){
        this._citation = c;
    }

    get citation(){
        return this._citation;
    }

    set text( t ){
        this._text = t;
    }

    get text(){
        return this._text;
    }
}