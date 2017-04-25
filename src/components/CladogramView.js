import React from 'react';
import { observer } from 'mobx-react';

import CladogramColumn from './CladogramColumn';
import { CladogramNode } from '../model/Cladogram';

@observer
class CladogramView extends React.Component {
    
    timeElement = undefined;
    
    constructor(props){
        
        super( props );
    }
    
    changeRoot( node ){
        this.props.cladogram.setRoot( node );
    }

    reroot(){
        this.props.cladogram.reroot();
    }
    
    showInfo( node ){
        this.props.viewState.showInfo( node );
    }
    
    drawNode( node, viewCollection ){
        
        // draw half the kids first.
        if ( node.descendants !== undefined && node.descendants.length > 0 ){
            
            // draw every other one, assume sorted from earliest to latest.
            node.descendants.forEach( (item, index) => {
                if ( index % 2 !== 0 ){
                    return;
                }
                
                this.drawNode( item, viewCollection );
            });
        }
        
        let rootNode = this.props.cladogram.nodes;
        
        // draw me
        node.column_id = viewCollection.length;
        var column = <CladogramColumn node={node} scale={ {fea: rootNode.first_appearence, lla: rootNode.last_appearence} } key={node.id} rootChange={ this.changeRoot.bind( this ) } showInfo={ this.showInfo.bind( this )} reroot={ this.reroot.bind( this ) }/>
        viewCollection.push( column );
        
        // draw the other half of the children
        if ( node.descendants !== undefined && node.descendants.length > 0 ){
         
            for ( let i = node.descendants.length-1; i > 0; i-- ){
                if ( i % 2 === 0 ){
                    continue;
                }
                
                this.drawNode( node.descendants[i], viewCollection );
            }
        }
        
        return viewCollection;
    }
    
    includeTimeScale( timeScale ){
        if ( timeScale.start >= this.props.cladogram.root.last_appearence &&
           timeScale.end <= this.props.cladogram.root.first_appearence ){
            return true;
        }

        return false;
    }
    
    buildTimeScales(){
        
        if ( this.props.cladogram.root === undefined ){
            return [];
        }
        
        let timeScales = [];
        
        this.props.viewState.ages.forEach( (era) => {
           
            if ( !this.includeTimeScale( era ) ){
                return;
            }
            
            era.periods.forEach( (period) => {
               
                if ( !this.includeTimeScale( period ) ){
                    return;
                }
                
                period.epochs.forEach( (epoch) => {
                    
                    if ( !this.includeTimeScale( epoch ) ){
                        return;
                    }
                    
                    timeScales.push( epoch );
                });
                
                timeScales.push( period );
            });
            
            timeScales.push( era );
        });
        
        let diff = this.props.cladogram.root.first_appearence - this.props.cladogram.root.last_appearence;
        let scalar = 2000.0 / diff; 
        
        return timeScales.map( (ts) => {
            
            let clazz = ts.constructor.name.toLowerCase();
            let height = (ts.start - ts.end) * scalar;
            let top = (this.props.cladogram.root.first_appearence - ts.start) * scalar;
            
            let style = {
                height: height,
                top: top
            };
            
            return (
                <div className={clazz + ' time-scale-item'} key={ts.key} style={style}>
                    <div className="inner-scale">{ts.name}</div>
                </div>
            ); 
        });
    }
    
    flattenTree(){
        
        if ( this.props.cladogram.root === undefined ){
            return;
        }
        
        var views = this.drawNode( this.props.cladogram.root, [] );
        return views;
    }

    pageScrolled( $event ){
        this.timeElement.style.left = $event.target.scrollLeft;
    }
    
    render(){
        
        var views = this.flattenTree();
        
        var timeScales = this.buildTimeScales();
        
        return (
            <div className="cladogram-view" onScroll={ ($event) => this.pageScrolled( $event ) }>
                <div className="time-parent">
                    <div className="time-scale" ref={ (elem) => this.timeElement = elem }>
                        {timeScales}
                    </div>
                </div>
                {views}
            </div>
        );
    }
}

export default CladogramView;