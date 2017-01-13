/**
 * Created by yeanzhi on 16/12/1.
 */
'use strict';
//import './index.less';
import commands from './commands.js';
import viewbox from './viewbox.js';
import modules from './modules.js';
import color from './style/color';
import stroke from './style/stroke';
import font from './style/font';
import select from './select';
import event from './lib/event';
import mouse from './lib/jquery-mousewheel';
import coordinateConvert from './lib/coordinate-convert.js';
import dataURLtoBlob from './lib/canvas-to-blob';
let $ = require('jquery');
mouse($);
let defultOpt = {
    renderTo: '#container',
    thumb: ''
};
let DomURL = window.URL || window.webkitURL || window;

/*
 * 根据容器大小来绘制相应的图片，如果图片小于容器大小就居中显示
 * 图片大于容器大小，缩放到容器大小，显示放大，缩小控制器
 * 于是涉及到当前操作的dom区域到svg区域坐标的一个映射
 * */
export default class KityPhoto {
    constructor(blob, options) {
        let _config = Object.assign(defultOpt, options);
        this.$container = $(_config.renderTo);
        if (this.$container.length === 0) {
            throw new Error('容器不存在');
        }

        // this.$container.html(`<div id="ei-container"></div>`);
        // this.$eiContainer = $('#ei-container');
        this.config = _config;
        this.width = 0;
        this.height = 0;
        this.blob = blob;
        this.commands = {};
        this.modules = {};
        this.init();

    }

    init() {
        $('head').append('<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />');
        //this.$container.html(`<div class="ei-left-opver"></div><div class=""></div><div></div>`)
        this.$container.css('text-align', 'center');
        commands.apply(this);
        viewbox.apply(this);
        modules.apply(this);
        color.apply(this);
        stroke.apply(this);
        font.apply(this);
        select.apply(this);
        coordinateConvert.apply(this);
    }

    getPaperViewBox() {
        let {top, left, width, height} = this.$container.find('svg')[0].getBoundingClientRect();
        return {top, left, width, height};
    }

    getContainerViewBox() {
        let {top, left, width, height} = this.$container[0].getBoundingClientRect();
        return {top, left, width, height};
    }

    inPaper(x, y) {
        let {top, left, width, height} = this.getPaperViewBox();
        return x < width + left && y < top + height;
    }

    getViewBox(){
        let {width, height} = this.originalImage;
        let viewbox = {}
        if (this.rotate === 90) {
            viewbox.x = -height;
            viewbox.y = 0;
            viewbox.width = height;
            viewbox.height = width;
        } else if (this.rotate === 270) {
            viewbox.x = 0;
            viewbox.y = -height;
            viewbox.width = height;
            viewbox.height = width;
        } else if (this.rotate === 180) {
            viewbox.x = -width;
            viewbox.y = -height;
            viewbox.width = width;
            viewbox.height = height;
        } else {
            viewbox.x = 0;
            viewbox.y = 0;
            viewbox.width = width;
            viewbox.height = height;
        }
        return viewbox;
    }

    getCurrentViewBox(){
        return this.paper.getViewBox();
    }

    exportBlob() {
        this.clearDragNode();
        this.clearSelectNode();
        let svgXml = this.paper.container.innerHTML;

        let viewbox = this.getViewBox();
        let svgContainer = document.createElement('div');
        svgContainer.innerHTML = svgXml;
        let svgDom = svgContainer.querySelector('svg');
        svgDom.setAttribute('width', viewbox.width);
        svgDom.setAttribute('height', viewbox.height);
        svgDom.setAttribute('style', 'font-family: Arial, "Microsoft Yahei","Heiti SC";');
        svgDom.setAttribute('viewBox', `${viewbox.x} ${viewbox.y} ${viewbox.width} ${viewbox.height}`);

        svgContainer = document.createElement('div');
        svgContainer.appendChild(svgDom);

        svgXml = svgContainer.innerHTML;

        // Dummy IE
        svgXml = svgXml.replace(' xmlns="http://www.w3.org/2000/svg" xmlns:NS1="" NS1:ns1:xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:NS2="" NS2:xmlns:ns1=""', '');

        // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
        svgXml = svgXml.replace(/&nbsp;/g, '&#xa0;');

        return new Blob([svgXml], {type: 'image/svg+xml'});
    }

    exportCanvas(viewbox){
        let url = DomURL.createObjectURL(this.exportBlob());
        let canvas = document.createElement('canvas');
        viewbox = viewbox || this.getViewBox();
        canvas.width = viewbox.width;
        canvas.height = viewbox.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(url, 0, 0, viewbox.width, viewbox.height);
        return ctx;
    }

    exportCurrentBlob() {
        this.clearDragNode();
        this.clearSelectNode();
        let svgXml = this.paper.container.innerHTML;

        // let svgContainer = document.createElement('div');
        // svgContainer.innerHTML = svgXml;
        // let svgDom = svgContainer.querySelector('svg');
        // svgContainer = document.createElement('div');
        // svgContainer.appendChild(svgDom);
        //
        // svgXml = svgContainer.innerHTML;


        let $svg = $(svgXml).filter('svg');
        let iamge = $svg.find('g > g > image');
        $svg.find('g > g').empty().append(iamge);
        svgXml = $('<div></div>').append($svg).html();

        // Dummy IE
        svgXml = svgXml.replace(' xmlns="http://www.w3.org/2000/svg" xmlns:NS1="" NS1:ns1:xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:NS2="" NS2:xmlns:ns1=""', '');

        // svg 含有 &nbsp; 符号导出报错 Entity 'nbsp' not defined
        svgXml = svgXml.replace(/&nbsp;/g, '&#xa0;');
        return new Blob([svgXml], {type: 'image/svg+xml'});
    }
    //导出 当前 画布上面 可视范围内的图片
    exportCurrentCanvas(viewbox){
        let url = DomURL.createObjectURL(this.exportCurrentBlob());
        viewbox = viewbox || this.getCurrentViewBox();
        return new Promise(function (res, rej) {
            try {
                let img = new Image();
                img.width = viewbox.width;
                img.height = viewbox.height;
                img.onload = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = viewbox.width;
                    canvas.height = viewbox.height;
                    console.log('img over');
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, viewbox.width, viewbox.height);
                    res(ctx);
                };
                img.src = url;
                img.crossOrigin = '';
                img.onerror = function (err) {
                    console.log('img onerror',err,url);
                    rej(err);
                };
                // rej(dataURLtoBlob(url))
            } catch (err) {
                console.log(err);
                rej(err);
            }
        });
    }

    exportPng() {
        let url = DomURL.createObjectURL(this.exportBlob());
        let viewbox = this.getViewBox();
        return new Promise(function (res, rej) {
            try {
                let img = new Image();
                img.width = viewbox.width;
                img.height = viewbox.height;
                img.onload = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = viewbox.width;
                    canvas.height = viewbox.height;
                    console.log('img over');
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, viewbox.width, viewbox.height);
                    res(dataURLtoBlob(canvas.toDataURL('image/png')));
                };
                img.src = url;
                img.crossOrigin = '';
                img.onerror = function (err) {
                    console.log('img onerror',err,url);
                    rej(err);
                };
                // rej(dataURLtoBlob(url))
            } catch (err) {
                console.log(err);
                rej(err);
            }
        })
    }

    convertCoordinate(x, y) {
        let {width} = this.paper.getViewBox();
        let {width:paperWidth} = this.getPaperViewBox();
        let scale = width / paperWidth;
        return {
            x: scale * x,
            y: scale * y
        }
    }

    isPointInPaper(x, y) {
        let {top, left, width, height} = this.getPaperViewBox();
        return x >= left && x <= left + width && y <= top + height && y >= top;
    }

    clearDragNode() {
        this.dragNode = null;
    }

    addDragNode(node) {
        this.dragNode = node;
    }

    destory() {
        this.paper.off(this.DRAG_START_EVENT);
        $(window).off(this.DRAG_END_EVENT, this.endDrag);
        this.paper.clear();
        this.paper = null;
        if(this.thumbPaper){
            this.thumbPaper.off(this.DRAG_START_EVENT);
            this.thumbPaper.off(this.DRAG_MOVE_EVENT);
            this.thumbPaper.clear();
            this.thumbPaper = null;
        }
        $(window).off(this.DRAG_END_EVENT, this.thumbEndDrag);
        this.$container.off('mousewheel');
        event.removeAllListeners();
    }

    on(eventName, callback) {
        event.on(eventName, callback)
    }

    off(eventName, callback) {
        event.removeListener(eventName, callback)
    }
}

//module.export = KityPhoto;
