/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
export default function () {
    this.selectStroke = 8;
    this.changeStroke = function (stroke) {
        if(!isNaN(Number(stroke))) {
            this.selectStroke = Number(stroke);
            if(this.selectNode) {
                this.selectNode.changeStroke(this.selectStroke);
            }
        }
    }
}
