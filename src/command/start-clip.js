/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event.js';
import ClipShape from '../lib/clip-shape';
const kity = window.kity;
export default function(ei) {
    let startClipCommand = new Command(ei);
    startClipCommand.execute = function() {
        let {
            width,
            height
        } = ei.paper.getViewBox();
        let scale = 100 / ei.scale;
        let dragPointSize = scale * 16;
        let clipShape = new kity.Group().pipe(function() {
            this.rect = new kity.Rect(width, height, 0, 0);
            this.rect.setStyle({
                'stroke': 'rgba(255,255,255,0.5)',
                'stroke-width': 2 * scale
            });
            this.addShape(this.rect);
            let leftTop = new kity.Image(`${require("../assert/images/clip/left-top.png")}`, dragPointSize, dragPointSize).pipe(function() {
                //this.translate(0, 0)
                this.setX(0)
                this.setY(0)
            });
            // let topHorizon = new kity.Image(`${require("../assert/images/clip/horizon.png")}`, 16 * scale, 16 * scale);
            let rightTop = new kity.Image(`${require("../assert/images/clip/right-top.png")}`, dragPointSize, dragPointSize).pipe(function() {
                // this.translate(width - dragPointSize, 0)
                this.setX(width - dragPointSize)
                this.setY(0)
            });
            // let rightVertical = new kity.Image(`${require("../assert/images/clip/vertical.png")}`, 16 * scale, 16 * scale);
            let rightBottom = new kity.Image(`${require("../assert/images/clip/right-bottom.png")}`, dragPointSize, dragPointSize).pipe(function() {
                // this.translate(width - dragPointSize, height - dragPointSize)
                this.setX(width - dragPointSize);
                this.setY(height - dragPointSize);
            });
            // let bottomHorizon = new kity.Image(`${require("../assert/images/clip/horizon.png")}`, 16 * scale, 16 * scale);
            let leftBottom = new kity.Image(`${require("../assert/images/clip/left-bottom.png")}`, dragPointSize, dragPointSize).pipe(function() {
                // this.translate(0, height - dragPointSize)
                this.setX(0);
                this.setY(height - dragPointSize);
            });
            // let leftVertical = new kity.Image(`${require("../assert/images/clip/vertical.png")}`, 16 * scale, 16 * scale);
            leftTop.on('mousedown', function(e) {
                ei.clearDragNode();
                clipShape.startPosition = clipShape.getRightBottomPosition();
            });
            rightTop.on('mousedown', function(e) {
                ei.clearDragNode();
                clipShape.startPosition = clipShape.getLeftBottomPosition();
            });
            rightBottom.on('mousedown', function(e) {
                ei.clearDragNode();
                clipShape.startPosition = clipShape.getLeftTopPosition();
            });
            leftBottom.on('mousedown', function(e) {
                ei.clearDragNode();
                clipShape.startPosition = clipShape.getRightTopPosition();
            });
            this.addShape(leftTop);
            // this.addShape(topHorizon);
            this.addShape(rightTop);
            // this.addShape(rightVertical);
            this.addShape(rightBottom);
            // this.addShape(bottomHorizon);
            this.addShape(leftBottom);
            // this.addShape(leftVertical);
            // this.opverPanel = new kity.Rect(76 * scale, 32*scale, 0, 0,2*scale).pipe(function () {
            //     this.fill(new kity.Color('#FFFFFF'));
            //     this.setStyle({
            //     'box-shadow': '0 2px 8px 0 rgba(255,255,255,0.24)'
            //     });
            // });
            // this.addShape(this.opverPanel)

            this.borderFrameDragMove = function(currentPosition, startPosition) {
                let view = {
                    width: currentPosition.x - startPosition.x,
                    height: currentPosition.y - startPosition.y
                };
                let x = 0,
                    y = 0;
                if (view.width < 0) {
                    x = currentPosition.x;
                }
                else {
                    x = startPosition.x;
                }
                if (view.height < 0) {
                    y = currentPosition.y;
                }
                else {
                    y = startPosition.y;
                }


                //这里要保证四个方向的按钮，按照名称在自己的位置上面，不管用户是从什么方向滑动
                leftTop.pipe(function() {
                    this.setX(Math.min(currentPosition.x, startPosition.x));
                    this.setY(Math.min(currentPosition.y, startPosition.y));
                    // this.translate(
                    //     Math.min(currentPosition.x, startPosition.x),
                    //     Math.min(currentPosition.y, startPosition.y))
                })

                rightTop.pipe(function() {
                    this.setX(Math.max(currentPosition.x, startPosition.x) - dragPointSize)
                    this.setY(Math.min(currentPosition.y, startPosition.y))
                        // this.translate(
                        //     Math.max(currentPosition.x, startPosition.x) - dragPointSize,
                        //     Math.min(currentPosition.y, startPosition.y))
                })

                rightBottom.pipe(function() {
                    this.setX(Math.max(currentPosition.x, startPosition.x) - dragPointSize)
                    this.setY(Math.max(currentPosition.y, startPosition.y) - dragPointSize)
                        // this.translate(
                        //     Math.max(currentPosition.x, startPosition.x) - dragPointSize,
                        //     Math.max(currentPosition.y, startPosition.y)- dragPointSize)
                })

                leftBottom.pipe(function() {
                    this.setX(Math.min(currentPosition.x, startPosition.x))
                    this.setY(Math.max(currentPosition.y, startPosition.y) - dragPointSize)
                        // this.translate(
                        //     Math.min(currentPosition.x, startPosition.x),
                        //     Math.max(currentPosition.y, startPosition.y)- dragPointSize)
                })

            }
        })
        clipShape.getLeftBottomPosition = function() {
            let leftTop = this.rect.getPosition();
            let translate = this.rect.transform.translate || [0, 0];
            return {
                x: leftTop.x + translate[0],
                y: leftTop.y + this.rect.getHeight() + translate[1]
            }
        }
        clipShape.getLeftTopPosition = function() {
            let translate = this.rect.transform.translate || [0, 0];
            return {
                x: this.rect.getPosition().x + translate[0],
                y: this.rect.getPosition().y + translate[1]
            };
        }
        clipShape.getRightBottomPosition = function() {
            let leftTop = this.rect.getPosition();
            let translate = this.rect.transform.translate || [0, 0];
            return {
                x: leftTop.x + this.rect.getWidth() + translate[0],
                y: leftTop.y + this.rect.getHeight() + translate[1]
            }
        }
        clipShape.getRightTopPosition = function() {
            let leftTop = this.rect.getPosition();
            let translate = this.rect.transform.translate || [0, 0];
            return {
                x: leftTop.x + this.rect.getWidth() + translate[0],
                y: leftTop.y + translate[1]
            }
        }
        clipShape.resize = function(currentPosition, startPosition) {
            let translate = this.rect.transform.translate || [0, 0];
            this.startPosition = startPosition = {
                x: startPosition.x - translate[0],
                y: startPosition.y - translate[1]
            };
            this.currentPosition = currentPosition = {
                x: currentPosition.x - translate[0],
                y: currentPosition.y - translate[1]
            };
            //console.log(currentPosition, startPosition, this);

            let view = this.clientRect = {
                width: Math.abs(currentPosition.x - startPosition.x),
                height: Math.abs(currentPosition.y - startPosition.y)
            };
            this.borderFrameDragMove(currentPosition, startPosition);
            this.rect.pipe(function() {
                clipShape.rect.setSize(view.width), view.height;
                clipShape.rect.setPosition(Math.min(currentPosition.x, startPosition.x), Math.min(currentPosition.y, startPosition.y));
            });
        };
        ei.clipBorderShape = clipShape;
        ei.innerContainer.addShape(clipShape);
        ei.getClipRange = function () {
            return {
                x:Math.min(this.startPosition.x,this.currentPosition.x),
                y:Math.min(this.startPosition.y,this.currentPosition.y),
                width:clientRect.width,
                height:clientRect.height
            }
        }
        // console.log('startClip', rect);
        //this.clipBorderShape = new ClipShape(this.$container[0]);
    };
    ei.commands['startClip'] = startClipCommand;
}
