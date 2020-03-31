import React from 'react';
import { message , Steps } from 'antd';
import { NullData } from '../../../../../common/new-component/NewComponent';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

/*域名设置 第一步 申请*/
import DomainNameSettingFirst from '../domain-name-setting-first/DomainNameSettingFirst';
/*域名设置 第二步 等待审核*/
import DomainNameSettingSecond from '../domain-name-setting-second/DomainNameSettingSecond';
/*域名设置 第三步 审核成功等待支付*/
import DomainNameSettingThird from '../domain-name-setting-third/DomainNameSettingThird';
/*域名设置 第四步 各种设置*/
import DomainNameSettingForth from '../domain-name-setting-forth/DomainNameSettingForth';

import styles from './DomainNameSettingMain.less';

function DomainNameSetting({
    dp,                                 //dispatch方法
    rightLoading,                       //所有右侧项公用加载状态
    domainStep,                         //步骤条步数(必须是num)
    wetherGetDomainStatus,              //获取租户申请状态是否成功(失败则使页面变为空页面)
    domainName,                         //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
    /*域名设置 第一步 申请*/
    domainFirstStepSubmitButtonLoading, //申请使用按钮加载状态

    /*域名设置 第四步 各种设置*/
    domainForthStepBackgroundImg,       //用户选择或回填的背景图
    domainForthStepLogoImg,             //用户选择或回填的logo图片
    domainForthStepName,                //用户输入或回填的商户姓名
	domainForthStepTitle,
    domainForthStepSubmitButtonLoading, //保存设置按钮加载状态
}) {

    /*第一步*/
        //申请使用点击提交
        function FirstStepApplyForSubmit(data){
            dp('headQuartersSetting/DomainFirstStepApplyForSubmit',{
                ...data
            })
        }

    /*第四步*/
        //图片上传onChange事件
        function ForthStepImgUploadOnChange(info,type){
            if(info.file.status != 'uploading' && info.file.status != 'removed' && info.file.response && info.file.response.errorCode != 9000) {
                message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
                if(type == 'bgimg'){
                    dp('headQuartersSetting/updateState',{
                        domainForthStepBackgroundImg : []
                    })
                }else if(type == 'logoimg'){
                    dp('headQuartersSetting/updateState',{
                        domainForthStepLogoImg : []
                    })
                }
    		}
            if(info.file.status === 'done' && info.file.response.errorCode == 9000) {
                message.success(`${info.file.name} 上传成功`);
                if(type == 'bgimg'){
                    dp('headQuartersSetting/updateState',{
                        domainForthStepBackgroundImg : [{
                            uid : -1,
                            url : info.file.response.data.url,
                            name : info.file.name,
                            thumbUrl : info.file.response.data.url
                        }]
                    })
                }else if(type == 'logoimg'){
                    dp('headQuartersSetting/updateState',{
                        domainForthStepLogoImg : [{
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
                    dp('headQuartersSetting/updateState',{
                        domainForthStepBackgroundImg : []
                    })
                }else if(type == 'logoimg'){
                    dp('headQuartersSetting/updateState',{
                        domainForthStepLogoImg : []
                    })
                }
            }
        }

        //图片移除事件
        function ForthStepImgUploadOnRemove(type){
            if(type == 'bgimg'){
                dp('headQuartersSetting/updateState',{
                    domainForthStepBackgroundImg : []
                })
            }else if(type == 'logoimg'){
                dp('headQuartersSetting/updateState',{
                    domainForthStepLogoImg : []
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
            dp('headQuartersSetting/updateState',{
                domainForthStepName : e.target.value
            })
        }
		function ForthStepNameOnChange1(e){
            dp('headQuartersSetting/updateState',{
                domainForthStepTitle : e.target.value
            })
        }

        //恢复默认
        function ForthStepRestoreDefaults(data){
            dp('headQuartersSetting/DomainForthStepSetSubmit',{
                ...data
            })
        }

        //第四步保存设置事件
        function ForthStepSetSubmit(data){
            dp('headQuartersSetting/DomainForthStepSetSubmit',{
                ...data
            })
        }

    /*域名设置 第一步 申请*/
    let DomainNameSettingFirstProps = {
        domainFirstStepSubmitButtonLoading, //申请使用按钮加载状态
        FirstStepApplyForSubmit,            //申请使用点击提交
    };

    /*域名设置 第二步 等待审核*/
    let DomainNameSettingSecondProps = {
        domainName,                         //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
    }

    /*域名设置 第三步 审核成功等待支付*/
    let DomainNameSettingThirdProps = {
        domainName,                         //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
    }

    /*域名设置 第四步 各种设置*/
    let DomainNameSettingForthProps = {
        domainName,                         //用户申请的三级域名(第二步 等待审核/第三步 审核通过 需要展示/第四步 设置)
        domainForthStepBackgroundImg,       //用户选择或回填的背景图
        domainForthStepLogoImg,             //用户选择或回填的logo图片
        domainForthStepName,                //用户输入或回填的商户姓名
		domainForthStepTitle,
        domainForthStepSubmitButtonLoading, //保存设置按钮加载状态

        ForthStepImgUploadOnChange,         //图片上传onChange事件
        ForthStepImgUploadOnRemove,         //图片移除事件
        ForthStepImgUploadBeforeUpload,     //图片上传之前事件
        ForthStepNameOnChange,              //输入框onChange事件
		ForthStepNameOnChange1,
        ForthStepRestoreDefaults,           //恢复默认
        ForthStepSetSubmit,                 //保存设置事件
    }

    if(!!wetherGetDomainStatus && !rightLoading){
        //已经获取申请状态并且没有加载状态时显示页面
        return(
            <div className = { styles.all }>
                <Steps current = { domainStep } className = { styles.step_bar }>
                    <Steps.Step title='开通'/>
                    <Steps.Step title='等待审核'/>
                    <Steps.Step title='审核通过'/>
                    <Steps.Step title='设置'/>
                </Steps>
                { domainStep == 0 ? <DomainNameSettingFirst {...DomainNameSettingFirstProps}/> : null }
                { domainStep == 1 ? <DomainNameSettingSecond {...DomainNameSettingSecondProps}/> : null }
                { domainStep == 2 ? <DomainNameSettingThird {...DomainNameSettingThirdProps}/> : null }
                { domainStep == 3 ? <DomainNameSettingForth {...DomainNameSettingForthProps}/> : null }
            </div>
        )
    }else if(!wetherGetDomainStatus && !rightLoading){
        //获取申请状态失败并且没有加载状态时显示页面
        return(
            <NullData height = { 300 } content = '获取租户申请状态失败，请检查您的网络并刷新重试'/>
        )
    }else{
        //其余状态页面
        return null;
    }
}

function mapStateToProps({ domainNameSetting }) {
  return { domainNameSetting };
}

export default connect(mapStateToProps)(DomainNameSetting);
