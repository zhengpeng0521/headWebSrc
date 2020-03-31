/*
 *	attrInitTime	//定时器总时长		  ms 
 *	attrIsStart		//定时器是否开始计时		bool
 *	attrDelay		//定时器多久执过一次 	ms
 *  注意在引用此组件的界面上离开时将attrIsStar置为false来关闭定时器。
 */

import { parse } from 'qs';

export default {
 
  	namespace: 'countDownMs',

  	state: {
		attrTotalTime 		: 60,
		attrRecordInitTime 	: 60,
		attrIsStart 		: false,
		attrDelay 			: 1000,
		attrSourceNamespace	: undefined,
		attrSourceMethods	: undefined,
  	},

  	effects: {
		
		*startCountDownRequest({payload}, {put, call, select}) {
					
			yield put({
				type : 'updateState',
				payload : {
					attrTotalTime 		: payload.attrTotalTime&&payload.attrTotalTime / 1000 || 60,
					attrRecordInitTime 	: payload.attrTotalTime&&payload.attrTotalTime / 1000 || 60,
					attrIsStart 		: payload.attrIsStart 	|| false,
					attrDelay			: payload.attrDelay 	|| 1000,
					attrSourceNamespace	: payload.attrSourceNamespace,
					attrSourceMethods	: payload.attrSourceMethods,
				}
			})			
		},
  	},

  	reducers: {
	  	updateState(state, action) {return {...state, ...action.payload};},
  	},
}
