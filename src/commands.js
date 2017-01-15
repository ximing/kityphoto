/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
import color from './command/color.js';
import font from './command/font.js';
import stroke from './command/stroke.js';
import addSharp from './command/add-sharp';
import removeSharp from './command/remove-sharp';
import opver from './command/opver';
import scale from './command/scale';
import viewbox from './command/viewbox';
import rotate from './command/rotate';
export default function () {
    addSharp(this);
    removeSharp(this);
    color(this);
    stroke(this);
    font(this);
    opver(this);
    scale(this);
    viewbox(this);
    rotate(this);
    this.execCommand = (command, ...args)=> {
        console.log(command,args);
        this.commands[command].execute.apply(this,args);
    }
}
