import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Input, Spin } from 'antd';

import MarketOfflineLeafletsComponent from '../../../components/scrm/market/market-offline-leaflets/MarketOfflineLeafletsComponent';

function MarketOfflineLeafletsPage({ dispatch, marketOfflineLeaflets }){
	
    let {
		attrStyleText,
		attrInsId,
		attrDefId,
		attrOrgId,
		attrVisible,
		attrLeafletsListSource,
		arrrLeafletsListPage,
		attrPageSize,
		attrPageIndex,
		attrDefaultTitle,
		attrDefaultContent,
		attrPageModal,
		attrPageMode,
		attrConfigData,
		attrSelectElement,
		attrRadioValue,
		attrActivityList,
		attrUserList,
		attrQrCodeStatus,
		attrDomain,
		attrShowDownLoad,
		attrDownload,
		attrDownloadString,
		attrSource,
		attrInstData,
		attrLoding,
		attrAligntext,
		attrHiddenEdit,
		attrQrInputString,
		attrOriginConfigData,
		attrQrImages,
		attrReturnQrurl,
		attrEditElementText,
		attrStyleLetterSpacing,
		attrLoadNextPage,
		
    } = marketOfflineLeaflets;
	
	function dp(name, param) {
		dispatch({
			type : `marketOfflineLeaflets/${name}`,
			payload : {
				...param
			}
		})	
	}

	function funcUpdateParam(param) {
		dp('updateState', param);	
	}
	
	function funcChangePageIndex(param) {
		dp('queryLeafletsList', param);	
	}
	
	function funcCreateModelIns(item) {
		dp('getInstMsg', {...item});
	}
	
	function funcUploadImage(file) {
		dp('uploadImage', file);
	}
	
	function funcRequestUserList(value) {
		dp('getUserList', {activityId : value});
	}
	
	function funcSave(data) {
		dp('saveData', {data});
	}
	
	function funcGetMarketList(value) {
		dp('getActivityList', {attrOrgId : value.attrOrgId});
	}
	
	function funcOfflineLeafletsList(value) {
		dp('queryLeafletsList', {attrOrgId : value.attrOrgId, attrPageIndex : 0});
	}
	
	function funcCloseCountDown() {
		dispatch({
			type : `countDownMs/updateState`,
			payload : {
				attrIsStart : false,
			}
		})	
	}

	function funcCallUpdateFunction(value) {
		dp('getInstMsg', { ...value });
	}
	
	window.onresize = function(){
		let number = Math.ceil(document.body.clientWidth / 200);
		if(number != attrPageSize) {
		   funcChangePageIndex({attrPageSize : number, attrOrgId : attrOrgId})
		}
	}
	
	let props = {
		attrStyleText,
		attrDefId,
		attrOrgId,
		attrInsId,
		attrVisible,
		attrPageSize,
		attrPageIndex,
		attrLeafletsListSource,
		arrrLeafletsListPage,
		attrActivityList,
		attrPageModal,
		attrPageMode,
		attrRadioValue,
		attrOriginConfigData,
		attrConfigData,
		attrUserList,
		attrShowDownLoad,
		attrDomain,
		attrQrCodeStatus,
		attrSelectElement,
		attrDefaultTitle,
		attrDefaultContent,
		funcUpdateParam,
		funcChangePageIndex,
		funcCreateModelIns,
		funcUploadImage,
		funcCallUpdateFunction,
		funcRequestUserList,
		funcSave,
		funcGetMarketList,
		funcOfflineLeafletsList,
		funcCloseCountDown,
		attrDownload,
		attrDownloadString,
		attrSource,
		attrInstData,
		attrLoding,
		attrAligntext,
		attrHiddenEdit,
		attrQrInputString,
		attrQrImages,
		attrReturnQrurl,
		attrEditElementText,
		attrStyleLetterSpacing,
		attrLoadNextPage,
	}

    return (
		<MarketOfflineLeafletsComponent {...props} />
    )
};

function mapStateToProps ({ marketOfflineLeaflets }){
	return { marketOfflineLeaflets };
};

export default connect( mapStateToProps )( MarketOfflineLeafletsPage );
