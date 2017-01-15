/**
 * Created by yeanzhi on 16/12/5.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event.js';

export default function(ei) {
    let colorCommand = new Command(ei);
    colorCommand.execute = function(color) {
        console.log(ei.selectNode);
        if (ei.selectNode) {
            ei.selectNode.changeColor(color);
            let node = Object.assign({},ei.selectNode);
            let currentColor = ei.selectColor;
            ei.undoManager.add(() => {
                node.changeColor(currentColor);
            }, () => {
                node.changeColor(color);
            });
            ei.selectColor = color;
            event.emit('contentChange');
        }
        return color;
    };
    colorCommand.queryState = function() {

    };
    colorCommand.queryEnabled = function() {

    };
    ei.commands['color'] = colorCommand;
}
