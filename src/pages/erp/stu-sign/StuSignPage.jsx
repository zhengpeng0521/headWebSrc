import React, { PropTypes } from 'react';
import { connect } from 'dva';
import StuSignComponent from '../../../components/erp/stu-sign/StuSignComponent';

/*
 * 学员签到
 * 排课列表
 */
function StuSignPage({dispatch, stuSignModel}) {
    let {
        visible,
        loading,
        query,
        scheduleList,

        courseComList,classComList,employeeComList,stuComList,
        searchContent,     //查询内容
    } = stuSignModel;

    function onClose() {
        dispatch({
            type: 'stuSignModel/updateState',
            payload: {
                visible: false,
                scheduleList: [],
                query: {},
                loading: false,
            }
        });
    }

    function stopLoading() {
        dispatch({
            type: 'stuSignModel/updateState',
            payload: {
                loading: false,
            }
        });
    }

    //打开排课的前端窗口
    function openScheduleSign(orgId,cpId) {
        dispatch({
            type: 'stuSignModel/updateState',
            payload: {
                loading: true,
            }
        });
        dispatch({
            type: 'scheduleSignModel/showScheduleSign',
            payload: {
                orgId,cpId,
                afterOpen: stopLoading,
            }
        });
    }

    //查询排课
    function queryScheduleList(data) {
        dispatch({
            type: 'stuSignModel/queryScheduleList',
            payload: {
                ...data,
            }
        });
    }

    /*选择门店变更时*/
    function onOrgChange(data) {
        dispatch({
            type: 'stuSignModel/onOrgChange',
            payload: {
                ...data,
            }
        });
    }

    let stuSignProps = {
        visible,
        loading,
        query,
        scheduleList,
        onClose,
        openScheduleSign,
        queryScheduleList,
        onOrgChange,
        courseComList,classComList,employeeComList,stuComList,
        searchContent,     //查询内容
    };

    return (
        <StuSignComponent {...stuSignProps} />
    );
}

StuSignPage.propTypes = {
  dispatch: PropTypes.func,
  stuSignModel: PropTypes.object,
};

function mapStateToProps({stuSignModel}) {
  return {stuSignModel};
}

export default connect(mapStateToProps)(StuSignPage);
