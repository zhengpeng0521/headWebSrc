import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import CheckSameRuleComponent from '../../../../components/system/gong_hai_set/check-same-rules/CheckSameRules';

function CheckSameRule({ dispatch, checkSameRule }) {

    let {

        //学员
        stuQuerySuc,                    //学员查重规则是否查询成功(成功才渲染组件)
        stuSingleId,                    //学员单个修改序号(传空或不传表示新增)
        stuBatchId,                     //学员批量修改序号(传空或不传表示新增)
        stuSingleScope,                 //学员单个查重范围
        stuBatchScope,                  //学员批量查重范围
        stuSingleConfArray,             //学员单个查重可选项(一般是手机号，姓名)
        stuBatchConfArray,              //学员批量查重可选项(一般是手机号，姓名)
        stuSingleCheckedConfArray,      //学员单个选中的配置项
        stuBatchCheckedConfArray,       //学员批量选中的配置项

        //名单
        leadQuerySuc,                   //名单查重规则是否查询成功(成功才渲染组件)
        leadSingleId,                   //名单单个修改序号(传空或不传表示新增)
        leadBatchId,                    //名单批量修改序号(传空或不传表示新增)
        leadSingleScope,                //名单单个查重范围
        leadBatchScope,                 //名单批量查重范围
        leadSingleConfArray,            //名单单个查重可选项(一般是手机号，姓名)
        leadBatchConfArray,             //名单批量查重可选项(一般是手机号，姓名)
        leadSingleCheckedConfArray,     //名单单个选中的配置项
        leadBatchCheckedConfArray,      //名单批量选中的配置项

        loading,                        //整个页面加载状态
        buttonLoading,                  //按钮加载状态

	} = checkSameRule

    //点击保存
    function Submit(data){
        dispatch({
            type:'checkSameRule/Submit',
            payload:{
                ...data
            }
        });
    }

    let CheckSameRuleComponentProps = {
        //学员
        stuQuerySuc,                    //学员查重规则是否查询成功(成功才渲染组件)
        stuSingleId,                    //学员单个修改序号(传空或不传表示新增)
        stuBatchId,                     //学员批量修改序号(传空或不传表示新增)
        stuSingleScope,                 //学员单个查重范围
        stuBatchScope,                  //学员批量查重范围
        stuSingleConfArray,             //学员单个查重可选项(一般是手机号，姓名)
        stuBatchConfArray,              //学员批量查重可选项(一般是手机号，姓名)
        stuSingleCheckedConfArray,      //学员单个选中的配置项
        stuBatchCheckedConfArray,       //学员批量选中的配置项

        //名单
        leadQuerySuc,                   //名单查重规则是否查询成功(成功才渲染组件)
        leadSingleId,                   //名单单个修改序号(传空或不传表示新增)
        leadBatchId,                    //名单批量修改序号(传空或不传表示新增)
        leadSingleScope,                //名单单个查重范围
        leadBatchScope,                 //名单批量查重范围
        leadSingleConfArray,            //名单单个查重可选项(一般是手机号，姓名)
        leadBatchConfArray,             //名单批量查重可选项(一般是手机号，姓名)
        leadSingleCheckedConfArray,     //名单单个选中的配置项
        leadBatchCheckedConfArray,      //名单批量选中的配置项

        loading,                        //整个页面加载状态
        buttonLoading,                  //按钮加载状态

        Submit,                         //点击保存
    };

    return(
        <div>
            <CheckSameRuleComponent {...CheckSameRuleComponentProps}/>
        </div>
    );
}

function mapStateToProps({ checkSameRule }) {
  return { checkSameRule };
}

export default connect(mapStateToProps)(CheckSameRule);
