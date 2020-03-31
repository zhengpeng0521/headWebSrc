import React from 'react';
import {routerRedux} from 'dva/router';
import { connect } from 'dva';
import HomeLayout from '../../components/home/home-main/HomeLayout';
function HomeView({dispatch, homeModel}) {

	let {
		namespace, select_row,sourceIndex, showModal, sourceItem, selectMapping, sourceData,
		targetData, targetIndex, targetItem, mappingResults, mappingIndex,
	} = homeModel;
	
	function touchButtonJumpFunction(tag) {

		switch(tag) {
			case 1:
				dispatch(routerRedux.push('/'));
				break;
			case 2:
				dispatch(routerRedux.push('/'));
				break;
			case 3:
				dispatch(routerRedux.push('/'));
				break;
			case 4:
				dispatch(routerRedux.push('/'));
				break;
			case 5:
				dispatch(routerRedux.push('/'));
				break;
			case 6:
				dispatch(routerRedux.push('/'));
				break;
			case 7:
				dispatch(routerRedux.push('/'));
				break;
			case 8:
				dispatch(routerRedux.push('/'));
				break;
			case 9:
				dispatch(routerRedux.push('/'));
				break;
			case 10:
				dispatch(routerRedux.push('/'));
				break;
			case 11:
                //学员签到
				dispatch({
                    type: 'stuSignModel/showSignModal',
                });
				break;
			case 12:
				dispatch(routerRedux.push('/'));
				break;
			case 13:
				dispatch(routerRedux.push('/'));
				break;
			default:
				break;
		}
	}

	let props = {
		dispatch, namespace, select_row,sourceIndex, showModal, sourceItem, selectMapping, sourceData,
		targetData, targetIndex, targetItem, mappingResults, mappingIndex,
		obj : {
			touchButtonJumpFunction,
		}
	}

    return (
        <HomeLayout {...props} />
    );
}

function mapStateToProps({ homeModel }) {
  return { homeModel };
}

export default connect(mapStateToProps)(HomeView);
