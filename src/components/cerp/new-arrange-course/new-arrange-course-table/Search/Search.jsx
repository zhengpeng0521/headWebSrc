import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import FastSearch from '../../../../common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../../common/new-component/super-search/SuperSearch';

function OrderClassSearch({
    /*快捷搜索*/
	FastSearchFunction,

	/*高级搜索*/
	superSearchVisible,
	SuperSearchOpenOrClose,
	SuperSearchFunction,

}){
	let fastSearchProps = {
		search : {
            onSearch  : FastSearchFunction,
            onClear   : FastSearchFunction,
            fields : [
                { key : 'dept_org' , type : 'dept_org' },
                { key : 'courseName' , type : 'input' , placeholder : '课程名称' },
                { key : 'mtName' , type : 'input' , placeholder : '主教' }
            ]
        },
		rightBars : {
			isSuperSearch      : true,
			superSearch        : SuperSearchOpenOrClose,
			superSearchVisible : superSearchVisible,
		}
	}

	let superSearchProps = {
		searchVisible : superSearchVisible,
		closeSearch : SuperSearchOpenOrClose,
		onSearch : SuperSearchFunction,
		onClear : SuperSearchFunction,
		fields : [{
            key         : 'roomName',
            type        : 'input',
            placeholder : ' 教室名称',
            label : '教室名称'
        },{
            key         : 'atName',
            type        : 'input',
            placeholder : ' 助教',
            label : '助教'
        }]
	}
	return(
		<div>
			<FastSearch { ...fastSearchProps } />
			<SuperSearch { ...superSearchProps } />
		</div>
	)
}

export default OrderClassSearch;
