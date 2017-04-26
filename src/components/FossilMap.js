import React, {Component} from 'react';
import {observer} from 'mobx-react';
import jQuery from 'jquery';
import jvectormap from 'jvectormap';
import world_mill from '../model/world_mill'

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
        
        let m = {
            map: 'world_mill' 
        };
        
        
        this.props.info.node.fossil_data.then( (fossil_data) => {
            
            m.markers = fossil_data.map( (fd) => {
                return { name: fd.name + ': ' + fd.area + ', ' + fd.country, latLng: [fd.latitude, fd.longitude] } 
            });
            
            $(this.map).vectorMap( m ); 
        });
    }
    
    render(){
        
        return (
            <div className="fossil-map" ref={ (elem) => this.mapElement( elem ) }></div>
        );
    }
}

export default FossilMap;