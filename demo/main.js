/**
 * Created by yeanzhi on 17/1/13.
 */
'use strict';
import React, {Component} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import classnames from 'classnames';

import KityPhoto from '../src/index'

export default class WrapContainer extends Component {
    constructor() {
        super();
        this.state = {
            isEdit: false,
            editOpver: 'draw',
            editColor: 'black',
            editStroke: 8
        };
    }

    componentDidMount() {

        var xhr = new XMLHttpRequest();
        let that = this;
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                window.kityphoto = that.kp = new KityPhoto(this.response, {
                    renderTo: '#upload-file-image-preview-paper',
                });
                that.kp.on('cancelOpver', () => {
                    that.setState({
                        editOpver: ''
                    })
                });
                that.kp.on('contentChange', () => {
                    if (!that.state.isEdit) {
                        that.setState({
                            isEdit: true
                        });
                    }
                });
                that.kp.on('changeOpver', (opver) => {
                    that.setState({
                        editOpver: opver
                    })
                })
            }
        }
        xhr.open('GET', 'http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297784369.jpeg');
        // xhr.open('GET', 'http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297784312.jpeg');
        // xhr.open('GET', 'http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297783376.jpeg');
        // xhr.open('GET', 'http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297783302.jpeg');
        // xhr.open('GET', 'http://mss.ximing.ren/v1/mss_814dc1610cda4b2e8febd6ea2c809db5/image/1484297783036.jpeg');
        xhr.responseType = 'blob';
        xhr.send();
    }

    componentWillUnmount() {
        if (this.kp) {
            this.kp.destory();
            this.kp = null;
            $('#upload-file-image-preview-paper').empty();
        }
    }

    removePhotoEditor() {
        this.setState({
            isEdit: false,
            editOpver: 'draw',
            editColor: 'black',
            editStroke: 8
        });
        if (this.kp) {
            this.kp.resetKityPhoto(this.kp.originalImage.width, this.kp.originalImage.height);
        }
    };

    changeEditorAction(opver) {
        return () => {
            this.kp.execCommand('changeOpver', opver);
        }
    };

    changeEditorColor(color) {
        return () => {
            this.kp.execCommand('color', color);
            this.setState({
                editColor: color
            });
        }
    };

    changeRoutate() {
        this.kp.execCommand('changeRotate', 90);
    };

    changeEditorStroke(stroke) {
        return () => {
            this.kp.execCommand('stroke', stroke);
            this.setState({
                editStroke: stroke
            });
        }
    };

    changeScale(scale) {
        return () => {
            this.kp.execCommand('changeScale', scale);
        }
    };


    getWindowViewPort() {
        return {
            height: $(window).height(),
            width: $(window).width()
        }
    }

    getDialogViewPort() {
        const {height, width} = this.getWindowViewPort();
        return {
            width: width < 680 ? 680 : width > 900 ? 900 : width,
            height: height < 450 ? 450 : height > 600 ? 600 : height
        }
    }


    render() {
        let btnClassname = classnames({
            'file-button': true,
            'file-button--pc': process.env.APP_ENV === 'pc',
            'upload-success': true
        });
        return (
            <div className="wrap_inner">
                <div className="main">
                    <div className="upload-file-image-preview">
                        <div id="upload-file-image-preview-paper">

                        </div>
                        <div className={btnClassname}>
                            <div className="image-thumb-btns">
                                <i className="dxicon dxicon-image-suoxiao" onClick={this.changeScale(-10)}/>
                                <div className="thumb-divider"></div>
                                <i className="dxicon dxicon-image-fangda" onClick={this.changeScale(10)}/>
                            </div>
                            <div className="image-tools-btns">
                                <i className="dxicon dxicon-image-jiantou"/>
                                <i className="dxicon dxicon-image-huabi" onClick={this.changeEditorAction('draw')}/>
                                <i className="dxicon dxicon-image-text" onClick={this.changeEditorAction('text')}/>
                                <i className="dxicon dxicon-image-masaike" onClick={this.changeEditorAction('mosaic')}/>
                                <i className="dxicon dxicon-image-xuanzhuan" onClick={this.changeRoutate.bind(this)}/>
                                <i className="dxicon dxicon-image-jiancai"/>
                                <span className="tools-divider"> </span>
                                <span className="file-button-cancel"
                                      onClick={this.removePhotoEditor.bind(this)}>复原</span>
                                <div className="tools-panel">
                                    <div className="tools-panel-brush">
                                        <div>
                                            <span className="small-brush" onClick={this.changeEditorStroke(4)}> </span>
                                        </div>
                                        <div>
                                            <span className="normal-brush" onClick={this.changeEditorStroke(8)}> </span>
                                        </div>
                                        <div>
                                            <span className="big-brush" onClick={this.changeEditorStroke(12)}> </span>
                                        </div>
                                    </div>
                                    <span className="tools-divider"> </span>
                                    <div className="tools-panel-color">
                                        <span className="color red" onClick={this.changeEditorColor('#FF3440')}> </span>
                                        <span className="color yellow"
                                              onClick={this.changeEditorColor('#FFCF50')}> </span>
                                        <span className="color green"
                                              onClick={this.changeEditorColor('#00A344')}> </span>
                                        <span className="color blue"
                                              onClick={this.changeEditorColor('#0DA9D6')}> </span>
                                        <span className="color grey"
                                              onClick={this.changeEditorColor('#999999')}> </span>
                                        <span className="color black"
                                              onClick={this.changeEditorColor('#ffffff')}> </span>
                                        <span className="color white"
                                              onClick={this.changeEditorColor('#000000')}> </span>
                                    </div>
                                </div>
                            </div>
                            <div className="ctn-btns">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}