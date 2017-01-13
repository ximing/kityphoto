/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
export default function () {
    this.fontSize = 25;
    this.changeFontSize = function (size) {
        if(!isNaN(Number(size))) {
            this.fontSize = size;
            if(this.selectNode) {
                this.selectNode.changeSize(this.fontSize);
            }
        }
    }
}
