/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
import event from '../lib/event.js';
export default function(ei) {
    let startPosition;
    ei.modules['drag'] = {
        dragStart(_startPosition) {
            startPosition = _startPosition;
        },
        dragMove(lastPosition) {
            if(startPosition) {
                let {width,height} = ei.originalImage;
                let viewBox = ei.paper.getViewBox();
                let newX = viewBox.x - lastPosition.x + startPosition.x;
                let newY = viewBox.y - lastPosition.y + startPosition.y;
                if (newX >= 0 && newX <= (width - viewBox.width)) {
                    viewBox.x = newX;
                }
                if (newY >= 0 && newY <= (height - viewBox.height)) {
                    viewBox.y = newY;
                }
                event.emit('paperOnDrag',viewBox);
                ei.execCommand('changeViewBox',viewBox);
                //ei.paper.setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
            }
        },
        dragEnd(e) {
            startPosition = void (0);
        }
    }
}
