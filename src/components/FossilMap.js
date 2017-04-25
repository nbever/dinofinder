import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Datamap from 'datamaps';

@observer
class FossilMap extends React.Component {
    
    map = undefined;
    
    mapElement( elem ){
        this.map = elem;
    }

    componentWillMount(){
        this.props.info.node.fossil_data;
    }

    componentDidMount(){
        if ( this.map === undefined ){
            return;
        }
        
        let m = new Datamap({
            element: this.map,
            scope: 'world',
            projection: 'mercator',
            responsive: true
        });
        
        if ( this.props.info.node.fossil_data === undefined ){
            return;
        }
        
        let mungedData = this.props.info.node.fossil_data.map( (fd) => {
            fd.radius = 10;
            return fd;
        });
        
        m.bubbles( mungedData );
    }
    
    render(){
        
        return (
            <div className="fossil-map" ref={ (elem) => this.mapElement( elem ) }></div>
        );
    }
}

export default FossilMap;