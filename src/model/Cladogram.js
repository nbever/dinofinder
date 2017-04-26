import {observable, computed} from 'mobx';
import PaleoDB from '../services/paleodb_service';
import {FossilOccurence} from './Fossils';

export class Cladogram {
    
    @observable root;

    constructor(){
    
        this.init();
    }
    
    init(){
        
        PaleoDB.getNode( 'Dinosauria' ).then ( (node) => {
            let record = node.records[0];
            this.root = new CladogramNode( record.oid.split(':')[1], record.nam, record.fea, record.lla, record.img, record.par, (record.chl.length > 0) );
        });
    }
    
    @computed get nodes(){
        return this.root;
    }

    setRoot( node ){
        node.parent = undefined;
        this.root = node;
    }

    reroot(){
        PaleoDB.getNode( this.root.parent_id, 'id' ).then( (node) => {
            let record = node.records[0];
            let newRoot = new CladogramNode( record.oid.split(':')[1], record.nam, record.fea, record.lla, record.img, record.par, (record.chl.length > 0) );
            newRoot.addChild( this.root );
            this.root = newRoot;
        });
    }

    resetTo( searchText ){
        PaleoDB.getNode( encodeURI( searchText ) ).then( (node) => {
           
            if ( node === undefined || node.records.length === 0 ){
                return;
            }
            
            let record = node.records[0];
            let newRoot = new CladogramNode( record.oid.split(':')[1], record.nam, record.fea, record.lla, record.img, record.par, (record.chl.length > 0) );
            this.root = newRoot;
        });
    }
}

export class CladogramNode {
    
    @observable children;
    childrenLoaded = false;
    @observable _fossil_data = undefined;
    
    constructor( id, name, first_appearence=-1, last_appearence=-1, thumbnail='', parent_id = -1, hasChildren=false ){
        this.oid = id;
        this.txn_name = name;
        this.first_appearence = first_appearence;
        this.last_appearence = last_appearence;
        this.txn_thumbnail = thumbnail;
        this.children = [];
        this.descendantCount = 0;
        this._hasChildren = hasChildren;
        this._parent_id = parent_id;
    }

    addChild( newNode ){
        
        if ( newNode instanceof CladogramNode ){
            
            newNode.parent = this;
            this.children.push( newNode );
            this.newDescendant( newNode.descendantCount );
        }
    }

    newDescendant( count ){
        
        // have to count the parent itself
        count++;
        
        this.descendantCount += count;
        
        if ( this.parent !== undefined ){
            this.parent.newDescendant();
        }
    }
    
    showChildren(){
        
        if ( this.childrenLoaded === true ){
            return;
        }
        
        this.children = [];
        
        return PaleoDB.getChildren( this.id ).then( (children) => {
            
            children.forEach( (ch) => {
                let record = ch.records[0];
                let cdNode = new CladogramNode( record.oid.split(':')[1], record.nam, record.fea, record.lla, record.img, record.par, (record.chl.length > 0) );
                this.addChild( cdNode );                
            });
            
            this.childrenLoaded = true;
        });
    }
     
    removeChild( child ){
        
        let i = this.children.findIndex( (e) => {
            return e.id === child.id 
        });
        
        if ( i !== -1 ){
            this.children.splice( i, 1 );
        }
        
        this.childrenLoaded = false;
    }

    get thumbnail(){
        return 'https://paleobiodb.org/data1.2/taxa/thumb.png?id=' + this.txn_thumbnail.split(':')[1];
    }
     
    get fossil_data(){
        
        return new Promise( (resolve, reject) => {
            
            if ( this._fossil_data === undefined ){

                PaleoDB.getFossilData( this.id ).then( (f_data) => {   
                    this._fossil_data = f_data.records.map( (occ, index) => {
                        let f = new FossilOccurence();
                        f.initialize( occ );
                        return f;
                    });
                    
                    resolve( this._fossil_data );
                    return;
                });
            }
            else {
                resolve( this._fossil_data );
            }
        });
    }

    get appearence(){
        return this.first_appearence;
    }
    
    get extinction(){
        return this.last_appearence;
    }

    get id(){
        return this.oid;
    }
    
    get name(){
        return this.txn_name;
    }
    
    get descendants(){
        return this.children;
    }
     
    get parent_id(){
        return this._parent_id;
    }

    get parent(){
        return this.parent_node;
    }

    set parent( node ){
        this.parent_node = node;
    }
     
    get hasChildren(){
        return this._hasChildren;
    }
}