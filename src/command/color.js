/**
 * Created by yeanzhi on 16/12/5.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event.js';

export default function (ei) {
    let colorCommand = new Command(ei);
    colorCommand.execute = function(color) {
        ei.changeColor(color);
        event.emit('contentChange');
        return color;
    };
    colorCommand.queryState = function () {

    };
    colorCommand.queryEnabled = function () {

    };
    ei.commands['color'] = colorCommand;
}

