/**
 * Created by yeanzhi on 16/12/6.
 */
'use strict';
/*
* 选中node相关功能
* */
import event from './lib/event';

export default function () {
    this.clearSelectNode = () => {
        if(this.selectNode && this.selectNode.removeFrame) {
            this.selectNode.removeFrame()
        }
        this.selectNode = null;
        event.emit('clearSelectNode')
    };

    this.addSelectNode = (node) => {
        this.clearSelectNode();
        this.selectNode = node;
        if(node.addFrame) {
            node.addFrame();
        }
        event.emit('addSelectNode',node);
    }
}
