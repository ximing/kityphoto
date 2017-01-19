/**
 * Created by yeanzhi on 16/12/4.
 */
import event from './lib/event';
import ClicpOpverPanel from './lib/clip-opver-panel.js';

export default function(){
    
    this.addClipMark = () => {
        if(this.container){
            event.emit('error',{code:50000,msg:'编辑状态下不能剪切，剪切请先复原图片'});
        }
    }
    
    this.removeClipMark = () => {
        
    }
    
    this.applyClipMark = ()=>{
        
    }
    
    this.clicpOpverPanel = new ClicpOpverPanel(this.$container[0],()=>{
        if(this.getClipRange){
            
        }
    },()=>{
        if(this.getClipRange){
            
        }
    });
    
}