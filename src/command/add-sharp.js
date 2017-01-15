/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
import Command from '../lib/command.js'
import event from '../lib/event.js';
import $ from 'jquery';
export default function(ei) {
    let drawCommand = new Command(ei);

    drawCommand.execute = function(node) {
        ei.opverContainer.addShape(node);
        ei.undoManager.add(() => {
            if (ei.getShape(ei.opverContainer, node).length > 0) {
                ei.opverContainer.removeShape(node);
            }
        }, () => {
            if (ei.getShape(ei.opverContainer, node).length === 0) {
                ei.opverContainer.addShape(node);
            }
        });
        event.emit('contentChange');
        return node;
    };
    ei.commands['addShape'] = drawCommand;
}
