import React, { PropTypes } from 'react';
import { connect } from 'dva';
import ScheduleSignComponent from '../../../components/erp/stu-sign/ScheduleSignComponent';

/*
 * 学员签到
 * 排课列表
 */
function ScheduleSignPage({dispatch, scheduleSignModel}) {
    let {
        editing, //是否为考勤 且是否可以编辑
        visible,
        loading,

        cpId, //排课编号
        orgId, //门店编号
        ptArr,//主教老师
        atArr,//助教老师
        clsSignTime,
        clsSignCostTpl,
        cpContent,
        homework,
        remarks,
        normalStuArr,
        remedialStuArr,
        auditionStuArr,
        className,courseName,
        employeeComList,
        stuSignErrorMessage,//学员签到出错原因
        wetherPrintTicket,       //是否打印小票
    } = scheduleSignModel;

    function onCloseClick() {
        dispatch({
            type: 'scheduleSignModel/updateState',
            payload: {
                visible: false,
                loading: false,
                wetherPrintTicket : false,       //是否打印小票
            }
        });
    }

    //改变签到选择类型
    function onChangeSignType(e, type, signType, stuId) {
        let {target} = e;
        let check = target.checked;
        dispatch({
            type: 'scheduleSignModel/changeSignType',
            payload: {
                check,type,signType,stuId,
            }
        });
    }

    function onSubmitClick(params, afterSave) {
        dispatch({
            type: 'scheduleSignModel/saveSign',
            payload: {
                params,afterSave,
            }
        });
    }

    //是否打印小票
    function WetherPrintTicket(e){
        if(e[0] == '1'){
            dispatch({
                type:'scheduleSignModel/updateState',
                payload:{
                    wetherPrintTicket : true
                }
            });
        }else{
            dispatch({
                type:'scheduleSignModel/updateState',
                payload:{
                    wetherPrintTicket : false
                }
            });
        }
    }

    let scheduleSignProps = {
        visible,
        loading,
        editing, //是否为考勤 且是否可以编辑

        cpId, //排课编号
        orgId,
        ptArr,//主教老师
        atArr,//助教老师
        clsSignTime,
        clsSignCostTpl,
        cpContent,
        homework,
        remarks,
        normalStuArr,
        remedialStuArr,
        auditionStuArr,
        className,courseName,
        employeeComList,
        stuSignErrorMessage,
        onCloseClick,onChangeSignType,onSubmitClick,
        WetherPrintTicket,          //是否打印小票
    };

    return (
        <ScheduleSignComponent {...scheduleSignProps} />
    );
}

ScheduleSignPage.propTypes = {
  dispatch: PropTypes.func,
  scheduleSignModel: PropTypes.object,
};

function mapStateToProps({scheduleSignModel}) {
  return {scheduleSignModel};
}

export default connect(mapStateToProps)(ScheduleSignPage);
