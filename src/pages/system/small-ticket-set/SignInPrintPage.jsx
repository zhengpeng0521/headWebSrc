import React from 'react';
import { message } from 'antd';

import SignInPrintPreview from '../../../components/system/small-ticket-set/signIn-print/signInPrint';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function SignInPrint({ dispatch, signInPrint }) {

    let {
        loading,                    //是否加载状态
        id,                         //id
        checkOptions,               //可以选择的checkbox
        radioOptions,               //可选择radio
        initCheckedBox,             //需要渲染的数组
        usedCheckedBox,             //初始选中的数组
        initRadio,
        initTicketBottomContent,    //初始小票底部内容
        ticketBottomContent,        //小票底部内容
        nameCardLogo,               //名帖logo
        showModel,
        checkedstatus,              //打印类型
        defaultCheckStatus,         //当前保存的打印类型
        defaultImgUrl,              //默认图片的url
        wetherSaveSuc,              //是否保存成功
	} = signInPrint;

    //checkbox的onChange事件
    function CheckBoxOnChange(e){
        dispatch({
            type:'signInPrint/updateState',
            payload:{
                initCheckedBox : e
            }
        });
    }

    //textarea的onChange事件
    function InputContentOnChange(e){
        dispatch({
            type:'signInPrint/updateState',
            payload:{
                ticketBottomContent : e.target.value
            }
        });
    }

    //单选框change事件
    function CheckRadioOnChange(status){
        //选择都不打印或者切换到非当前保存状态时清空checkbox打勾数组
        if(status == '0' || status != defaultCheckStatus){
            dispatch({
                type:'signInPrint/updateState',
                payload:{
                   initCheckedBox : []
                }
            });
        }else{
            dispatch({
                type:'signInPrint/updateState',
                payload:{
                   initCheckedBox : usedCheckedBox
                }
            });
        }
        dispatch({
            type:'signInPrint/updateState',
            payload:{
               checkedstatus : status
            }
        });
    }

    //还原默认选项
    function SaveSmallTicketReSet(){
        let array = [];
        if(checkedstatus == '1'){
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
        }else if(checkedstatus == '2'){
            array.push(
                { value : 'parentName' },
                { value : 'logo' , content : defaultImgUrl }
            )
        }
        array.push({
            value : 'printType',
            content : checkedstatus
        })
        dispatch({
            type:'signInPrint/SaveSmallTicketSet',
            payload:{
                id,
                configArray : JSON.stringify(array)
            }
        });
    }

    //保存选项
    function SaveSmallTicketSet(logo){
        let array = [];
        if(checkedstatus == '1'){
            if(initCheckedBox.length == 0){
                return message.warn('请至少选中一项保存')
            }
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
        }else if(checkedstatus == '2'){
            for(let i in initCheckedBox){
                if('logo' != initCheckedBox[i]){
                    array.push({
                        value : initCheckedBox[i]
                    });
                }
            }
            array.push({
                value : 'logo',
                content : !!nameCardLogo[0] && !!nameCardLogo[0].url ? nameCardLogo[0].url : '',
            });
        }
        array.push({
            value : 'printType',
            content : checkedstatus,
        })
        dispatch({
            type:'signInPrint/SaveSmallTicketSet',
            payload:{
                id,
                configArray : JSON.stringify(array)
            }
        });
    }

    //上传图片成功
    function UploadPicSuc(file){
        dispatch({
            type:'signInPrint/updateState',
            payload:{
                nameCardLogo : [{
                    url : file.response.data.url,
                    uid : -1,
                    name : '机构LOGO图',
                    thumbUrl : file.response.data.url,
                }]
            }
        })
    }

    //移除图片事件
    function UploadPicRemove(){
        dispatch({
            type:'signInPrint/updateState',
            payload:{
                nameCardLogo : []
            }
        })
    }

    //清空保存成功
    function ClearWetherSaveSuc(){
        dispatch({
            type:'signInPrint/updateState',
            payload:{
                wetherSaveSuc : false
            }
        })
    }

    let signInPrintPreviewProps = {
        loading,                    //是否加载状态
        checkOptions,               //打印小票可以选择的checkbox
        radioOptions,               //可选择radio
        initCheckedBox,             //需要渲染的数组
        initRadio,
        initTicketBottomContent,    //初始小票底部内容
        ticketBottomContent,        //小票底部内容
        nameCardLogo,               //名帖logo

        CheckBoxOnChange,           //checkbox的onChange事件
        CheckRadioOnChange,         //CheckRadio的change事件
        InputContentOnChange,       //textarea的onChange事件
        SaveSmallTicketReSet,       //还原默认选项

        SaveSmallTicketSet,         //保存选项

        showModel,
        checkedstatus,              //打印类型
        defaultCheckStatus,         //当前保存的打印类型

        UploadPicSuc,               //上传图片成功
        UploadPicRemove,            //移除图片事件
        wetherSaveSuc,              //是否保存成功

        ClearWetherSaveSuc,         //清空保存成功
    };

    return(
        <SignInPrintPreview {...signInPrintPreviewProps}/>
    );
}

function mapStateToProps({ signInPrint }) {
  return { signInPrint };
}

export default connect(mapStateToProps)(SignInPrint);
