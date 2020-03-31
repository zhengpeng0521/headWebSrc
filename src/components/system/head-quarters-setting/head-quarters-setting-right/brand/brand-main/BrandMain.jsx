import React from 'react';
import { message , Steps } from 'antd';
import { NullData } from '../../../../../common/new-component/NewComponent';
import styles from './BrandMain.less';
import BrandFirst from '../brand-first/BrandFirst';
import BrandSecond from '../brand-second/BrandSecond';
import BrandThird from '../brand-third/BrandThird';

/*品牌*/
function BrandMain({
    dp,                             //dispatch方法
    rightLoading,                   //右侧项加载状态
    wetherGetBrandStatus,           //是否获取到品牌状态
    brandStep,                      //品牌信息状态步数(0,1,2)
    brandData,                      //品牌审核和成功后的回显品牌信息

    /*第一步*/
    brandSubmitButtonLoading,       //提交审核按钮加载状态
}){

    //品牌信息提交审核(提交的对象，清空表单方法,类型(create/update))
    function BrandSubmit(data,clear,type){
        dp('headQuartersSetting/BrandSubmit',{ ...data , clear , type })
    }

    if(!!wetherGetBrandStatus){
        //如果获取到了申请状态，显示内容
        return(
            <div className = { styles.all }>
                <Steps current = { brandStep } className = { styles.step_bar }>
                    <Steps.Step title='品牌申请'/>
                    <Steps.Step title='等待审核'/>
                    <Steps.Step title='审核通过'/>
                </Steps>
                { brandStep == 0 ? <BrandFirst BrandSubmit = { BrandSubmit } buttonLoading = { brandSubmitButtonLoading }/> : null }
                { brandStep == 1 ? <BrandSecond brandData = { brandData }/> : null }
                { brandStep == 2 ? <BrandThird BrandSubmit = { BrandSubmit } buttonLoading = { brandSubmitButtonLoading } brandData = { brandData }/> : null }
            </div>
        )
    }else if(!wetherGetBrandStatus && !rightLoading){
        //如果不是加载状态并且没有获取到申请状态，则警告提示
        return(
            <NullData height = { 300 } content = '获取品牌状态失败，请检查您的网络并刷新重试'/>
        )
    }else{
        return null;
    }
}

export default BrandMain;
