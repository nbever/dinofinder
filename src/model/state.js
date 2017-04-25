import {observable, computed} from 'mobx';

import {Cladogram} from './Cladogram';
import {Details, Resource} from './Details';
import PaleoDB from '../services/paleodb_service';
import {buildAges} from './Ages';

class ViewState {
    
    @observable mapState = false;
    @observable cladState = true;
    @observable _infoItem = undefined;
    @observable _loadingInfo = false;
    @observable _cladogram = undefined;
    _ages = undefined;
    
    constructor(){
        this.init();
    }

    init(){
        this._cladogram = new Cladogram();   
        this._ages = buildAges();
    }

    toggleMap(){
        this.mapState = !this.mapState;
    }
     
    toggleClad(){
        this.cladState = !this.cladState;
    }
     
    showInfo( node ){
        
        this._loadingInfo = true;
        PaleoDB.getDetails( node.name ).then( (details) => {
            let item = new Details();
            item.initialize( node, details );
        
            if ( item.texts.length === 0 ){
                // try the wiki page
                let n = encodeURI( name );
                let r = new Resource();
                r.text= `<iframe src="http://en.wikipedia.org/wiki/${n}" width="100%" height="100%"></iframe>`;
                item.texts.push( r );
            }
        
            item.now_showing = 'text';
            this._infoItem = item;
            
            this._loadingInfo = false;
        })
        .catch( (err) => {
            alert( err );
            this._loadingInfo = false;
        });
    }
     
    closeInfo(){
        this._infoItem = undefined;
    }
    
    get cladogram(){
        return this._cladogram;
    }
     
    get ages(){
        return this._ages;
    }
     
    @computed get showMap(){
        return this.mapState;
    }
    
    @computed get showClad(){
        return this.cladState;
    }

    get infoItem(){
        return this._infoItem;
    }
    
    get isLoadingInfo(){
        return this._loadingInfo;
    }
}

export default ViewState;