import $ from 'jquery'
export default class ClipShape{
    constructor(container,target){
        $(container).append(this.render());
    }
    
    render(){
        this.clipShape = $(`
            <div style="position:absolute;top:0;left:0;border:2px solid rgba(255,255,255,.5);height:200px;width:200px">
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-left-top" src='${require("../assert/images/clip/left-top.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-top-horizon" src='${require("../assert/images/clip/horizon.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-right-top" src='${require("../assert/images/clip/right-top.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-right-vertical" src='${require("../assert/images/clip/vertical.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-right-bottom" src='${require("../assert/images/clip/right-bottom.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-bottom-horizon" src='${require("../assert/images/clip/horizon.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-left-bottom" src='${require("../assert/images/clip/left-bottom.png")}'/>
                <img style="height:16px;width:16px" id="kityphoto-clip-shape-left-vertical" src='${require("../assert/images/clip/vertical.png")}'/>
            </div>
        `);
        return this.clipShape;
    }
    
    initEvent(){
        // $(document).on('resize');
        
    }
    
    
    changeSize(){
        
    }
    
    changePosition(){
        
    }
    
}