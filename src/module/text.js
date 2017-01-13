/**
 * Created by yeanzhi on 16/12/4.
 */
'use strict';
let $ = require('jquery');
let kity = window.kity;
import dragNode from '../lib/drag-node';
let mask = (left, top) => {
    return `
  <div class="kity-photo-mask">
  <input type="text" style="top:${top}px;left: ${left}px">
</div>
`
};
export default function (ei) {
    let coordinate;
    ei.modules['text'] = {
        type: 'click',
        click(e) {
            if ($(e.originEvent.target).is('image')) {
                coordinate = ei.coordinateConvert(e.getPosition());
                let $mask = $(mask(e.originEvent.clientX, e.originEvent.clientY));
                let $input = $mask.find('input');
                $('body').append($mask);
                $input[0].focus();
                $mask.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!$(e.target).is('input')) {
                        if ($input.val().trim()) {
                            let text = new kity.Text($input.val()).pipe(function () {
                                this.setX(coordinate.x);
                                this.setY(coordinate.y + ei.fontSize);
                                this.fill(new kity.Color(ei.selectColor));
                                //*100/ei.scale
                                this.setSize(`${ei.fontSize}px`);
                                this.rotate(-ei.rotate,coordinate.x,coordinate.y + ei.fontSize);
                                this.node.setAttribute('transform',`rotate(${-ei.rotate},${coordinate.x},${coordinate.y})`);
                            });

                            text.changeColor = function (color) {
                                this.fill(new kity.Color(color || ei.selectColor));
                            };
                            text.changeSize = function (stroke) {
                                this.setSize(`${stroke}px`);
                            };
                            dragNode(text)(ei);
                            ei.execCommand('addShape', text);
                        }
                        $mask.off('click');
                        $mask.remove();
                    }
                });
            }
        }
    }
}
