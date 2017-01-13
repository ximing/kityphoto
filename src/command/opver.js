/**
 * Created by yeanzhi on 16/12/7.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event';

export default function (ei) {
    let opverCommand = new Command(ei);
    opverCommand.execute = function(moduleName) {
        if(ei.modules[moduleName]) {
            if(ei.selectOpver === moduleName) {
                ei.selectOpver = 'drag';
                ei.clearSelectNode();
                ei.clearDragNode();
                event.emit('cancelOpver');
            }else{
                ei.selectOpver = moduleName;
                ei.clearSelectNode();
                ei.clearDragNode();
                if(ei.modules[moduleName].cursor) {
                    ei.modules[moduleName].cursor();
                }
                event.emit('changeOpver',moduleName);
            }
        }
    };
    opverCommand.queryState = function () {

    };
    opverCommand.queryEnabled = function () {

    };
    ei.commands['changeOpver'] = opverCommand;
}

