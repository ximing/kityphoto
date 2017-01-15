/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event.js';

export default function(ei) {
    let colorCommand = new Command(ei);
    colorCommand.execute = function(size) {
        if (!isNaN(Number(size))) {
            if (ei.selectNode) {
                ei.selectNode.changeSize(size);
            }
            event.emit('contentChange');
            let node = Object.assign({}, ei.selectNode);
            let currentFont = ei.fontSize;
            ei.undoManager.add(() => {
                node.changeSize(currentFont);
            }, () => {
                node.changeSize(size);
            });
            ei.fontSize = size;
        }
        return size;
    };
    colorCommand.queryState = function() {

    };
    colorCommand.queryEnabled = function() {

    };
    ei.commands['fontSize'] = colorCommand;
}
