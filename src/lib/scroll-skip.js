/**
 * Created by yeanzhi on 16/12/10.
 */
'use strict';
export default function (delta) {
    if(delta===0){
        return 0;
    }
    let isNegative = delta < 0;
    delta = Math.abs(delta);
    if (delta <= 2) {
        delta = 1;
    } else if (delta > 2 && delta < 5) {
        delta = 3;
    } else if (delta >= 5 && delta < 10) {
        delta = 7;
    }else if (delta >= 10 && delta < 50) {
        delta = 10;
    } else if (delta >= 50 && delta < 100) {
        delta = 15;
    } else {
        delta = 20;
    }
    return isNegative ? -delta : delta;
}
