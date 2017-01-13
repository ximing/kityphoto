/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
const $ = require('jquery');
const touchable = !!window.ontouchstart;
const DRAG_START_EVENT = touchable ? 'touchstart' : 'mousedown',
    DRAG_MOVE_EVENT = touchable ? 'touchmove' : 'mousemove',
    DRAG_END_EVENT = touchable ? 'touchend' : 'mouseup';
export default function () {
    let that = this,
        isMove = false,
        startPosition,
        needRemove = false;
    let moveDrag = this.moveDrag = function (e) {
        if (isMove) {
            if (that.dragNode) {
                that.dragNode.dragMove(e);
            } else if (that.selectNode) {
                if (that.selectNode.resize) {
                    that.selectNode.resize(that.coordinateConvert(e.getPosition()), that.selectNode.startPosition);
                }
            } else if (that.modules[that.selectOpver] && that.modules[that.selectOpver].dragMove) {
                let position = e.getPosition();
                that.modules[that.selectOpver].dragMove(that.coordinateConvert(position));
            }
        } else if (!!startPosition && (Math.abs(e.getPosition().x - startPosition.x) > 3 || Math.abs(e.getPosition().y - startPosition.y) > 3)) {
            isMove = true;
            if (that.dragNode) {
                that.dragNode.dragStart(e);
            } else if (that.selectNode) {
            } else if (that.modules[that.selectOpver] && that.modules[that.selectOpver].dragStart) {
                let position = e.getPosition();
                that.modules[that.selectOpver].dragStart(that.coordinateConvert(position));
            }
        }
    };

    let startDrag = this.startDrag = function (e) {
        startPosition = that.coordinateConvert(e.getPosition());
        if (that.modules[that.selectOpver] && that.modules[that.selectOpver].click) {
            isMove = false;
            startPosition = void (0);
            needRemove = false;
            that.modules[that.selectOpver].click(e);
            return;
        }
        that.paper.addEventListener(DRAG_MOVE_EVENT, moveDrag);
        needRemove = true;
    };
    let endDrag = this.endDrag = function (e) {
        if (isMove) {
            isMove = false;
            if (that.dragNode) {
                that.dragNode.dragEnd(e);
            } else if (that.selectNode) {
                isMove = false;
            } else if (that.modules[that.selectOpver] && that.modules[that.selectOpver].dragEnd) {
                that.modules[that.selectOpver].dragEnd(e);
            }
        }else if($(e.target).is('image')) {
            //点击图片区域  取消选择
            that.clearSelectNode();
            that.clearDragNode();
        }
        if(needRemove) {
            that.paper.removeEventListener(DRAG_MOVE_EVENT, moveDrag);
            needRemove = false;
        }
    };
    this.DRAG_START_EVENT = DRAG_START_EVENT;
    this.DRAG_MOVE_EVENT = DRAG_MOVE_EVENT;
    this.DRAG_END_EVENT = DRAG_END_EVENT;
    this.paper.addEventListener(this.DRAG_START_EVENT, startDrag);
  // this.paper.addEventListener(DRAG_END_EVENT, endDrag);
    $(window).on(this.DRAG_END_EVENT, endDrag);
}
