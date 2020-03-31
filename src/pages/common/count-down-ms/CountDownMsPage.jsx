import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';

function CountDownMsPage({dispatch, countDownMs}) {

	let {
		
		attrTotalTime,
		attrRecordInitTime,
		attrIsStart,
		attrDelay,
		attrSourceNamespace,
		attrSourceMethods,
		
	} = countDownMs;

	let cd = undefined;
	
	if(attrIsStart) {
		
		/*
		if(attrSourceNamespace == undefined) {
			return <div>{message.error('请填写引用界面命名')}</div>
		}

		if(attrSourceMethods == undefined) {
			return <div>{message.error('请填写引用界面方法')}</div>
		}
		*/

		cd = setInterval(function() {
			if(0 === attrTotalTime) {
				clearInterval(cd);
				
				dispatch({
					type : `${attrSourceNamespace}/${attrSourceMethods}`,
				})
				
				dispatch({
					type : 'countDownMs/updateState',
					payload : {
						attrTotalTime : attrRecordInitTime,
					}
				})
			} else {
				clearInterval(cd);
				attrTotalTime--;
				dispatch({
					type : 'countDownMs/updateState',
					payload : {
						attrTotalTime : attrTotalTime--,
					}
				})
			}
		}, attrDelay || 1000);
	} else {
		clearInterval(cd);
	}
			
    return (
		<div></div>
    );
}

function mapStateToProps({countDownMs}) {
  return {countDownMs};
}

export default connect(mapStateToProps)(CountDownMsPage);

