/**
 * Created by yeanzhi on 16/12/2.
 */
'use strict';
//创建后的节点，用来移动的
export default function (node,stopPropagation) {
    return function (ei) {
        let startPosition,
            isMove = false,
            translate = {x:0,y:0};
        node.dragStart = function (e) {
            startPosition = ei.coordinateConvert(e.getPosition());
            isMove = true;
            if(node.transform.translate) {
                translate = {
                    x:node.transform.translate[0],
                    y:node.transform.translate[1]
                }
            }
        };
        node.dragMove = function (e) {
            if(isMove && startPosition) {
                let currentPosition = ei.coordinateConvert(e.getPosition());
                let bx = currentPosition.x - startPosition.x + translate.x,
                    by = currentPosition.y - startPosition.y + translate.y
                node.setTranslate(bx,by);
                if(node.borderFrameTranslate) {
                    node.borderFrameTranslate(bx,by)
                }
            }
        };
        node.dragEnd = function (e) {
            if(isMove) {
                isMove = false;
                startPosition = void (0);
                translate = {x:0,y:0};
                ei.clearDragNode();
            }
        };
        node.on('mousedown',function(e) {
      // if(stopPropagation){
      //   e.stopPropagation();
      //   e.preventDefault();
      //   e.originEvent.stopPropagation();
      //   e.originEvent.preventDefault();
      // }
            ei.addDragNode(node);
            ei.addSelectNode(node);
        });
    // node.on('mouseup',function(e){
    //   // e.stopPropagation();
    //   // e.preventDefault();
    //   // e.originEvent.stopPropagation();
    //   // e.originEvent.preventDefault();
    //   ei.clearSelectNode();
    // });
    }
}
