import React from 'react';
import { message } from 'antd';

import LeadRecordNoRuleComponent from '../../../../components/system/gong_hai_set/lead-record-no-rule/lead-record-no-rule';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function LeadRecordNoRule({ dispatch, leadRecordNoRule }) {

    let {
        loading,                    //是否加载状态
        dataKey,
        checkedstatus,              //单选按钮选中状态
        ruleId,

        tmkStatus,
        tmkTimeOut,

	} = leadRecordNoRule;



    //保存选项
    function SaveLeadRecordNoRule(value){
        value.id = ruleId;
        dispatch({
            type:'leadRecordNoRule/timeOutRecyle',
            payload:{
               ...value
            }
        });
    }
    function stopStatus(e){
        dispatch({
            type:'leadRecordNoRule/updateState',
            payload:{
               checkedstatus :e.target.value
            }
        });

    }

    // TMK名单回收启用关闭change
    function stopTmkStatus(e){
        dispatch({
            type:'leadRecordNoRule/updateState',
            payload:{
                tmkStatus :e.target.value
            }
        });
    }

    let LeadRecordNoRuleComponentProps = {
        loading,                    //是否加载状态
        SaveLeadRecordNoRule,         //保存事件
        dataKey,
        stopStatus,
        checkedstatus,           //单选按钮选中状态

        tmkStatus,
        stopTmkStatus,
        tmkTimeOut,
    };

    return(
        <div>
            <LeadRecordNoRuleComponent {...LeadRecordNoRuleComponentProps}/>
        </div>
    );
}

function mapStateToProps({ leadRecordNoRule }) {
  return { leadRecordNoRule };
}

export default connect(mapStateToProps)(LeadRecordNoRule);
