import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ErpOverviewComponent from '../../../components/erp/overview/ErpOverviewComponent';

function ErpOverview({dispatch, erpOverviewModel}) {

	let {
        loading,
        selectOrgId,firstSchedule,
        allStuComList,overviewData,
    } = erpOverviewModel;

    /*替换选择的机构*/
    function changeSelectOrg(orgId) {
        dispatch({
            type: 'erpOverviewModel/loadOverviewData',
            payload: {
                orgId
            }
        });
    }

    /*根据学员进行首页签到*/
    function signByStu(stuId, stuName) {
        dispatch({
            type: 'signByStuModel/showSign',
            payload: {
                orgId: selectOrgId,
                stuId,stuName,
            }
        });
    }

    /*学员正常签到*/
    function stuSign() {
        dispatch({
            type: 'stuSignModel/showSignModal',
        });
    }

    //打开排课签到窗口
    function openScheduleSign(orgId, cpId) {
        if(orgId != undefined && cpId != undefined) {
            dispatch({
                type: 'scheduleSignModel/showScheduleSign',
                payload: {
                    orgId, cpId
                }
            });
        }
    }

    //路由跳转
    function jumpTo(query) {
        dispatch(routerRedux.push({
            pathname: 'erp_stusign_list',
            query,
        }));
    }

    //打开自主签到界面
    function stuSignSelf() {
        dispatch({
            type: 'stuSignBySelfModel/showSwitch',
        });
    }

    let componProps = {
        loading,selectOrgId,allStuComList,firstSchedule,openScheduleSign,stuSignSelf,
        changeSelectOrg,signByStu,stuSign,jumpTo,overviewData,
    };

    return (
        <ErpOverviewComponent {...componProps} />
    );
}

function mapStateToProps({ erpOverviewModel }) {
  	return { erpOverviewModel };
}

export default connect(mapStateToProps)(ErpOverview);
