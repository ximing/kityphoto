/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
//import navigator from './navigator.js';
import draw from './draw.js';
import event from './lib/event';
import scrollSkip from './lib/scroll-skip';
import thumb from './thumb';

import $ from 'jquery';

let kity = window.kity;
export default function () {
    let paper = this.paper = new kity.Paper(this.$container[0]);
    let reader = new FileReader();
    let {width, height} = this.getContainerViewBox();
    let that = this;
    let resetKityPhoto = this.resetKityPhoto = function(originWidth,originHeight){
        paper.clear();
        let scale = 1;
        let imgWidth = originWidth,
            imgHeight = originHeight;
        if (imgWidth > width) {
            scale = width / imgWidth;
        }
        if (imgHeight > height) {
            let _scale = height / imgHeight;
            if (_scale < scale) {
                scale = _scale;
            }
        }

        scale = Math.floor(scale * 10) / 10;

        imgWidth = imgWidth * scale;
        imgHeight = imgHeight * scale;
        that.paperBox = {
            width:imgWidth,
            height:imgHeight
        };
        paper.setWidth(imgWidth);
        paper.setHeight(imgHeight);
        let viewBox = {
            x:0,y:0,width:originWidth,height:originHeight
        };
        paper.setViewBox(0, 0, originWidth, originHeight);
        that.initViewBox = viewBox;
        let image = new kity.Image(that.dataURI, originWidth, originHeight);
        that.masaikeContainer = new kity.Group();
        that.opverContainer = new kity.Group();
        that.innerContainer = new kity.Group().pipe(function () {
            this.addShape(image);
            this.addShape(that.masaikeContainer);
            this.addShape(that.opverContainer);
        });
        that.rotate = 0;
        that.translate = [0,0];
        that.paper.addShape(that.innerContainer);
        that.$container.off('mousewheel');
        that.$container.on('mousewheel', function(event) {
            //滚动条向下的时候是正数，滚动条向上的时候是负数 还可能是0没啥变化
            let scale = scrollSkip(event.deltaY);
            that.execCommand('changeScale', scale);
        });
        that.selectOpver = 'draw';
        that.selectNode = null;
        that.dragNode = null;
        that.initScale = that.scale = Math.floor(imgWidth * 10 / originWidth) * 10;
        that.originalImage = {
            width: originWidth,
            height: originHeight
        };
        event.emit('paperReady');
        event.emit('resetThumb');
    };
    reader.onload = function () {
        let dataURI = this.result;
        let img = new Image();
        img.onload = function () {
            let imgWidth = this.width;
            let imgHeight = this.height;
            resetKityPhoto(imgWidth,imgHeight,dataURI);
            draw.apply(that);
            if(that.config.thumb) {
                that.$thumb = $(that.config.thumb);
                if (that.$thumb.length === 0) {
                    throw new Error('缩略图容器不存在');
                }
                thumb.apply(that);
            }
      // if (scale !== 1) {
      //   navigator.apply(that);
      // }
        };
        img.src = dataURI;
        that.dataURI = dataURI;
    };
    reader.readAsDataURL(this.blob);
    
    this.showMasaikeContainer = ()=>{
        if(this.masaikeContainer){
            $(this.masaikeContainer.node).show();
        }
    }
    this.hideMasaikeContainer = ()=>{
        if(this.masaikeContainer){
            $(this.masaikeContainer.node).hide();
        }
    }
    this.showOpverContainer =()=>{
        if(this.opverContainer){
            $(this.opverContainer.node).show();
        }
    }
    this.hideOpverContainer = ()=>{
        if(this.opverContainer){
            $(this.opverContainer.node).hide();
        }
    }
}
