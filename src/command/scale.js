/**
 * Created by yeanzhi on 16/12/7.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event';

export default function (ei) {
    let scaleCommand = new Command(ei);
    scaleCommand.execute = function (scale) {
        if (scale === 0) return;
        if (scale > 0) {
            scale = Math.min(scale + ei.scale, 100);
        } else if (scale < 0) {
            scale = Math.max(scale + ei.scale, (ei.initScale || 40));
        }
        if (scale === ei.scale) return;
        let {x, y} = ei.initViewBox;
        let {height, width} = ei.paper.getViewBox();
        let newViewBoxHeight = height * ei.scale / scale,
            newViewBoxWidth = width * ei.scale / scale;
        ei.paper.setViewBox(x, y, newViewBoxWidth, newViewBoxHeight);
        ei.scale = scale;
        event.emit('changeScale', scale);
        event.emit('contentChange');
        return scale;
    };
    scaleCommand.queryState = function () {

    };
    scaleCommand.queryEnabled = function () {

    };
    ei.commands['changeScale'] = scaleCommand;
}

