/*
    dispatch({
            type : 'studentWxBindModalModel/openWxCodeModal',
            payload : {
                studentId : id
            }
        })
*/

import {
   getStudentWxBindList
} from '../../../../services/erp/student-manage/studentWxBindModalService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'studentWxBindModalModel',

	state : {
        wxCodeModalVisible   : false,       //微信绑定框
        url                  : '',
		orgName              : undefined
    },

	effects : {
        //打开微信绑定框
        *openWxCodeModal({ payload } , { call, put, select }){
            let { url, orgName } = payload;
            let studentWxBindModalModel = yield select( state => state.studentWxBindModalModel );
            let wxCodeModalVisible = studentWxBindModalModel.wxCodeModalVisible;
            yield put({
                type : 'updateState',
                payload : {
                    wxCodeModalVisible : !wxCodeModalVisible,
                    url                : url,
					orgName            : orgName
                }
            });
        },

	},

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
