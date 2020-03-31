import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import moment from 'moment';
import { exportFile } from '../../../utils/exportFile';
import FollowRecordSearch from '../../../components/crm/follow-record/FollowRecordSearch';
import FollowRecordContent from '../../../components/crm/follow-record/FollowRecordContent';
import FollowRecordCreate from './FollowRecordCreatePage';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';

function FollowRecordPage({ dispatch, followRecordModel }){
    let {
		searchVisible,

		pageIndex,
		pageSize,
		dataSource,
		resultCount,

		source,
		selectedId,
		selectedItem,

		/*方法*/
		reset,
        startTime,   //开始时间
		endTime,   //结束时间


    } = followRecordModel;

    //搜索
    function onSearch( values ){
		if( !!values && !!values.dept_org ){
			values.tenantIds = values.dept_org.split('-')[0];
			values.orgIds = values.dept_org.split('-')[1];
			values.orgId = values.dept_org.split('-')[1];
			delete values.dept_org;
		}
		dispatch({
			type : 'followRecordModel/searchFunction',
			payload : {
				values
			}
		})
    };

    //清除条件
    function onClear(){
		dispatch({
			type : 'followRecordModel/searchFunction',
			payload : {
				values : {
					name      : undefined,
					orgIds    : undefined,
					tenantIds : undefined
				}
			}
		})
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
		dispatch({
			type : 'followRecordModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
    };

	/*高级搜索点击事件*/
	function showSuperSearch(){
		dispatch({
			type : 'followRecordModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values, reset ){
		dispatch({
			type : 'followRecordModel/onSuperSearch',
			payload : {
				values
			}
		})
		dispatch({
			type : 'followRecordModel/updateState',
			payload : {
				reset : reset
			}
		})
	}

	/*高级搜索清除*/
	function onSuperClear(){
		dispatch({
			type : 'followRecordModel/onSuperSearch',
			payload : {
				values : {
					endTime   : undefined,
					startIime : undefined,
					// sourceType:undefined
				}
			}
		})
	}

	/*切换到leaders记录*/
	function clickToLeaders(){
		!!reset && reset();
		dispatch({
			type : 'followRecordModel/clickGetFollowRecordList',
			payload : {
				source : '2',
			}
		})
	}

	/*切换到学员记录*/
	function clickToStudent(){
		!!reset && reset();
		dispatch({
			type : 'followRecordModel/clickGetFollowRecordList',
			payload : {
				source : '1',
			}
		})
	}

	/*切换列表项*/
	function changeListItem( item ){
		dispatch({
			type : 'followRecordModel/updateState',
			payload : {
				selectedId : item.id,
				selectedItem : item
			}
		})
	}

	//导出跟进记录
	function exportFollowRecord(){
		let url = `${BASE_URL}/commRecordService/export?source=${source}`;
		!!exportFile && exportFile( url );
	}

    let FollowRecordSearchProps = {
		searchVisible,        //高级搜索是否显示
		source,

        clickToLeaders,
		clickToStudent,
		showSuperSearch,
		onSearch,
		onClear,

		exportFollowRecord,       //导出
    };

	let superSearchProps = {
		searchVisible  : searchVisible,
		closeSearch    : showSuperSearch,
		onSearch       : onSuperSearch,
		onClear        : onSuperClear,
		fields        : [
			{
				key     : 'time',
				type    : 'rangePicker',
				label   : '跟进时间',
				startPlaceholder : '开始时间' ,
				endPlaceholder : '结束时间',
				initialValue : [ startTime != undefined ? moment(startTime,'YYYY-MM-DD HH:mm') : undefined, endTime != undefined ? moment(endTime,'YYYY-MM-DD HH:mm') : undefined ],
			},
			{
				key         : 'sourceType',
				type        : 'select',
				label       : '学员类型',
				placeholder : '请选择学员类型',
				initialValue: '0',
				options : [
					{ key : '0' , label : '潜在学员' },
					{ key : '1' , label : '在读学员' },
					{ key : '2' , label : '往期学员' }
				]
			},
			{
				key         : 'collectName',
				type        : 'input',
				label       : '收集人',
				placeholder : '请输入收集人'
			}
		]
	}

	let followRecordContentProp = {
		dataSource,
		pageSize,
		pageIndex,
		resultCount,

		selectedId,
		selectedItem,

		pageIndexChange,
		changeListItem,

	}

    return (
        <div style = {{ height : '100%', overflowX : 'hidden' }}>
            <FollowRecordSearch { ...FollowRecordSearchProps } />
			<FollowRecordContent { ...followRecordContentProp } />
			<SuperSearch { ...superSearchProps } />
        </div>
    )
};

function mapStateToProps ({ followRecordModel }){
	return { followRecordModel };
};

export default connect( mapStateToProps )( FollowRecordPage );
