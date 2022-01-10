/**
 * create by wangzhiyong
 * date:2020-12-21
 * desc 交叉表中行筛选条件
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import func from "../../../libs/func";
import Panel from "../../../Layout/Panel"
class Fields extends Component {
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
return <div className="wasabi-pivot-configuration-fields" >
    <Panel title="字段" iconCls="icon-table"  headerStyle={{backgroundColor:"var(--background-color)"}} expandAble={false} style={{height:"calc(100% - 10px)"}}></Panel>
</div>;
    }
}


Fields.propTypes = {
    data: PropTypes.array,//数据,
}

Fields.defaultProps = {
    data: [],//数据,

}
export default Fields;