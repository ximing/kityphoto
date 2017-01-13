/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
let kity = window.kity;
import dragNode from '../lib/drag-node';
import borderFrame from '../lib/border-frame'
export default function (ei) {
    let startPosition,
        ellipse;
    ei.modules['circle'] = {
        dragStart(_startPosition) {
            startPosition = _startPosition;
            ellipse = new kity.Ellipse(0, 0, 0, 0);
            ellipse.setStyle({
                'stroke': ei.selectColor,
                'stroke-width': ei.selectStroke
            });
            dragNode(ellipse)(ei);
            ellipse.changeColor = function (color) {
                this.setStyle({
                    stroke: color,
                    'stroke-width': ei.selectStroke
                })
            };
            ellipse.changeStroke = function (stroke) {
                this.setStyle({
                    'stroke-width': stroke,
                    'stroke': ei.selectColor
                })
            };

            borderFrame(ellipse, ei);
            ellipse.addFrame();
      //ei.addSelectNode(ellipse);
      //实现这套规则来进行边框拖拽控制大小
            ellipse.resize = function (currentPosition, startPosition) {
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
                    width: Math.abs((currentPosition.x - startPosition.x) / 2),
                    height: Math.abs((currentPosition.y - startPosition.y) / 2)
                };

                this.borderFrameDragMove(currentPosition, startPosition);

                this.pipe(function () {
                    this.setCenter(Math.min(currentPosition.x, startPosition.x) + view.width,
            Math.min(currentPosition.y, startPosition.y) + view.height);
                    this.setRadius(view.width, view.height);
                });
            };
            ellipse.getLeftBottomPosition = function () {
                let center = this.getCenter();
                let radius = this.getRadius();
                let translate = this.transform.translate || [0,0];
                return {
                    x: center.x - radius.x + translate[0],
                    y: center.y + radius.y + translate[1]
                }
            };
            ellipse.getLeftTopPosition = function () {
                let center = this.getCenter();
                let radius = this.getRadius();
                let translate = this.transform.translate || [0,0];
                return {
                    x: center.x - radius.x + translate[0],
                    y: center.y - radius.y + translate[1]
                }
            };
            ellipse.getRightBottomPosition = function () {
                let center = this.getCenter();
                let radius = this.getRadius();
                let translate = this.transform.translate || [0,0];
                return {
                    x: center.x + radius.x + translate[0],
                    y: center.y + radius.y + translate[1]
                }
            };
            ellipse.getRightTopPosition = function () {
                let center = this.getCenter();
                let radius = this.getRadius();
                let translate = this.transform.translate || [0,0];
                return {
                    x: center.x + radius.x + translate[0],
                    y: center.y - radius.y + translate[1]
                }
            }
        },
        dragMove(currentPosition) {
            ellipse.resize(currentPosition, startPosition);
        },
        dragEnd(e) {
            ei.addSelectNode(ellipse)
        },
        cursor() {
        }
    }
}
