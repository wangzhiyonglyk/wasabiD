/**
 * create by wangzhiyong
 * date:2020-12-21
 * desc 交叉表中行筛选条件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import func from "../../../libs/func";
import Panel from "../../../Layout/Panel"
class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldData: func.clone(this.props.data),
            data: func.clone(this.props.data),//数据
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (func.diff(props.data, state.oldData)) {
            return {
                oldData: func.clone(props.data),
                data: func.clone(props.data),
            }
        }
        else {
            return null;
        }

    }
    render() {
         return <div className="wasabi-pivot-set-item">
              <Panel title="筛选" iconCls="icon-filter"  headerStyle={{backgroundColor:"var(--background-color)"}} expandAble={false} style={{height:"calc(100% - 10px)"}}></Panel>
         </div>
    }
}


Filters.propTypes = {
    data: PropTypes.array,//数据,
}

Filters.defaultProps = {
    data: [],//数据,

}

export default Filters;