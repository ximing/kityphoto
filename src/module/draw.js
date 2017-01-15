/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
import dragNode from '../lib/drag-node';
let kity = window.kity;

export default function (ei) {
    let startPosition,
        path,
        d;
    ei.modules['draw'] = {
        dragStart(_startPosition) {
            startPosition = _startPosition;
            path = new kity.Path();
            d = path.getDrawer();
            path.stroke(new kity.Pen().pipe(function () {
                this.setWidth(ei.selectStroke);
                this.setColor(ei.selectColor);
            }));
            d.moveTo(startPosition.x, startPosition.y);
            dragNode(path)(ei);
            path.changeColor = function (color) {
                this.stroke(new kity.Pen().pipe(function () {
                    this.setColor(color || ei.selectColor);
                    this.setWidth(ei.selectStroke);
                }));
            };
            path.changeStroke = function (stroke) {
                this.stroke(new kity.Pen().pipe(function () {
                    this.setWidth(stroke || ei.selectStroke);
                    this.setColor(ei.selectColor);
                }));
            };
            path.addEventListener('keydown',(e)=>{console.log(e)})
            ei.execCommand('addShape', path);
        },
        dragMove(currentPosition) {
            console.log(currentPosition);
            //let currentPosition = e.getPosition();
            d.lineTo(currentPosition.x, currentPosition.y);
        },
        dragEnd(e) {
        }
    }
}
