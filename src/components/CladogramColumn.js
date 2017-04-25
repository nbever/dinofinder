import React from 'react';
import { observer } from 'mobx-react';

class CladogramColumn extends React.Component{
    
    column_width = 150;
    connector = undefined;
    lifeSpan = undefined;
    container = undefined;
    thumbnail = undefined;
    nameElem = undefined;
    _scalar = 1;
    
    constructor( props ){
        super( props );
    }

    get scalar(){
       return this._scalar; 
    }

    set scalar( s ){
        this._scalar = s;
    }
    
    showChildren(){
        this.props.node.showChildren();
    }

    becomeRoot(){
        this.props.rootChange( this.props.node );
    }

    reroot(){
        this.props.reroot();
    }

    setContainerLocation(){
        
        if ( this.container === null ){
            return;
        }
        
        let node = this.props.node;
        
        let diff = this.props.scale.fea - node.first_appearence;
        diff *= this.scalar;
        
        this.container.style.top = diff;
        this.container.style.left = node.column_id * this.column_width;
        this.container.style.opacity = 1.0;
    }

    setConnectorLocation(){
        
        if ( this.connector === null ){
            return;
        }
        
        // tree line information
        let node = this.props.node;
        
        let left_position = 0;
        let c_width = 0;
        
        if ( node.parent !== undefined ) {
            
            c_width = Math.abs( node.parent.column_id - node.column_id ) * this.column_width;
        
            if ( (node.parent.column_id - node.column_id) > 0 ){
                left_position = (this.column_width / 2) - 13;
            }
            else {
                left_position = (-1 * ((c_width - this.column_width) + this.column_width/2)) + 13
            }
        } 
        
        this.connector.style.left = left_position;
        this.connector.style.width = c_width;
    }

    setLifeSpanSize(){
        
        if ( this.lifeSpan === null ){
            return;
        }
        
        let start = this.props.scale.fea - this.props.node.first_appearence;
        start *= this.scalar;
        
        let end = this.props.scale.fea - this.props.node.last_appearence;
        end *= this.scalar;
        
        this.lifeSpan.style.height = end - start;
        this.lifeSpan.style.top = 2;
    }

    removeNode(){
        
        if ( this.props.node.parent === undefined ){
            return;
        }
        
        this.props.node.parent.removeChild( this.props.node );
    }

    showInfo(){
       this.props.showInfo( this.props.node );
    }

    mouseOverLifeSpan( $event ){
        let node = this.props.node;
        
        let diff = this.props.scale.fea - node.first_appearence;
    
        diff *= this.scalar;
        
        let p = $event.target;
        let scrollHeight = 0;
        
        while ( p.className !== 'main-page' ){
            scrollHeight += p.scrollTop;
            p = p.parentNode;
        }
        
        this.thumbnail.style.top = $event.clientY + scrollHeight - diff - 100;
        this.nameElem.style.top = $event.clientY + scrollHeight - diff - 100;
    }

    mouseExitLifeSpan( $event ){
        this.thumbnail.style.top = 0;
        this.nameElem.style.top = 0;
    }

    connectorAdded( elem ){
        this.connector = elem;
        setTimeout( this.setConnectorLocation.bind( this ), 400 );
    }

    containerAdded( elem ){
        this.container = elem;
        setTimeout( this.setContainerLocation.bind( this ), 200 );
    }
    
    lifeSpanAdded( elem ){
        this.lifeSpan = elem;
        setTimeout( this.setLifeSpanSize.bind( this ), 200 );
    }

    render(){
        this.scalar = 2000.0 / (this.props.scale.fea - this.props.scale.lla);
        
        var name = '';
        let imgStyle = {};
        
        if ( this.props.node !== undefined ){
            name = this.props.node.name;
            
            imgStyle = {
                backgroundImage: 'url(' + this.props.node.thumbnail + ')',
            };
        }
        
        let dotStyle = {
            right: 0
        };
        
        if ( this.props.node.parent !== undefined && this.props.node.parent.column_id - this.props.node.column_id < 0 ){
            dotStyle = {
                left: 0
            };
        }
        
        let leaf = '';
        
        if ( this.props.node.hasChildren === false ){
            leaf = 'leaf';
        }
        
        return(
            
            <div className="cladogram-column" ref={ (elem) => this.containerAdded( elem )}>
                <div style={imgStyle} className={ 'thumbnail ' + leaf} ref={ (elem) => this.thumbnail = elem} onMouseLeave={ ($event) => this.mouseExitLifeSpan( $event) }>
                    <span className="icon-info" onClick={ () => this.showInfo() }/>
                    { this.props.node.parent !== undefined &&
                    <span className="icon-minus" onClick={ () => this.removeNode()} />
                    }
                    <div className="actions">
                        <div className="placeholder">
                        { this.props.node.parent === undefined &&
                            <div className="icon-merge_type" onClick={ () => this.reroot() }/>
                        }
                        </div>
                        <div className="placeholder">
                        { this.props.node.parent !== undefined && 
                        <div className="icon-radio_button_checked" onClick={ () => this.becomeRoot() }/>
                        }
                        </div>
                        <div className="placeholder">
                        { this.props.node.hasChildren === true &&
                            <div className="icon-play_for_work" onClick={ () => this.showChildren() }/>
                        }
                        </div>
                    </div>
                </div>
                <div className="life-span" ref={ (elem) => this.lifeSpanAdded( elem ) } onMouseEnter={ ($event) => this.mouseOverLifeSpan( $event)}></div>
                <div className="clad-name" ref={ (elem) => this.nameElem = elem }>{ name }</div>
                <div className="connector" ref={ (elem) => this.connectorAdded( elem ) }>
                    { this.props.node.parent !== undefined &&
                        <div className="connector-dot" style={ dotStyle }></div>
                    }
                </div>
            </div>
        );
    }
}

export default CladogramColumn;