import React from 'react';
import { Popover ,message } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import InitGuideComponent from '../../../components/common/init-guide/InitGuideComponent';

function InitGuidePage ({ dispatch, initGuideModel }){
	let {
        stepNum,
		visible

    } = initGuideModel;

	//点击到下一步
	function clickToNextStep(){
		if( stepNum == 4 ){
			dispatch({
				type : 'initGuideModel/updateState',
				payload : {
					visible : false
				}
			})
		}else{
			dispatch({
				type : 'initGuideModel/updateState',
				payload : {
					stepNum : ++stepNum
				}
			})
		}
	}
	let props = {
		stepNum,
		visible,

		clickToNextStep,        //点击到下一步
	}
	return (
		<InitGuideComponent { ...props } />
	)
};

function mapStateToProps ({ initGuideModel }){
	return { initGuideModel };
};

export default connect(mapStateToProps)(InitGuidePage);
