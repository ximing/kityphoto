/**
 * Created by yeanzhi on 16/12/5.
 */
'use strict';
import dragNode from '../lib/drag-node';
import borderFrame from '../lib/border-frame'
let kity = window.kity;
export default function (ei) {
    let startPosition,
        rect;
    ei.modules['square'] = {
        type: 'drag',
        dragStart(_startPosition) {
            startPosition = _startPosition;
            rect = new kity.Rect(0, 0, 0, 0);
            rect.setStyle({
                'stroke': ei.selectColor,
                'stroke-width': ei.selectStroke
            });
            dragNode(rect)(ei);
            rect.changeColor = function (color) {
                this.setStyle({
                    stroke: color,
                    'stroke-width': ei.selectStroke
                })
            };
            rect.changeStroke = function (stroke) {
                this.setStyle({
                    'stroke-width': stroke,
                    'stroke': ei.selectColor
                })
            };
            borderFrame(rect, ei,false);
            rect.addFrame();
            rect.resize = function (currentPosition, startPosition) {
                let translate = this.transform.translate || [0,0];
                startPosition = {
                    x: startPosition.x - translate[0],
                    y: startPosition.y - translate[1]
                };
                currentPosition = {
                    x: currentPosition.x - translate[0],
                    y: currentPosition.y - translate[1]
                };
                let view = {
                    width: currentPosition.x - startPosition.x,
                    height: currentPosition.y - startPosition.y
                };
                this.borderFrameDragMove(currentPosition,startPosition);
                this.pipe(function () {
                    this.setSize(Math.abs(view.width), Math.abs(view.height));
                    this.setPosition(Math.min(currentPosition.x, startPosition.x), Math.min(currentPosition.y, startPosition.y));
                })
            };
            rect.getLeftBottomPosition = function () {
                let leftTop = this.getPosition();
                let translate = this.transform.translate || [0,0];
                return {
                    x: leftTop.x + translate[0],
                    y: leftTop.y + this.getHeight() + translate[1]
                }
            };
            rect.getLeftTopPosition = function () {
                let translate = this.transform.translate || [0,0];
                return {
                    x:this.getPosition().x + translate[0],
                    y:this.getPosition().y + translate[1]
                } ;
            };
            rect.getRightBottomPosition = function () {
                let leftTop = this.getPosition();
                let translate = this.transform.translate || [0,0];
                return {
                    x: leftTop.x + this.getWidth() + translate[0],
                    y: leftTop.y + this.getHeight() + translate[1]
                }
            };
            rect.getRightTopPosition = function () {
                let leftTop = this.getPosition();
                let translate = this.transform.translate || [0,0];
                return {
                    x: leftTop.x + this.getWidth() + translate[0],
                    y: leftTop.y + translate[1]
                }
            }

        },
        dragMove(currentPosition) {
            //let currentPosition = e.getPosition();
            rect.resize(currentPosition, startPosition);
        },
        dragEnd(e) {
            ei.addSelectNode(rect);
        }
    }
}
