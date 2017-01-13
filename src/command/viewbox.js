/**
 * Created by yeanzhi on 16/12/8.
 */
'use strict';
import Command from '../lib/command';

export default function (ei) {
    let viewBoxCommand = new Command(ei);
    viewBoxCommand.execute = function(viewBox) {
        ei.paper.setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
        return viewBox;
    };
    viewBoxCommand.queryState = function () {

    };
    viewBoxCommand.queryEnabled = function () {

    };
    ei.commands['changeViewBox'] = viewBoxCommand;
}

