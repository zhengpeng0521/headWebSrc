import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import OrderClassSearchComponent from '../../common/new-component/manager-list/ManagerList';
import SuperSearch from '../../common/new-component/super-search/SuperSearch';

function OrderClassSearch({
	searchFunction,
	clearFunction,

	courseList,
	classRoomList,
	studentList,
	teacherList,

	/*高级搜索*/
	searchVisible,
	superSearchClick,
	onSuperSearch,
	onSuperClear

}){
	let orderClassSearchComponentProps = {
		search : {
            onSearch  : searchFunction,
            onClear   : clearFunction,
            fields : [
                {   key : 'dept_org' ,
                    type : 'dept_org'
                },{
					key         : 'courseId',
					type        : 'select',
					placeholder : '课程名称',
					options     : courseList,
					opt_key     : 'id',
					opt_label   : 'title',
				},{
					key         : 'isfull',
					type        : 'select',
					placeholder : '是否满班',
					options     : [
						{ key : '0', label : '否' },
						{ key : '1', label : '是' }
					]
				}
            ]
        },
		rightBars : {
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
		}
	}

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'roomId',
				type        : 'select',
				placeholder : '教室名称',
                label       : '教室名称',
				options     : classRoomList,
				opt_key     : 'id',
				opt_label   : 'name',
			},{
				key         : 'mtid',
				type        : 'select',
				placeholder : '主教',
				label       : '主教',
				options     : teacherList,
				opt_key     : 'id',
				opt_label   : 'name',
			},{
				key         : 'stuId',
				type        : 'select',
				placeholder : '学员',
				label       : '学员',
				options     : studentList,
				opt_key     : 'stuId',
				opt_label   : 'stuName'
			},{
				key         : 'tryStuId',
				type        : 'select',
				placeholder : '试听学员',
				label       : '试听学员',
				options     : studentList,
				opt_key     : 'stuId',
				opt_label   : 'stuName'
			},{
				key         : 'tryLeadsName',
				type        : 'input',
				placeholder : ' 试听名单',
				label       : ' 试听名单',
			}
		]
	}
	return(
		<div>
			<OrderClassSearchComponent { ...orderClassSearchComponentProps } />
			<SuperSearch { ...superSearchProps } />
		</div>
	)
}

export default OrderClassSearch;
