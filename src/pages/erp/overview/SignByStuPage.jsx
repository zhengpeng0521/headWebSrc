import React from 'react';
import { connect } from 'dva';
import SignByStuComponent from '../../../components/erp/overview/SignByStuComponent';

function SignByStuPage({dispatch, signByStuModel}) {

	let {
        loading,
        visible,
        orgId,
        stuId,
        stuName,
        scheduleList,
        wetherPrintTicket,    //是否打印小票
        printTicketIndex,     //选择小票的索引
    } = signByStuModel;

    /*关闭首页按学员快捷签到*/
    function onCloseClick() {
        dispatch({
            type: 'signByStuModel/updateState',
            payload: {
                visible: false,
                wetherPrintTicket : false,
                printTicketIndex : '',
            }
        });
    }

    //显示更多操作按钮
    function showScheduleOpts(cpId) {
        dispatch({
            type: 'signByStuModel/showScheduleOpts',
            payload: {
                cpId
            }
        });
    }

    //首页学员快速签到
    function stuQuickSign(cpId, orgId, stuId, signType, index) {
        dispatch({
            type: 'signByStuModel/stuQuickSign',
            payload: {
                cpId, orgId, stuId, signType,wetherPrintTicket,index
            }
        });
    }

    //打印小票checkbox的onChange事件
    function ErpSignByStuCheckBoxOnchange(e,index){
        if(e[0] == '1'){
            dispatch({
                type:'signByStuModel/updateState',
                payload:{
                    wetherPrintTicket : true,
                    printTicketIndex : index
                }
            });
        }else{
            dispatch({
                type:'signByStuModel/updateState',
                payload:{
                    wetherPrintTicket : false,
                    printTicketIndex : '',
                }
            });
        }
    }

    let componProps = {
        loading, visible, orgId, stuId, stuName, scheduleList,onCloseClick,showScheduleOpts,stuQuickSign,
        ErpSignByStuCheckBoxOnchange,       //打印小票checkbox的onChange事件
    };

    return (
        <SignByStuComponent {...componProps} />
    );
}

function mapStateToProps({ signByStuModel }) {
  	return { signByStuModel };
}

export default connect(mapStateToProps)(SignByStuPage);
