import React from 'react';
import { connect } from 'dva';
import SubordinateFilterComponent from '../../../components/common/subordinate-filter/SubordinateFilterComponent';

function SubordinateFilter({dispatch, mainLayoutModel, onChange}) {
    let {currentUserId,subordinates,selectSubordinate,SubordinateType} = mainLayoutModel;
    function subordinateChange(selectSubordinate) {

        subordinates = subordinates || [];

        let valueArr = [];

        if(selectSubordinate == 'all') {
            subordinates && subordinates.length > 0 && subordinates.map(function(item) {
                valueArr.push(item.id);
            });
            valueArr.push(currentUserId);
        } else if(selectSubordinate == 'my') {
            valueArr.push(currentUserId);
        } else if(selectSubordinate == 'all_sub') {
            subordinates && subordinates.length > 0 && subordinates.map(function(item) {
                valueArr.push(item.id);
            });
        } else {
            valueArr.push(selectSubordinate);
        }

        onChange && onChange(valueArr.join(','));
    }

    let componentProps = {
        currentUserId,subordinates,subordinateChange,SubordinateType,
    };
    return (
        <SubordinateFilterClass {...componentProps} />
    );
}

const SubordinateFilterClass = React.createClass({
    getInitialState() {
        return {
            selectSubordinate: 'my',             //当前选中的类型
        }
    },

    subordinateChange(selectSubordinate) {
        this.setState({
            selectSubordinate
        });
        this.props.subordinateChange && this.props.subordinateChange(selectSubordinate);
    },

    render() {
        let componentProps = {
            currentUserId: this.props.currentUserId,
            subordinates: this.props.subordinates,
            subordinateChange: this.subordinateChange,
            selectSubordinate: this.state.selectSubordinate,
            SubordinateType: this.props.SubordinateType,
        };

        return (
            <SubordinateFilterComponent {...componentProps} />
        );
    }

});

function mapStateToProps({mainLayoutModel}) {
  return {mainLayoutModel};
}

export default connect(mapStateToProps)(SubordinateFilter);
