import React from 'react';
import { connect } from 'dva';
import SignCompnent from '../../../components/erp/sign/Sign';
function Sign({dispatch, signModel}) {

	let {
		showOrHiddenSignModalState,
		showOrHiddenSignDetailModalState,
	} = signModel;
		
	function showOrHidSignModalFunction() {
		dispatch({
			type : "signModel/updateState",
			payload : {
				showOrHiddenSignModalState : !showOrHiddenSignModalState,
			}
		});
	}	
	
	function showOrHidSignDetailModalFunction() {
		dispatch({
			type : 'signModel/updateState',
			payload : {
				showOrHiddenSignDetailModalState : !showOrHiddenSignDetailModalState,
			}
		})
	}
	
	function showSignDetailFunction() {
		dispatch({
			type : 'signModel/updateState',
			payload : {
				//showOrHiddenSignModalState : !showOrHiddenSignModalState,
				showOrHiddenSignDetailModalState : !showOrHiddenSignDetailModalState,
			}
		})
	}
	

	const currentObjectProps = {
		obj : {
			showSignDetailFunction,  				//点击签到显示签到详情界面
			showOrHiddenSignModalState,				//显示或者隐藏签到界面状态
			showOrHiddenSignDetailModalState,		//显示或者隐藏签到详情界面状态
			showOrHidSignModalFunction,				//显示或者隐藏签到界面
			showOrHidSignDetailModalFunction,		//显示或者隐藏签到详情界面
		}
	}
	
    return (
		<SignCompnent {...currentObjectProps} />
	);
}

function mapStateToProps({ signModel }) {
  	return { signModel };
}

export default connect(mapStateToProps)(Sign);
