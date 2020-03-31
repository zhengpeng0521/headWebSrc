import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Icon, Popover, message } from 'antd';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';
import VacateManageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearchComponent from '../../../components/common/new-component/super-search/SuperSearch';
import VacateCheckForm from '../../../components/cerp/vacate-manage/VacateCheckForm';

function VacateManagePage({ dispatch, vacateManageModel }){
    let {

        commonSearchContent,        //快捷搜索内容

		/*高级搜索项*/
		searchVisible,
        superSearchContent,         //高级搜索内容

		/*表格项*/
		loading,
		dataSource,
		newColumns,
		resultCount,
		pageIndex,
		pageSize,
		selectedRows,
		selectedRowKeys,

		//审核表单
		visible,

		checkBtnLoading,

    } = vacateManageModel;

	//常用搜索 清除
	function searchFunction( values ){
		dispatch({
			type : 'vacateManageModel/searchFunction',
			payload : {
				commonSearchContent : values,      //常用搜索项
				superSearchContent                 //高级搜索项
			}
		})
	}

	//点击高级搜索按钮
	function superSearchClick(){
		dispatch({
			type : 'vacateManageModel/updateState',
			payload : { searchVisible : !searchVisible }
		})
	}

	//高级搜索 清除搜索条件
	function onSuperSearch( values ){
		if( !!values && !!values.createTime ){
			values.startDate = !!values.createTime[0] && moment(values.createTime[0]).format('YYYY-MM-DD') || undefined;
			values.endDate = !!values.createTime[1] && moment(values.createTime[1]).format('YYYY-MM-DD') || undefined;
			delete values.createTime;
		}
		dispatch({
			type : 'vacateManageModel/searchFunction',
			payload : {
				commonSearchContent,
				superSearchContent : values
			}
		})
	}

	//改变表格显示列
	function changeColumns( newColumns ){
		dispatch({
			type : 'vacateManageModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	//分页
	function pageChange( pageIndex, pageSize ){
		dispatch({
			type : 'vacateManageModel/pageChange',
			payload : {
				pageIndex, pageSize
			}
		})
	}

	//审核请假申请
	function checkVacateRecord(){
		dispatch({
			type : 'vacateManageModel/updateState',
			payload : {
				visible : true
			}
		})
	}

	//选择表格项
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'vacateManageModel/rowSelectChange',
			payload : {
				selectedRowKeys,
				selectedRows
			}
		})
	}

	//审核通过 或驳回
	function confirmCheckVacate( values, status ){
		dispatch({
			type : 'vacateManageModel/confirmCheckVacate',
			payload : {
				remark      : values.remark,
				auditStatus : status
			}
		})
	}

	//关闭审核窗口
	function cancelCheckVacate(){
		dispatch({
			type : 'vacateManageModel/updateState',
			payload : {
				visible : false
			}
		})
	}

	//高级搜索组件属性
	let superSearchComponentProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperSearch,
		fields        : [
			{
				key         : 'parentName',
				type        : 'input',
				label       : '申请家长',
				placeholder : '请输入申请家长姓名'
			},{
				key         : 'courseName',
				type        : 'input',
				label       : '课程名称',
				placeholder : '请选择课程'
			},{
				key              : 'createTime',
				type             : 'rangePicker',
				label            : '提交时间',
				startPlaceholder : '开始时间',
				endPlaceholder   : '结束时间',
				dateFormat       : 'YYYY-MM-DD'
			}
		]
	}

	//表格组件属性
	let VacateManageComponentProps = {
		search : {
			onSearch   : searchFunction,
            onClear    : searchFunction,
            fields     : [
				{ key : 'stuName', type : 'input' , placeholder : '请输入学员姓名搜索' },
				{ key : 'mobile', type : 'input', placeholder : '请输入手机号搜索' },
				{ key : 'auditStatus', type : 'select', placeholder : '请选择审核状态', options : [{ key : '1', label : '待审核' },{ key : '2', label : '已驳回' },{ key : '3', label : '已通过' },{ key : '4', label : '已失效' }] },
			]
		},
		leftBars : {
			label : '已选',
			labelNum : selectedRows.length,
			btns : [
				{
					label : '审核',
					handle : checkVacateRecord
				}
			]
		},
		rightBars : {
			isSuperSearch  : true,
			superSearch    : superSearchClick,
			superSearchVisible : searchVisible,
		},
		table : {
            loading       : loading,
            dataSource    : dataSource,
			newColumns    : newColumns,
			changeColumns : changeColumns,
			rowSelection  : {
                selectedRowKeys  : selectedRowKeys,
                onChange         : rowSelectChange,
				getCheckboxProps : record => ({
					disabled: record.auditStatus !== '1'
			    })
            },
            columns       : [
                {
					dataIndex : 'stuName',
					key       : 'name',
					title     : '学员姓名',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'parentName',
					key       : 'parentName',
					title     : '申请家长',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'mobile',
					key       : 'mobile',
					title     : '手机号',
					width     : 112
				},{
					dataIndex : 'courseName',
					key       : 'courseName',
					title     : '请假课程',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'time',
					key       : 'time',
					title     : '上课时间',
					width     : 160,
					render    : ( text, record ) => (
						<span>
							{ !!record.studyDate && !!record.studyTimeZone && ( record.studyDate + ' ' + record.studyTimeZone ) || '无' }
						</span>
					)
				},{
					dataIndex : 'reason',
					key       : 'reason',
					title     : '请假原因',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '无' } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'auditStatus',
					key       : 'auditStatus',
					title     : '状态',
					width     : 82,
					render    : ( text, record ) => (
						<span>{ text == '1' ? '待审核' : text == '2' ? '已驳回' : text == '3' ? '已通过' : text == '4' ? '已失效' : '无' }</span>
					)

				},{
					dataIndex : 'remark',
					key       : 'remark',
					title     : '处理结果',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '无' } trigger = 'hover' >
							{ text || '无' }
						</Popover>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '提交时间',
					width     : 160
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '无' } trigger = 'hover' >
							{ text || '无' }
						</Popover>
					)
				}
			]
		},
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `共 ${ total } 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageChange,
			onChange         : pageChange
		}
	}

	let vacateCheckFormProps = {
		visible,
		selectedRowKeys,

		checkBtnLoading,

		cancelCheckVacate,               //关闭审核窗口
		confirmCheckVacate,
	}

	return (
		<div style = {{ height : '100%', overflow : 'hidden' }} >
			<VacateManageComponent { ...VacateManageComponentProps } />
			<SuperSearchComponent { ...superSearchComponentProps } />
			<VacateCheckForm { ...vacateCheckFormProps } />
		</div>
	)
};

function mapStateToProps ({ vacateManageModel }){
	return { vacateManageModel };
};

export default connect( mapStateToProps )( VacateManagePage );
