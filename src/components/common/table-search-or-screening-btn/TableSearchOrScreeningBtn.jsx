/*
 * 搜索按钮和筛选按钮
 * 外部传入自定义的方法进行回调
 * let props = {
 * 	   isShowSearch		: 是否显示左侧按钮(默认显示) BOOL
 *	   buttonLMethods 	: 自定义左侧按钮方法,
 *	   buttonRMethods 	: 自定义右侧按钮方法,
 *	   buttonLTitle		: 自定义左侧文字(默认是搜索),
 *	   buttonRTitle		: 自定义右侧文字(默认是筛选),
 *	   buttonLIcon		: 自定义左侧图标(默认是search)
 *     buttonRIcon		: 自定义左侧图标(默认是filter)
 * }
 */
import React from 'react';
import {Button, message} from 'antd';
import styles from './TableSearchOrScreeningBtn.less';

function TableSearchOrScreeningBtnComponent ({
	
	buttonLIcon,
	buttonRIcon,
	buttonLTitle,
	buttonRTitle,
	buttonLMethods,
	buttonRMethods,
	isShowSearch,
	
}) {
	
	function judgeYesOrNoMethods(methods) {
		if( typeof methods === 'function' ){
			methods();
		} else {
			message.error('方法未传入');
			return;
		}
	}
	
	function searchEvent() {
		judgeYesOrNoMethods(buttonLMethods);
	}
	
	function screeningEvent () {
		judgeYesOrNoMethods(buttonRMethods);
	}

	let dis 	= isShowSearch || isShowSearch == undefined ? 'block' : 'none';
	let LIcon	= buttonLIcon&&buttonLIcon.length > 0 ? buttonLIcon : 'search';
	let RIcon 	= buttonRIcon&&buttonRIcon.length > 0 ? buttonRIcon : 'filter';
	let flo 	= dis == 'none' ? 'right' : '';
	
    return (
        <div className="tab-search-or-screening-btn-base" >
			<Button
				icon={LIcon}
				type="primary"
				onClick={searchEvent}
				style={{marginRight:10, display : dis,float: 'left'}}
			>
				{buttonLTitle&&buttonLTitle.length > 0 ? buttonLTitle : '搜索'}
			</Button>
			<Button
				icon={RIcon}
				type="primary"
				onClick={screeningEvent}
				style={{float: flo}}
			>
				{buttonRTitle&&buttonRTitle.length > 0 ? buttonRTitle : '筛选'}
			</Button>
        </div>
    );
}

export default TableSearchOrScreeningBtnComponent;
