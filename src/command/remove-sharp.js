/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
import Command from '../lib/command.js'
import event from '../lib/event.js';

export default function(ei) {
    let removeShapeCommand = new Command(ei);

    removeShapeCommand.execute = function(node) {
        ei.opverContainer.removeShape(node);
        ei.undoManager.add(() => {
            if (!ei.opverContainer.getShapeById(node.getId())) {
                ei.opverContainer.addShape(node);
            }
        }, () => {
             if (ei.opverContainer.getShapeById(node.getId())) {
                ei.opverContainer.removeShape(node);
            }
        });
        event.emit('contentChange');
        return node;
    };
    ei.commands['removeShape'] = removeShapeCommand;
}
