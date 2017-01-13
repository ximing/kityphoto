/**
 * Created by yeanzhi on 16/12/8.
 */
'use strict';
import event from './lib/event.js';

export default function () {
    let {width, height} = this.$thumb[0].getBoundingClientRect();
    let imgWidth = 0,
        imgHeight = 0;
    if (this.originalImage.width >= this.originalImage.height) {
        imgWidth = width;
        imgHeight = width * this.originalImage.height / this.originalImage.width
    } else {
        imgWidth = height * this.originalImage.width / this.originalImage.height;
        imgHeight = height
    }
    let thumbPaper = this.thumbPaper = new kity.Paper(this.$thumb[0]);
    thumbPaper.setWidth(imgWidth);
    thumbPaper.setHeight(imgHeight);
    let image = new kity.Image(this.dataURI, imgWidth, imgHeight);
    thumbPaper.addShape(image);
    var visibleRect = thumbPaper.put(new kity.Rect(imgWidth, imgHeight).stroke('red', '1%'));

    let dragging = false, me = this,
        moveView = function (position) {
            let initViewBox = me.initViewBox;
            let size = visibleRect.getSize(),
                maxX = imgWidth - size.width,
                maxY = imgHeight - size.height;
            let currentX = position.x - size.width / 2 < 0 ? 0 : position.x - size.width / 2,
                currentY = position.y - size.height / 2 < 0 ? 0 : position.y - size.height / 2;
            visibleRect.setPosition(Math.min(maxX, currentX), Math.min(maxY, currentY));
            let originalImage = me.originalImage,
                viewBox = me.paper.getViewBox();
            console.log('++++++--->', position,imgHeight, imgWidth, size, originalImage,currentX,currentY,maxX,maxY);

            if (me.rotate === 0 || me.rotate === 180) {
                viewBox.x = initViewBox.x + originalImage.width * Math.min(maxX, currentX) / imgWidth;
                viewBox.y = initViewBox.y + originalImage.height * Math.min(maxY, currentY) / imgHeight;
            } else {
                viewBox.x = initViewBox.x + originalImage.height * Math.min(maxX, currentX) / imgWidth;
                viewBox.y = initViewBox.y + originalImage.width * Math.min(maxY, currentY) / imgHeight;
            }
            me.execCommand('changeViewBox', viewBox);
        };

    event.on('paperOnDrag', (viewBox) => {
        let originalImage = me.originalImage;
        let thumbPaper = {};
        let x = viewBox.x * imgWidth / this.paper.getViewBox().width;
        let y = viewBox.y * imgHeight / this.paper.getViewBox().height;
        thumbPaper = {
            x: x,
            y: y
        };
        moveView(thumbPaper)
    });

    let thumbStartDrag = this.thumbStartDrag = function (e) {
        dragging = true;
        console.log('thumbStartDrag');
        moveView(e.getPosition());
    };
    let thumbMoveDrag = this.thumbMoveDrag = function (e) {
        if (dragging) {
            moveView(e.getPosition());
        }
    };
    let thumbEndDrag = this.thumbEndDrag = function (e) {
        dragging = false;
    };

    event.on('changeScale', () => {
        if (this.rotate === 0 || this.rotate === 180) {
            let scale = this.paper.getViewBox().width / this.originalImage.width;
            console.log(this.paper.getViewBox().width,scale)
            visibleRect.setSize(imgWidth * scale, imgHeight * scale);
            visibleRect.setPosition(0,0);
        } else {
            let scale = this.paper.getViewBox().width / this.originalImage.height;
            console.log(this.paper.getViewBox().width,scale)
            visibleRect.setSize(imgWidth * scale, imgHeight * scale);
            visibleRect.setPosition(0,0);
        }
    });
    event.on('contentChange', () => {

    });

    event.on('changeRotate', () => {
        this.resetThumb();
    });

    event.on('resetThumb',()=>{
        this.resetThumb();
    });

    this.resetThumb = ()=>{
        this.thumbPaper.removeShape(image);
        if (this.rotate === 0 || this.rotate === 180) {
            if (this.originalImage.width >= this.originalImage.height) {
                imgWidth = width;
                imgHeight = width * this.originalImage.height / this.originalImage.width;
            } else {
                imgWidth = height * this.originalImage.width / this.originalImage.height;
                imgHeight = height
            }
            image = new kity.Image(this.dataURI, imgWidth, imgHeight);
            if (this.rotate === 0) {
                image.rotate(this.rotate)
            } else {
                image.rotate(this.rotate).translate(imgWidth, imgHeight)
            }
        } else {
            if (this.originalImage.height >= this.originalImage.width) {
                imgWidth = height;
                imgHeight = height * this.originalImage.width / this.originalImage.height;
            } else {
                imgWidth = width * this.originalImage.height / this.originalImage.width;
                imgHeight = width;
            }
            image = new kity.Image(this.dataURI, imgHeight, imgWidth);
            if (this.rotate === 90) {
                image.rotate(this.rotate).translate(imgWidth, 0)
            } else {
                image.rotate(this.rotate).translate(0, imgHeight)
            }
        }
        thumbPaper.addShape(image);
        thumbPaper.setWidth(imgWidth);
        thumbPaper.setHeight(imgHeight);
        thumbPaper.removeShape(visibleRect);
        visibleRect = thumbPaper.put(new kity.Rect(imgWidth, imgHeight).stroke('red', '1%'));
    };
    this.thumbPaper.on(this.DRAG_START_EVENT, thumbStartDrag);
    this.thumbPaper.on(this.DRAG_MOVE_EVENT, thumbMoveDrag);
    $(window).on(this.DRAG_END_EVENT, thumbEndDrag);
}
