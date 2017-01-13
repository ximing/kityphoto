/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
const $ = require('jquery');
import event from './lib/event';

let navigator = (ei) => {
    return `
  <div class="ei-navigator">
    <div class="ei-navigator-header">图片缩放</div>
      <div class="ei-navigator-body">
      <span id="ei-scale">${ei.scale}%</span>
      <i class="iconfont icon-jianhao" />
      <i class="iconfont icon-jindu3" />
      <p class="zoom-pan"></p>
      <i class="iconfont icon-jiahao" />
      <span>原大</span>
    </div>
</div>
`
};
// let listenerStoreChange = function (scale) {
//     this.$navigator.find('#ei-scale').html(`${Math.floor(scale)}%`);
// };
export default function () {
    $('.ei-navigator').remove();
    this.$navigator = $(navigator(this));
    this.$container.append(this.$navigator);
    this.$navigator.on('click', '.icon-jiahao', () => {
        if(this.scale >= 100) {
            return;
        }
        this.execCommand('changeScale', this.scale + 10);
    });
    event.on('changeScale', (scale) => {
        this.$navigator.find('#ei-scale').html(`${Math.floor(scale)}%`);
    });
    this.$navigator.on('click', '.icon-jianhao', () => {
        if(this.scale <= 40) {
            return;
        }
        this.execCommand('changeScale', this.scale - 10);
    });

}
