/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event.js';

export default function (ei) {
    let colorCommand = new Command(ei);
    colorCommand.execute = function (stroke) {
        ei.changeStroke(stroke);
        event.emit('contentChange');
        return stroke;
    };
    colorCommand.queryState = function () {

    };
    colorCommand.queryEnabled = function () {

    };
    ei.commands['stroke'] = colorCommand;
}

