import React, {Component} from 'react';
import {observer} from 'mobx-react';

import FossilMap from './FossilMap';

@observer
class InfoDialog extends Component {
    
    injectHtml( elm, text ){
        
        if ( elm === null ){
            return
        }
        
        elm.innerHTML = text;
    }
    
    showMe( picture ){
        this.setState( { showPic: picture } );
    }
    
    buildInfo(){
        let text = this.props.viewState.infoItem.texts.map( (t, index) => {
            let tmp = <div className="text-block" ref={ (elm) => this.injectHtml( elm, t.text) } key={index}></div>
            
            return tmp;
        });
        
        return text;
    }
    
    buildImages(){
        
        let images = this.props.viewState.infoItem.images.map( (i, index) => {
           
            let img = <div className="image-thumbnail" style={{ backgroundImage: "url('" + i.link + "')" }} onClick={ () => this.showMe( i ) } key={index}/>
        
            return img;
        });

        let urlToStartWith = '';

        if ( this.state !== null && this.state.showPic !== undefined ){
            urlToStartWith = this.state.showPic.link;
        }
        else if ( this.props.viewState.infoItem.images.length > 0 ){
            urlToStartWith = this.props.viewState.infoItem.images[0].link;
        }
        
        let iViewer = (
            <div className="image-viewer">
                <div className="full-view" style={{backgroundImage: "url('" + urlToStartWith + "')"}} >
                </div>
                <div className="tape">
                    {images}
                </div>
            </div>
        );
        
        return iViewer;
    }
    
    buildVideo(){
        let videos = this.props.viewState.infoItem.videos.map( (m, index) => {
            
            let v = (
                <iframe width="420" height="315" src={ m.link } key={index}/>
            );
              
            return v;
        });
        
        return videos;
    }

    buildMap(){
        return <FossilMap info={ this.props.viewState.infoItem } />;
    }
    
    buildViewingContent(){
        
        if ( this.props.viewState.infoItem.now_showing === 'text' ){
            return this.buildInfo();
        } 
        else if ( this.props.viewState.infoItem.now_showing === 'images' ){
            return this.buildImages();
        }
        else if ( this.props.viewState.infoItem.now_showing === 'videos' ){
            return this.buildVideo();
        }
        else if ( this.props.viewState.infoItem.now_showing === 'map' ){
            return this.buildMap();
        }
    }
    
    navigateTo( place ){
        this.props.viewState.infoItem.now_showing = place;
    }
    
    render(){
        
        let texts = this.buildViewingContent();

        return (
            <div className="info-dialog">
                <div className="title-bar">
                    <div className="title-text">
                        { this.props.viewState.infoItem.title }
                    </div>
                    <span className="icon-minus" onClick={ () => this.props.viewState.closeInfo() }></span>
                </div>
                <div className="info-body">
                    <div className="info-nav">
                        <div onClick={ () => this.navigateTo( 'text' ) } className={ "nav-item icon-info " + ((this.props.viewState.infoItem.now_showing === 'text') ? 'selected' : '')}></div>
                        <div onClick={ () => this.navigateTo( 'images' ) } className={ "nav-item icon-wallpaper " + ((this.props.viewState.infoItem.now_showing === 'images') ? 'selected' : '')}></div>
                        <div onClick={ () => this.navigateTo( 'videos' ) } className={ "nav-item icon-videocam " + ((this.props.viewState.infoItem.now_showing === 'videos') ? 'selected' : '')}></div>
                        <div onClick={ () => this.navigateTo( 'sounds' ) } className={ "nav-item icon-volume_up " + ((this.props.viewState.infoItem.now_showing === 'sounds') ? 'selected' : '')}></div>
                        <div onClick={ () => this.navigateTo( 'map' ) } className={ "nav-item icon-world " + ((this.props.viewState.infoItem.now_showing === 'map') ? 'selected' : '')}></div>                        
                    </div>
                    <div className="info-text">
                        {texts}
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoDialog;