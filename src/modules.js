/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
import text from './module/text.js';
import draw from './module/draw';
import square from './module/square';
import drag from './module/drag';
import circle from './module/circle';
import line from './module/line';
import mosaic from './module/mosaic.js';
export default function () {
    text(this);
    draw(this);
    square(this);
    drag(this);
    circle(this);
    line(this);
    mosaic(this);
}
