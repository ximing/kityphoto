/**
 * Created by yeanzhi on 16/12/10.
 */
'use strict';
import Command from '../lib/command';
import event from '../lib/event';

export default function (ei) {
    let rotateCommand = new Command(ei);
    rotateCommand.execute = function (rotate) {
        let minus = rotate>=0;
        rotate = (ei.rotate + 360 + rotate) % 360;
        let {width, height} = this.getContainerViewBox();
        let originHeight = ei.originalImage.height,
            originWidth = ei.originalImage.width;
        let scale = 1;

        if (rotate === 90 || rotate === 270) {
            if (originHeight > width) {
                scale = width / originHeight;
            }
            if (originWidth > height) {
                let _scale = height / originWidth;
                if (_scale < scale) {
                    scale = _scale;
                }
            }
            //scale = Math.floor(scale * 10) / 10;
            let imgWidth = originHeight * scale;
            let imgHeight = originWidth * scale;
            ei.paper.setWidth(imgWidth);
            ei.paper.setHeight(imgHeight);
            console.log('===>',rotate,ei.rotate);
            if(minus){
                if(rotate===90){
                    //prev opver is 0
                    ei.innerContainer.rotate(rotate);
                    //ei.innerContainer.translate(originHeight, 0);
                    //ei.translate = [originHeight,0];
                    let viewBox = {
                        x:-originHeight,y:0,width:originHeight,height:originWidth
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }else{
                    //current 270 prev opver is 180
                    ei.innerContainer.rotate(-180);
                    ei.innerContainer.rotate(rotate);
                    let viewBox = {
                        x:0,y:-originWidth,width:originHeight,height:originWidth
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }
            }else{
                if(rotate===90){
                    //current 90 prev opver is 180
                    ei.innerContainer.rotate(-180);
                    ei.innerContainer.rotate(rotate);
                    let viewBox = {
                        x:-originHeight,y:0,width:originHeight,height:originWidth
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }else{
                    //current 270 prev opver is 0
                    ei.innerContainer.rotate(rotate);
                    let viewBox = {
                        x:0,y:-originWidth,width:originHeight,height:originWidth
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }
            }

        } else {
            if (originWidth > width) {
                scale = width / originWidth;
            }
            if (originHeight > height) {
                let _scale = height / originHeight;
                if (_scale < scale) {
                    scale = _scale;
                }
            }
            scale = Math.floor(scale * 10) / 10;
            let imgWidth = originWidth * scale;
            let imgHeight = originHeight * scale;
            ei.paper.setWidth(imgWidth);
            ei.paper.setHeight(imgHeight);
            if(minus){
                if(rotate===0){
                    //prev opver is 270
                    ei.innerContainer.rotate(-270);
                    ei.translate = [0,0];
                    let viewBox = {
                        x:0,y:0,width:originWidth,height:originHeight
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }else{
                    //current is 180,prev opver is 90
                    ei.innerContainer.rotate(-90);
                    ei.innerContainer.rotate(rotate);
                    ei.translate = [originWidth, originHeight];
                    let viewBox = {
                        x:-originWidth,y:-originHeight,width:originWidth,height:originHeight
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }
            }else{
                if(rotate===0){
                    //prev opver is 90
                    ei.innerContainer.rotate(-90);
                    ei.innerContainer.rotate(rotate);
                    ei.translate = [originWidth, originHeight];
                    let viewBox = {
                        x:0,y:0,width:originWidth,height:originHeight
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }else{
                    //current is 180,prev opver is 270
                    ei.innerContainer.rotate(-270);
                    ei.innerContainer.rotate(rotate);
                    ei.translate = [0,0];
                    let viewBox = {
                        x:-originWidth,y:-originHeight,width:originWidth,height:originHeight
                    };
                    ei.execCommand('changeViewBox',viewBox);
                    ei.initViewBox = viewBox;
                }
            }

        }
        ei.rotate = rotate;
        event.emit('changeRotate', rotate);
        event.emit('contentChange');
        return rotate;
    };
    rotateCommand.queryState = function () {

    };
    rotateCommand.queryEnabled = function () {

    };
    ei.commands['changeRotate'] = rotateCommand;
}
