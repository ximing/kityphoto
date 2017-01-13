/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
import Command from '../lib/command.js'
import event from '../lib/event.js';

export default function (ei) {
    let drawCommand = new Command(ei);

    drawCommand.execute = function (node) {
        ei.innerContainer.addShape(node);
        event.emit('contentChange');
        return node;
    };

    drawCommand.undo = function (node) {
        ei.innerContainer.removeShape(node);
    };

    drawCommand.redo = function (node) {
        ei.innerContainer.addShape(node);
        return node;
    };

    ei.commands['addShape'] = drawCommand;
}
