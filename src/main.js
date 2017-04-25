import React from 'react'
import {render} from 'react-dom'
import ViewState from './model/state';
import {observer} from 'mobx-react';

import MainPage from './components/MainPage';
import InfoDialog from './components/InfoDialog';

require( './styles/base.scss' );

String.prototype.width = function(font) {
  var o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': font})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
}

@observer
class App extends React.Component {
    
    render(){
        return (
            <div className="main">
                { this.props.viewState.isLoadingInfo &&
                    <div className="veil">
                        <div className="loading-block">
                            <div className="loading-image"></div>
                            <span>Loading...</span>
                        </div>
                    </div>
                }
                { this.props.viewState.infoItem !== undefined && 
                    <InfoDialog viewState={this.props.viewState} />
                }
                <div className="title-parent">
                    <div className="bar">
                        <div className="logo-parent">
                            <div className="logo"/>
                            <h1>
                                DinoFinder
                                <span className="handwriting">v1.0</span>
                            </h1>
                        </div>
                    </div>
                </div>
                <MainPage viewState={this.props.viewState}/>
            </div>
        );
    }
}

var viewState = new ViewState();
render( <App viewState={ viewState }/>, document.getElementById( 'app' ) );
