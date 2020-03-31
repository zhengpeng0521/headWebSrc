import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Input } from 'antd';

import MarketActivityComponent from '../../../components/scrm/market/markrt-activity/MarketActivityComponent';

function MarketPage({ dispatch, marketModel }){
	
    let {
      
		mode,
		orgId,
		subMode,
		showAddActivityModal,
		showCreateQRModal,
		analysisPageTopData,
		showSearch,
		dataSource,
		paginationSource,
		dayValue,
		editStatus,
		selectedRowKeys,
		pageIndex,
		pageSize,
		itemDataSource,
		showAnalysisModal,
		analysisPageData,
		analysisDataSource,
		salesStaffDataSource,
		gatheringPlaceDataSource,
		drawingData,
		itemId,
		domain,
		qrData,
		showSelectModal,
		collectInformationDataSource,
		draw_members,
		saveButtonDsiabled,
		disabledCreateQrBtn,
		drawingDataCount,
		analysisPageSize,
		analysisPageIndex,
		currentActCreateTime,
		dayValueSelect,
		fromOfflineLeafletsControl,
		orgIdsArr,
		attrClearFormValue,
		
    } = marketModel;

	function dp(name, param) {
		dispatch({
			type : `marketModel/${name}`,
			payload : {
				...param
			}
		})	
	}

	let props = {
		dp,
		orgId,
		mode,
		subMode,
		dayValue,
		dataSource,
		editStatus,
		paginationSource,
		showSearch,
		showAddActivityModal,
		analysisPageTopData,
		showCreateQRModal,
		selectedRowKeys,
		pageIndex,
		pageSize,
		itemId,
		domain,
		qrData,
		drawingData,
		itemDataSource,
		showAnalysisModal,
		analysisPageData,
		analysisDataSource,
		salesStaffDataSource,
		gatheringPlaceDataSource,
		saveButtonDsiabled,
		collectInformationDataSource,
		draw_members,
		drawingDataCount,
		analysisPageSize,
		analysisPageIndex,
		disabledCreateQrBtn,
		currentActCreateTime,
		dayValueSelect,
		showSelectModal,
		orgIdsArr,
		fromOfflineLeafletsControl,
	}

    return (
        <div>
			<MarketActivityComponent {...props} />
        </div>
    )
};

function mapStateToProps ({ marketModel }){
	return { marketModel };
};

export default connect( mapStateToProps )( MarketPage );
