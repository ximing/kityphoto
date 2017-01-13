/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
let $ = require('jquery');
let kity = window.kity;
let generateCircle = function (x, y, style) {
    return new kity.Circle(x, y, 10).setStyle(Object.assign({}, {
        'stroke': 'red',
        'stroke-width': 3
    }, style)).fill('#ffffff');
};
export default function (node, ei,showRect=true) {

    node.borderFrame = new kity.Group().pipe(function () {
        if(showRect){
            this.rect = new kity.Rect(0, 0, 0, 0);
            this.rect.stroke(new kity.Pen().pipe(function () {
                this.setWidth(2);
                this.setLineCap('butt');
                this.setLineJoin('miter');
                this.setColor('red');
            }));
            this.addShape(this.rect);
        }

        this.rightTopPoint = generateCircle(0, 0, {cursor: 'ne-resize'});
        this.leftTopPoint = generateCircle(0, 0, {cursor: 'nw-resize'});
        this.rightBottomPoint = generateCircle(0, 0, {cursor: 'se-resize'});
        this.leftBottomPoint = generateCircle(0, 0, {cursor: 'sw-resize'});
        ei.execCommand('addShape', node);

        this.rightTopPoint.on('mousedown', function (e) {
            ei.clearDragNode();
            ei.addSelectNode(node);
            node.startPosition = node.getLeftBottomPosition();
        });
        this.rightBottomPoint.on('mousedown', function (e) {
            ei.clearDragNode();
            ei.addSelectNode(node);
            node.startPosition = node.getLeftTopPosition();
        });
        this.leftTopPoint.on('mousedown', function (e) {
            ei.clearDragNode();
            ei.addSelectNode(node);
            node.startPosition = node.getRightBottomPosition();
        });
        this.leftBottomPoint.on('mousedown', function (e) {
            ei.clearDragNode();
            ei.addSelectNode(node);
            node.startPosition = node.getRightTopPosition();
        });
        this.addShape(this.rightTopPoint);
        this.addShape(this.leftTopPoint);
        this.addShape(this.rightBottomPoint);
        this.addShape(this.leftBottomPoint);

    });

    node.addFrame = function () {
    //this.removeFrame();
        if($(`#${node.borderFrame.getId()}`).length === 0) {
           ei.innerContainer.addShape(node.borderFrame);
           //ei.paper.addShape(node.borderFrame);
        }else{
            $(`#${node.borderFrame.getId()}`).show();
        }
    };
    node.removeFrame = function () {
        if($(`#${node.borderFrame.getId()}`).length !== 0) {
            $(`#${node.borderFrame.getId()}`).hide();
        }
    //ei.paper.removeShape(node.borderFrame);
    };
    node.borderFrameDragMove = function (currentPosition, startPosition) {
        let view = {
            width: currentPosition.x - startPosition.x,
            height: currentPosition.y - startPosition.y
        };
        let x = 0, y = 0;
        if (view.width < 0) {
            x = currentPosition.x;
        } else {
            x = startPosition.x;
        }
        if (view.height < 0) {
            y = currentPosition.y;
        } else {
            y = startPosition.y;
        }
        if(showRect){
            this.borderFrame.rect.pipe(function () {
                this.setSize(Math.abs(view.width), Math.abs(view.height));
                this.setPosition(x, y);
            });
        }



    //这里要保证四个方向的按钮，按照名称在自己的位置上面，不管用户是从什么方向滑动
        this.borderFrame.rightBottomPoint.setCenter(Math.max(currentPosition.x, startPosition.x), Math.max(currentPosition.y, startPosition.y)).setRadius(10);
        this.borderFrame.rightTopPoint.setCenter(Math.max(currentPosition.x, startPosition.x), Math.min(currentPosition.y, startPosition.y)).setRadius(10);

        this.borderFrame.leftTopPoint.setCenter(Math.min(currentPosition.x, startPosition.x), Math.min(currentPosition.y, startPosition.y)).setRadius(10);
        this.borderFrame.leftBottomPoint.setCenter(Math.min(currentPosition.x, startPosition.x), Math.max(currentPosition.y, startPosition.y)).setRadius(10);

    };
    node.borderFrameTranslate = function (bx, by) {
        this.borderFrame.setTranslate(bx, by);
    }
}
