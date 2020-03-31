import React from 'react';
import { message } from 'antd';

import HaveMaxListComponent from '../../../../components/system/gong_hai_set/have-max-list/have-max-list';

import { connect } from 'dva';
import { routerRedux } from 'dva/router';

function HaveMaxList({ dispatch, haveMaxList }) {

    let {
        loading,                    //是否加载状态
        dataKey,
        Status,                     //input框状态
        checkedstatus,              //单选按钮选中状态
	} = haveMaxList;



    //保存选项
    function SaveHaveMaxList(data){
        dispatch({
            type:'haveMaxList/SaveHaveMaxList',
            payload:{
               value:data,
               confKey:'SELLMAXLISTNUM'
            }
        });
    }
    function stopStatus(data){
        dispatch({
            type:'haveMaxList/updateState',
            payload:{
               checkedstatus :data
            }
        });

    }
    let HaveMaxListComponentProps = {
        loading,                    //是否加载状态
        SaveHaveMaxList,         //保存事件
        dataKey,
        Status,
        stopStatus,
        checkedstatus,           //单选按钮选中状态
    };

    return(
        <div>
            <HaveMaxListComponent {...HaveMaxListComponentProps}/>
        </div>
    );
}

function mapStateToProps({ haveMaxList }) {
  return { haveMaxList };
}

export default connect(mapStateToProps)(HaveMaxList);
