/**
 * Created by yeanzhi on 16/12/9.
 */
'use strict';
import dragNode from '../lib/drag-node';
import event from '../lib/event.js';
import borderFrame from '../lib/two-point-border-frame'
export default function (ei) {
    let startPosition,
        polyline;
    ei.modules['arrow'] = {
        dragStart(_startPosition) {
            startPosition = _startPosition;
            polyline = new kity.Polyline().pipe(function () {
                this.addPoint(new kity.ShapePoint(startPosition.x, startPosition.y));
                this.addPoint(new kity.ShapePoint(startPosition.x + 1, startPosition.y + 1));
            });
            polyline.setStyle({
                'stroke': ei.selectColor,
                'stroke-width': ei.selectStroke
            });
            polyline.changeColor = function (color) {
                this.setStyle({
                    stroke: color,
                    'stroke-width': ei.selectStroke
                })
            };
            polyline.changeStroke = function (stroke) {
                this.setStyle({
                    'stroke-width': stroke,
                    'stroke': ei.selectColor
                })
            };
            dragNode(polyline)(ei);
            polyline.getBottomPosition = function () {
                let point0 = this.getPoint(0);
                let point1 = this.getPoint(1);
                let bottomPoint;
                if (point0.y > point1.y) {
                    bottomPoint = point0;
                } else {
                    bottomPoint = point1;
                }
                let translate = this.transform.translate || [0, 0];
                return {
                    x: bottomPoint.x + translate[0],
                    y: bottomPoint.y + translate[1]
                }
            };
            polyline.getTopPosition = function () {
                let point0 = this.getPoint(0);
                let point1 = this.getPoint(1);
                let topPoint;
                if (point0.y < point1.y) {
                    topPoint = point0;
                } else {
                    topPoint = point1;
                }
                let translate = this.transform.translate || [0, 0];
                return {
                    x: topPoint.x + translate[0],
                    y: topPoint.y + translate[1]
                }
            };
            polyline.resize = function (currentPosition, startPosition) {
                let translate = this.transform.translate || [0, 0];
                startPosition = {
                    x: startPosition.x - translate[0],
                    y: startPosition.y - translate[1]
                };
                currentPosition = {
                    x: currentPosition.x - translate[0],
                    y: currentPosition.y - translate[1]
                };
                this.borderFrameDragMove(currentPosition, startPosition);
                this.pipe(function () {
                    this.getPoint(0).setX(startPosition.x).setY(startPosition.y);
                    this.getPoint(1).setX(currentPosition.x).setY(currentPosition.y);
                })
                this.borderFrameDragMove(currentPosition, startPosition);
            };
            // ei.execCommand('addShape', polyline);
            borderFrame(polyline, ei);
            polyline.addFrame();
        },
        dragMove(currentPosition) {
            if (startPosition) {
                polyline.resize(currentPosition, startPosition);
            }
        },
        dragEnd(e) {
            ei.addSelectNode(polyline);
        }
    }
}
