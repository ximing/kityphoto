/**
 * Created by yeanzhi on 16/12/29.
 */
'use strict';
import dragNode from '../lib/drag-node';
let kity = window.kity;


export default function (ei) {
    let startPosition,
        context,
        canvas;
    ei.modules['clip'] = {
        dragStart(_startPosition) {
            startPosition = _startPosition;
            ei.exportCurrentCanvas().then(ctx=>context=ctx);
            //context = canvas.getContext('2d');
        },
        dragMove(currentPosition) {
            if(context){
                let mosaicScope =  ei.selectStroke * 3;
                let rect = new kity.Rect(mosaicScope, mosaicScope, currentPosition.x, currentPosition.y);
                let imageData = context.getImageData(currentPosition.x, currentPosition.y, mosaicScope, mosaicScope);
                let rgba = [0, 0, 0, 0];
                let length = imageData.data.length / 4;
                for (let i = 0; i < length; i++) {
                    rgba[0] += imageData.data[i * 4];
                    rgba[1] += imageData.data[i * 4 + 1];
                    rgba[2] += imageData.data[i * 4 + 2];
                    rgba[3] += imageData.data[i * 4 + 3];
                }
                rect.fill(new kity.Color(`rgba(${rgba[0]/length},${rgba[1]/length} ,${rgba[2]/length},${rgba[3]/length})`));
                ei.execCommand('addShape', rect);
            }
        },
        dragEnd(e) {
        }
    }
}
