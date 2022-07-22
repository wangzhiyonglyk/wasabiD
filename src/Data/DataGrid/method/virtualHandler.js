/**
 * create by wangzhiyong 
 * date:2021-12-05
 * desc：增加处理虚拟列表的功能
 */
import func from "../../../libs/func";
import config from "../config"
export default {
    /**
     * 初始化虚拟列表参数
     */
    initVirtual() {
        this.container = document.getElementById(this.state.containerid);
        this.container.scrollTop = 0;//重置
        this.table = document.getElementById(this.state.realTableId);
        let topReduce = document.getElementById(this.state.fixTableId)?.getBoundingClientRect().height;//表头高度 
        //设置表体容器的高,保证出现滚动条，容器本身是不能设置overflow-y，从而保存与tree结合的时候，本身没有滚动条
        let visibleHeight = Math.ceil(document.getElementById(this.state.containerid).clientHeight) - topReduce;//表体可见高度 
        let visibleCount = Math.ceil(visibleHeight / config.rowDefaultHeight);


        //设置初始化配置信息
        this.virtualConfig = {
            topReduce: topReduce,//需要减去的高度
            aboveCount: 0,//上面预留数，用于计算滚动位置
            visibleCount: visibleCount,//可见数
            //初始化列表位置，为了调整高度，及分隔线位置
            positions: this.state?.data.map((item, index) => {
                return {
                    index: index,
                    height: config.rowDefaultHeight,//当前行的高度，后期会动态调整,
                    top: index * config.rowDefaultHeight,
                    bottom: (index + 1) * config.rowDefaultHeight
                }
            })
        }
        //可见数据
        this.scrollShowVisibleData(0, this.virtualConfig.visibleCount);

    },
    /**
   * 监听滚动事件,防止白屏现象
   * @param {*} event 
   */
    onVirtualScroll(event) {
        try {
            if (this.state.initVirtualConfig !== null) {

                let scrollTop = this.container.scrollTop;
                let startIndex = this.binarySearch(this.virtualConfig.positions, scrollTop);
                let endIndex = startIndex + config.bufferScale * this.virtualConfig.visibleCount;
                this.scrollShowVisibleData(startIndex, endIndex)

            }

        }
        catch (e) {
            console.log("virtual error", e)
        }

    },
    /***
     * 二分法查找
     */
    binarySearch(list, value) {
        let start = 0;
        let end = list.length - 1;
        let tempIndex = null;
        while (start <= end) {
            let midIndex = parseInt((start + end) / 2);
            let midValue = list[midIndex].bottom;
            if (midValue === value) {
                return midIndex + 1;
            } else if (midValue < value) {
                start = midIndex + 1;
            } else if (midValue > value) {
                if (tempIndex === null || tempIndex > midIndex) {
                    tempIndex = midIndex;
                }
                end = end - 1;
            }
        }
        return tempIndex;
    },
    /**
  * 渲染当前可见数据
  * @param {*} startIndex 可见区数据的开始下标
  * @param {*} endIndex 可见区数据的结束下标
  */
    scrollShowVisibleData(startIndex, endIndex) {
        try {
            if (this.virtualConfig.startIndex !== startIndex) {
                //如果下标与上次不同，才渲染，记住，减少滚动渲染次数
                this.virtualConfig.startIndex = startIndex;
                let startOffset;
                if (startIndex >= 1) {
                    //减去上部预留的高度
                    let size = this.virtualConfig.positions[startIndex].top - (this.virtualConfig.positions[startIndex - this.virtualConfig.aboveCount] ? this.virtualConfig.positions[startIndex - this.virtualConfig.aboveCount].top : 0);
                    startOffset = this.virtualConfig.positions[startIndex].top - size;
                } else {
                    startOffset = 0;
                }

                this.table.style.transform = `translate3d(0,${this.virtualConfig.topReduce + startOffset}px,0)`;

                //当前切割的数据开始下标
                let sliceBeginIndex = startIndex - config.bufferScale * this.virtualConfig.visibleCount;
                if (sliceBeginIndex > 0) {
                    //如果大于0，说明已经翻页了
                    this.virtualConfig.aboveCount = config.bufferScale * this.virtualConfig.visibleCount;
                }
                sliceBeginIndex = sliceBeginIndex < 0 ? 0 : sliceBeginIndex;
                // //当前切割的数据结束下标

                let sliceEndIndex = endIndex + config.bufferScale * this.virtualConfig.visibleCount;
                let visibleData = this.state.data.slice(sliceBeginIndex, sliceEndIndex);
                visibleData = visibleData.map((item, index) => {
                    item._orderIndex = startIndex + index
                    return item;
                })
                this.adjust = true;//需要调整宽与高，但不是状态值

                this.setState({
                    visibleData: visibleData,
                    initVirtualConfig: false
                })
            }

        }
        catch (e) {
            console.log("scrollShowVisibleData error", e)
        }

    },
    /***********************以下用于调整虚拟列表相关项与表格宽度*****************/
    /**
     * 调整虚拟列表
     */
    adjustvirtual() {
        //设置总高度
        try {
            this.adjust = false;
            this.adjustItemHeight();//调整行高
            this.adjustColumnWidth();//调整宽度

        }
        catch (e) {

        }
        finally {

        }


    },


    /**
     * 渲染后调整行高
     */
    adjustItemHeight() {
        try {
            if (this.virtualConfig && this.virtualConfig.positions) {
                let tr = this.table.children[1]?.children;
                if (tr && tr.length > 0) {
                    for (let i = 0; i < tr.length; i++) {
                        let rowIndex = tr[i].getAttribute("data-rowindex") * 1;
                        let newHeight = tr[i].getBoundingClientRect().height;
                        let oldHeight = this.virtualConfig.positions[rowIndex].height;
                        let diffHeight = newHeight - oldHeight;
                        if (diffHeight !== 0) {
                            //有差异，调整
                            this.virtualConfig.positions[rowIndex].height = newHeight;
                            this.virtualConfig.positions[rowIndex].bottom += (diffHeight);
                            for (let k = rowIndex + 1; k < this.virtualConfig.positions.length; k++) {
                                this.virtualConfig.positions[k].top = this.virtualConfig.positions[k - 1].bottom;
                                this.virtualConfig.positions[k].bottom += (diffHeight);
                            }
                        }

                    }
                }
                //调整行高
                let heightDiv = document.getElementById(this.state.containerid).querySelector(".wasabi-virtual-height");
                heightDiv.style.height = this.virtualConfig.positions[this.virtualConfig.positions.length - 1].bottom + "px";

            }

        }
        catch (e) {

        }


    },


    /**
   * 调整每一列的宽度,
   * 1.方便后期拖动与固定列的效果
   * 2.实现表格紧凑
   */
    adjustColumnWidth() {
        try {
            if (!this.virtualConfig && !(document.getElementById(this.state.realTableId).style.transform)) {//没有虚拟列表的时候，也要设置一下表体的上部的位置
                let topReduce = document.getElementById(this.state.fixTableId)?.getBoundingClientRect().height;//表头高度 
                document.getElementById(this.state.realTableId).style.transform = `translate3d(0,${topReduce}px,0)`;
            }

            let columnIndex = 0;//列下标
            if (this.props.detailAble) { columnIndex++; }
            if (this.props.rowNumber) { columnIndex++; }
            if (this.props.selectAble) { columnIndex++; }
            if (document.getElementById(this.state.realTableId) && document.getElementById(this.state.realTableId).children.length === 2 && document.getElementById(this.state.realTableId).children[1].children.length) {//有数据才调整宽度
                this.oldHeaderWidth = this.headerWidth ?? {};//各列的宽度数据

                this.headerWidth = {};
                for (let i = columnIndex; i < document.getElementById(this.state.realTableId).children[1].children[0].children.length; i++) {
                    let name = document.getElementById(this.state.realTableId).children[1].children[0].children[i].getAttribute("name")
                    let width = Math.ceil(document.getElementById(this.state.realTableId).children[1].children[0].children[i].getBoundingClientRect().width);
                    let headerWidth = Math.ceil(document.getElementById(this.state.fixTableId).querySelector(`th[name='${name}']`)?.getBoundingClientRect().width) || 0;
                    this.headerWidth[name] = Math.max(headerWidth, width);

                }
            }
        } catch (e) {
            console.log("adjustColumnWidth", e)
        }
        finally {

            if (func.diff(this.oldHeaderWidth, this.headerWidth)) {//如果列的宽度有变化才重新渲染

                this.setState({})
            }
        }
    }
}