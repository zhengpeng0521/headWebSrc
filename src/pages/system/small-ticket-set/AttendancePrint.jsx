import React from 'react';
import { message } from 'antd';

import AttendancePrintPreview from '../../../components/system/small-ticket-set/attendance-print/AttendancePrintPreview';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function AttendancePrint({ dispatch, attendancePrint }) {

    let {
        loading,                    //是否加载状态
        id,                         //id
        checkOptions,               //可以选择的checkbox
        initCheckedBox,             //初始选中的数组
        initTicketBottomContent,    //初始小票底部内容
        ticketBottomContent,        //小票底部内容
	} = attendancePrint;

    //checkbox的onChange事件
    function CheckBoxOnChange(e){
        dispatch({
            type:'attendancePrint/updateState',
            payload:{
                initCheckedBox : e
            }
        });
    }

    //textarea的onChange事件
    function InputContentOnChange(e){
        dispatch({
            type:'attendancePrint/updateState',
            payload:{
                ticketBottomContent : e.target.value
            }
        });
    }

    //还原默认选项
    function SaveSmallTicketReSet(){
        let array = [];
        for(let i in checkOptions){
            if('recBottom' == checkOptions[i].value){
                array.push({
                    value : checkOptions[i].value,
                    content : initTicketBottomContent
                });
            }else{
                array.push({
                    value : checkOptions[i].value,
                });
            }
        }
        dispatch({
            type:'attendancePrint/SaveSmallTicketSet',
            payload:{
                id,
                type : 0,
                configArray : JSON.stringify(array)
            }
        });
    }

    //保存选项
    function SaveSmallTicketSet(){
        let array = [];
        for(let i in initCheckedBox){
            if('recBottom' == initCheckedBox[i]){
                array.push({
                    value : initCheckedBox[i],
                    content : ticketBottomContent,
                });
            }else{
                array.push({
                    value : initCheckedBox[i]
                });
            }
        }
        dispatch({
            type:'attendancePrint/SaveSmallTicketSet',
            payload:{
                id,
                type : 0,
                configArray : JSON.stringify(array)
            }
        });
    }

    let attendancePrintPreviewProps = {
        loading,                    //是否加载状态
        checkOptions,               //可以选择的checkbox
        initCheckedBox,             //初始选中的数组
        initTicketBottomContent,    //初始小票底部内容
        ticketBottomContent,        //小票底部内容

        CheckBoxOnChange,           //checkbox的onChange事件
        InputContentOnChange,       //textarea的onChange事件
        SaveSmallTicketReSet,       //还原默认选项
        SaveSmallTicketSet,         //保存选项
    };

    return(
        <AttendancePrintPreview {...attendancePrintPreviewProps}/>
    );
}

function mapStateToProps({ attendancePrint }) {
  return { attendancePrint };
}

export default connect(mapStateToProps)(AttendancePrint);
