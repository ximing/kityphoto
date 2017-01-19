/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
import $ from 'jquery';
export default class ClipOpverPanel{
    constructor(container,onOk,onCLose){
        this.x = 0;
        this.y = 0;
        this.shown = false;
        this.$panel = this.render();
        $(container).append(this.$panel);
        this.hide();
        this.bindEvent(onOk,onCLose);
    }
    
    destory(){
        this.offEvent();
        this.$panel.remove();
        this.$panel = null;
    }
    
    setPosition(x,y){
        this.$panel.css('left',x);
        this.$panel.css('top',y);
    }
    
    hide(){
        this.$panel.hide()
    }
    
    show(){
        this.$panel.show();
    }
    
    bindEvent(onOk,onCLose){
        this.$panel.on('click','.clip-panel-ok',function(){
            onOk()
        });
        this.$panel.on('click','.clip-panel-close',function(){
            onCLose()
        });
    }
    
    offEvent(){
        this.$panel.off('click');
    }
    
    render(){
        return $(`
        <div style="position:fixed;top:-10000;left:0;background: #FFFFFF;box-shadow: 0 2px 8px 0 rgba(0,0,0,0.24);border-radius: 2px;height:76px;width:32px">
            <img class="clip-panel-ok" src="${require("../assert/gou.svg")}" />
            <img class="clip-panel-close" src="${require("../assert/close.svg")}" />
        </div>
        `)
    }
}