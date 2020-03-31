/*
 *	selectProvincesCityArea //当前省市区
 *	selectdetailAddress		//当前详细地址
 *
 *  内需 {
 *		_mapNewLng,
 *		_mapNewLat,
 *	}
 */
import React from 'react';
import {message} from 'antd';
import styles from './OrgMap.less';

function OrgMap({
	
  	selectProvincesCityArea,
	selectdetailAddress,
	
}) {
		
	//根据经纬度跳转
	let push1 = `https://api.map.baidu.com/api?v=2.0&ak=ea91dy3HDvuYLuuDgLsp7LOGBe0v2BbZ&callback=theLocation(${_mapNewLng}, ${_mapNewLat})`;
	
	//根据详细地址跳转
	let push2 = `https://api.map.baidu.com/api?v=2.0&ak=ea91dy3HDvuYLuuDgLsp7LOGBe0v2BbZ&callback=addressParse('${selectProvincesCityArea}', '${ selectdetailAddress}')`;
	
	//默认地址
	let push3 = `https://api.map.baidu.com/api?v=2.0&ak=ea91dy3HDvuYLuuDgLsp7LOGBe0v2BbZ&callback=init`;
	
	if(_mapNoChange) {
		if(_mapNewLng > 0 && _mapNewLat > 0) {	
			if(_mapMoveAfter) {
				loadJScript(push1);
			} else {
				loadJScript(push2);
			}
		} else if(selectProvincesCityArea&&selectProvincesCityArea.length > 0 || selectdetailAddress&&selectdetailAddress.length > 0) {
			loadJScript(push2);
		} else {
			loadJScript(push3);
		}
	}
	
    return (
		<div className="baseMap" id="base_map"></div>
    );
}

export default OrgMap;
