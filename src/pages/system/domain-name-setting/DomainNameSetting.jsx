import React from 'react';
import { message , Steps , Spin } from 'antd';
import { NullData } from '../../../components/common/new-component/NewComponent';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

/*域名设置 第一步 申请*/
import DomainNameSettingFirst from '../../../components/system/domain-name-setting/domain-name-setting-first/DomainNameSettingFirst';
/*域名设置 第二步 等待审核*/
import DomainNameSettingSecond from '../../../components/system/domain-name-setting/domain-name-setting-second/DomainNameSettingSecond';
/*域名设置 第三步 审核成功等待支付*/
import DomainNameSettingThird from '../../../components/system/domain-name-setting/domain-name-setting-third/DomainNameSettingThird';
/*域名设置 第四步 各种设置*/
import DomainNameSettingForth from '../../../components/system/domain-name-setting/domain-name-setting-forth/DomainNameSettingForth';

function DomainNameSetting({ dispatch, domainNameSetting }) {

    let {
        step,                               //步骤条步数(必须是num)
        loading,                            //整个页面加载状态
        wetherGetStatus,                    //获取租户申请状态是否成功(失败则使页面变为空页面)
        hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
        /*第一步 申请*/
        firstStepLoading,                   //页面加载状态
        firstStepSubmitButtonLoading,       //申请使用按钮加载状态

        /*域名设置 第四步 各种设置*/
        forthStepBackgroundImg,             //用户选择或回填的背景图
        forthStepLogoImg,                   //用户选择或回填的logo图片
        forthStepName,                      //用户输入的商户姓名
        forthStepSubmitButtonLoading,       //保存设置按钮加载状态
	} = domainNameSetting

    function dp(path,obj){
        dispatch({
            type : path,
            payload : {
                ...obj
            }
        })
    }

    /*第一步*/
        //申请使用点击提交
        function FirstStepApplyForSubmit(data){
            dp('domainNameSetting/FirstStepApplyForSubmit',{
                ...data
            })
        }

    /*第四步*/
        //图片上传onChange事件
        function ForthStepImgUploadOnChange(info,type){

            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
                if(type == 'bgimg'){
                    dp('domainNameSetting/updateState',{
                        forthStepBackgroundImg : []
                    })
                }else if(type == 'logoimg'){
                    dp('domainNameSetting/updateState',{
                        forthStepLogoImg : []
                    })
                }
    		}
            if(info.file.status === 'done' && info.file.response.errorCode == 9000) {
                message.success(`${info.file.name} 上传成功`);
                if(type == 'bgimg'){
                    dp('domainNameSetting/updateState',{
                        forthStepBackgroundImg : [{
                            uid : -1,
                            url : info.file.response.data.url,
                            name : info.file.name,
                            thumbUrl : info.file.response.data.url
                        }]
                    })
                }else if(type == 'logoimg'){
                    dp('domainNameSetting/updateState',{
                        forthStepLogoImg : [{
                            uid : -2,
                            url : info.file.response.data.url,
                            name : info.file.name,
                            thumbUrl : info.file.response.data.url
                        }]
                    })
                }
            }
            if(info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
                if(type == 'bgimg'){
                    dp('domainNameSetting/updateState',{
                        forthStepBackgroundImg : []
                    })
                }else if(type == 'logoimg'){
                    dp('domainNameSetting/updateState',{
                        forthStepLogoImg : []
                    })
                }
            }
        }

        //图片移除事件
        function ForthStepImgUploadOnRemove(type){
            if(type == 'bgimg'){
                dp('domainNameSetting/updateState',{
                    forthStepBackgroundImg : []
                })
            }else if(type == 'logoimg'){
                dp('domainNameSetting/updateState',{
                    forthStepLogoImg : []
                })
            }
        }

        //图片上传之前事件
        function ForthStepImgUploadBeforeUpload(file,limit){
            const isLimit = file.size / 1024 / 1024 < limit;
            if (!isLimit) {
                message.error('图片大小不大于' + limit + 'M!');
                return false;
            }
            return true;
        }

        //品牌名称输入框onChange事件
        function ForthStepNameOnChange(e){
            dp('domainNameSetting/updateState',{
                forthStepName : e.target.value
            })
        }

        //恢复默认
        function ForthStepRestoreDefaults(data){
            dp('domainNameSetting/ForthStepSetSubmit',{
                ...data
            })
        }

        //第四步保存设置事件
        function ForthStepSetSubmit(data){
            dp('domainNameSetting/ForthStepSetSubmit',{
                ...data
            })
        }

    /*域名设置 第一步 申请*/
    let DomainNameSettingFirstProps = {
        firstStepLoading,                   //页面加载状态
        firstStepSubmitButtonLoading,       //申请使用按钮加载状态
        FirstStepApplyForSubmit,            //申请使用点击提交
    };

    /*域名设置 第二步 等待审核*/
    let DomainNameSettingSecondProps = {
        hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
    }

    /*域名设置 第三步 审核成功等待支付*/
    let DomainNameSettingThirdProps = {
        hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
    }

    /*域名设置 第四步 各种设置*/
    let DomainNameSettingForthProps = {
        hostName,                           //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
        forthStepBackgroundImg,             //用户选择或回填的背景图
        forthStepName,                      //用户输入的商户姓名
        forthStepLogoImg,                   //用户选择或回填的logo图片
        forthStepSubmitButtonLoading,       //保存设置按钮加载状态

        ForthStepImgUploadOnChange,         //图片上传onChange事件
        ForthStepImgUploadOnRemove,         //图片移除事件
        ForthStepImgUploadBeforeUpload,     //图片上传之前事件
        ForthStepNameOnChange,              //输入框onChange事件
        ForthStepRestoreDefaults,           //恢复默认
        ForthStepSetSubmit,                 //保存设置事件
    }

    if(!!wetherGetStatus){
        return(
            <Spin spinning = { loading }>
                <div style = {{ width : '100%' , overflowY : 'hidden' , overflowX : 'auto' , height : 'calc(100vh - 120px)' }}>
                    <Steps current = { step } style = {{ width : '100%' , minWidth : 800 , height : 45 , marginTop : 10 , padding : '0 20px' , borderBottom : '4px solid #5d9cec' }}>
                        <Steps.Step title='开通'/>
                        <Steps.Step title='等待审核'/>
                        <Steps.Step title='审核通过'/>
                        <Steps.Step title='设置'/>
                    </Steps>
                    { step == 0 ? <DomainNameSettingFirst {...DomainNameSettingFirstProps}/> : null }
                    { step == 1 ? <DomainNameSettingSecond {...DomainNameSettingSecondProps}/> : null }
                    { step == 2 ? <DomainNameSettingThird {...DomainNameSettingThirdProps}/> : null }
                    { step == 3 ? <DomainNameSettingForth {...DomainNameSettingForthProps}/> : null }
                </div>
            </Spin>
        )
    }else if(!wetherGetStatus && !loading){
        return(
            <NullData height = { 300 } content = '获取租户申请状态失败，请检查您的网络并刷新重试'/>
        )
    }else{
        return null;
    }
}

function mapStateToProps({ domainNameSetting }) {
  return { domainNameSetting };
}

export default connect(mapStateToProps)(DomainNameSetting);
