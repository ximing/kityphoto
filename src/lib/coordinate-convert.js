/**
 * Created by yeanzhi on 16/12/11.
 */
'use strict';
//将坐标转换成 新坐标系下面正确的值
export default function () {
    this.coordinateConvert = (coordinate) => {
        if (this.rotate === 0) {
            return coordinate;
        } else if (this.rotate === 90) {
            return {
                x: coordinate.y,
                y: -coordinate.x
            }
        } else if (this.rotate === 180) {
            return {
                x: -coordinate.x,
                y: -coordinate.y
            }
        } else {
            return{
                x: -coordinate.y,
                y: coordinate.x
            }
        }
    }
}
