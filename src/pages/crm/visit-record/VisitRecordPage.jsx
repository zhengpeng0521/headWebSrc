import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import VisitRecordSearch from '../../../components/crm/visit-record/VisitRecordSearch';
import VisitRecordContent from '../../../components/crm/visit-record/VisitRecordContent';
import VisitRecordCreatePage from './VisitRecordCreatePage';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';

function VisitRecordPage({ dispatch, visitRecordModel }){
    let {
		searchVisible,

		pageSize,
		pageIndex,
		dataSource,
		resultCount,

		selectedId,
		selectedItem,

		source,
		condition,

		/*方法*/
		reset,

    } = visitRecordModel;

    //搜索
    function onSearch( values ){
		if( !!values && !!values.dept_org ){
			values.tenantIds = values.dept_org.split('-')[0];
			values.orgIds = values.dept_org.split('-')[1];
			values.orgId = values.dept_org.split('-')[1];
			delete values.dept_org;
		}
		dispatch({
			type : 'visitRecordModel/searchFunction',
			payload : {
				values
			}
		})
    };

    //清除条件
    function onClear(){
		dispatch({
			type : 'visitRecordModel/searchFunction',
			payload : {
				values : {
					orgIds    : undefined,
					tenantIds : undefined,
					stuName   : undefined
				}
			}
		})
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
		dispatch({
			type : 'visitRecordModel/pagination',
			payload : {
				pageIndex,
			}
		})
    };

	/*高级搜索点击事件*/
	function showSuperSearch(){
		dispatch({
			type : 'visitRecordModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values, reset ){
		dispatch({
			type : 'visitRecordModel/onSuperSearch',
			payload : {
				values
			}
		})
		dispatch({
			type : 'visitRecordModel/updateState',
			payload : {
				reset : reset
			}
		})
	}

	/*高级搜索清除*/
	function onSuperClear(){
		dispatch({
			type : 'visitRecordModel/onSuperSearch',
			payload : {
				values : {
					uidName        : undefined,
					startVisitTime : undefined,
					endVisitTime   : undefined
				}
			}
		})
	}

	/*切换到leaders记录*/
	function clickToLeaders(){
		!!reset && reset();
		dispatch({
			type : 'visitRecordModel/clickGetFollowRecordList',
			payload : {
				source : '2',
			}
		})
	}

	/*切换到学员记录*/
	function clickToStudent(){
		!!reset && reset();
		dispatch({
			type : 'visitRecordModel/clickGetFollowRecordList',
			payload : {
				source : '1',
			}
		})
	}

	/*切换列表项*/
	function changeListItem( item ){
		dispatch({
			type : 'visitRecordModel/updateState',
			payload : {
				selectedId   : item.id,
				selectedItem : item
			}
		})
	}

	let FollowRecordSearchProps = {
		searchVisible,        //高级搜索是否显示
		source,

        clickToLeaders,
		clickToStudent,
		showSuperSearch,
		onSearch,
		onClear,

    };

	let superSearchProps = {
		searchVisible  : searchVisible,
		closeSearch    : showSuperSearch,
		onSearch       : onSuperSearch,
		onClear        : onSuperClear,
		fields        : [
			{
				key     : 'uidName',
				type    : 'input',
				label   : '跟进人',
                placeholder : '跟进人' ,
			},{
				key     : 'time',
				type    : 'rangePicker',
				label   : '到访时间',
				startPlaceholder : '开始时间' ,
				endPlaceholder : '结束时间' ,
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
            <VisitRecordSearch { ...FollowRecordSearchProps } />
			<VisitRecordContent { ...followRecordContentProp } />
			<SuperSearch { ...superSearchProps } />
        </div>
    )
};

function mapStateToProps ({ visitRecordModel }){
	return { visitRecordModel };
};

export default connect( mapStateToProps )( VisitRecordPage );
