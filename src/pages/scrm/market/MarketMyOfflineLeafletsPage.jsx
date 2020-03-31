import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Input } from 'antd';

import MarketMyOfflineLeafletsComponent from '../../../components/scrm/market/market-my-offline-leaflets/MarketMyOfflineLeafletsComponent';
import MarketActivityPage from './MarketActivityPage';
import MarketOfflineLeafletsPage from './MarketOfflineLeafletsPage';

function MarketMyOfflineLeafletsPage({ dispatch, marketMyOfflineLeaflets }){
	
    let {
      
		attrSelectedRowKeys,
		attrPaginationSource,
		attrPageIndex,
		attrPageSize,
		attrDataSource,
		attrShowSearch,
		attrOrgId,
		attrActivityList,
		
    } = marketMyOfflineLeaflets;

	function dp(name, param) {
		dispatch({
			type : `marketMyOfflineLeaflets/${name}`,
			payload : {
				...param
			}
		})	
	}
	
	//查看详情
	function funcpushMarkeyActivity(record) {
		dispatch({
			type : `marketModel/getAnalysisData`,
			payload : {
				showAnalysisModal : true,
				orgId : record.orgId,
				actId : record.actId,
				createTime : record.actStartDate,
				source : 'offlineLeaflets',
			}
		})	
	}
	
	//打开修改界面
	function funcpushMarkeyOfflineLeaflets(record) {
		dispatch({
			type : `marketOfflineLeaflets/getInstMsg`,
			payload : {
				attrOrgId : record.orgId,
				activityId : record.actId,
				id : record.id,
				attrPageModal : true,
				source : 'offlineLeaflets',
				attrHiddenEdit : false,
			}
		})	
	}
	
	//下载界面	
	function funcPushMarketDownloadOfflineLeaflets(record) {
				
		dispatch({
			type : `marketOfflineLeaflets/getInstMsg`,
			payload : {
				attrOrgId : record.orgId,
				activityId : record.actId,
				attrShowDownLoad : true,
				id : record.id,
				attrPageModal : true,
				source : 'offlineLeaflets',
				attrHiddenEdit : true,
			}
		})	
	}

	let props = {
		dp,
		attrSelectedRowKeys,
		attrPaginationSource,
		attrPageIndex,
		attrPageSize,
		attrDataSource,
		attrShowSearch,
		attrActivityList,
		attrOrgId,
		funcpushMarkeyActivity,
		funcpushMarkeyOfflineLeaflets,
		funcPushMarketDownloadOfflineLeaflets,
	}

    return (
        <div>
			<MarketMyOfflineLeafletsComponent {...props} />
       		<MarketActivityPage />
       		<MarketOfflineLeafletsPage />
        </div>
    )
};

function mapStateToProps ({ marketMyOfflineLeaflets }){
	return { marketMyOfflineLeaflets };
};

export default connect( mapStateToProps )( MarketMyOfflineLeafletsPage );
