/**
 * Created by yeanzhi on 16/12/9.
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
export default function (node, ei) {
    node.borderFrame = new kity.Group().pipe(function () {
        this.topPoint = generateCircle(0, 0, {cursor: 'ne-resize'});
        this.bottomPoint = generateCircle(0, 0, {cursor: 'ne-resize'});
        ei.execCommand('addShape', node);
        this.topPoint.on('mousedown', function (e) {
            ei.clearDragNode();
            ei.addSelectNode(node);
            node.startPosition = node.getBottomPosition();
        });
        this.bottomPoint.on('mousedown', function (e) {
            ei.clearDragNode();
            ei.addSelectNode(node);
            node.startPosition = node.getTopPosition();
        });
        this.addShape(this.topPoint);
        this.addShape(this.bottomPoint);
    });

    node.addFrame = function () {
        if ($(`#${node.borderFrame.getId()}`).length === 0) {
            ei.innerContainer.addShape(node.borderFrame);
        } else {
            $(`#${node.borderFrame.getId()}`).show();
        }
    };
    node.removeFrame = function () {
        if ($(`#${node.borderFrame.getId()}`).length !== 0) {
            $(`#${node.borderFrame.getId()}`).hide();
        }
    };
    node.borderFrameDragMove = function (currentPosition, startPosition) {
        let topPoint, bottomPoint;
        if (currentPosition.y < startPosition.y) {
            topPoint = currentPosition;
            bottomPoint = startPosition;
        } else {
            topPoint = startPosition;
            bottomPoint = currentPosition;
        }
        this.borderFrame.topPoint.setCenter(topPoint.x, topPoint.y).setRadius(10);
        this.borderFrame.bottomPoint.setCenter(bottomPoint.x, bottomPoint.y).setRadius(10);
    };
    node.borderFrameTranslate = function (bx, by) {
        this.borderFrame.setTranslate(bx, by);
    }
}
