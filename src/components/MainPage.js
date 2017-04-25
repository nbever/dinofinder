import React from 'react';
import {observer} from 'mobx-react';

import CladogramView from './CladogramView';

@observer
class MainPage extends React.Component {
    
    constructor(props){
        super( props );
        
        this.state = {
            searchValue: ''
        };
    }
    
    startSearch( $event ){
        if ( $event.keyCode === 13 ){
            this.props.viewState.cladogram.resetTo( $event.target.value );
        }
    }
    
    typing( $event ){
        this.setState( {searchValue: $event.target.value} );
    }
    
    toggleClad(){
        this.props.viewState.toggleClad();
    }
    
    toggleMap(){
        this.props.viewState.toggleMap();
    }
    
    render(){
        
        let showClad = false;
        let showMap = false;
        
        return (
            <div className="main-page">
                <div className="button-bar">
                    <div className={"icon-tree left " + ((this.props.viewState.showClad) ? 'selected' : '' )} onClick={ ()=>this.toggleClad()}/>
                    <div className={"icon-map right " + ((this.props.viewState.showMap) ? 'selected' : '' )} onClick={() => this.toggleMap()}/>
                </div>
                <div className="cladogram-parent">
                    { this.props.viewState.showClad === true &&
                        <CladogramView cladogram={ this.props.viewState.cladogram } viewState={ this.props.viewState }/>
                    }
                </div>
                <div className="search-field">
                    <input type="text" onChange={ ($event) => this.typing( $event ) } onKeyUp={ ($event) => this.startSearch( $event ) } value={ this.state.searchValue} placeholder="Search"/>
                </div>                
            </div>
        );
    }
}

export default MainPage;