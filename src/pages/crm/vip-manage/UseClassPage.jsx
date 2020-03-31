import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, message } from 'antd';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';
import UseClassComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearchComponent from '../../../components/common/new-component/super-search/SuperSearch';
import AddUseClassPage      from './AddUseClassPage';

function UseClassPage({ dispatch, useClassModel }){
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

    } = useClassModel;

	//常用搜索 清除
	function searchFunction( values ){
		dispatch({
			type : 'useClassModel/searchFunction',
			payload : {
				commonSearchContent : values,      //常用搜索项
				superSearchContent                 //高级搜索项
			}
		})
	}

	//点击高级搜索按钮
	function superSearchClick(){
		dispatch({
			type : 'useClassModel/updateState',
			payload : { searchVisible : !searchVisible }
		})
	}

	//高级搜索 清除搜索条件
	function onSuperSearch( values ){
		dispatch({
			type : 'useClassModel/searchFunction',
			payload : {
				commonSearchContent,
				superSearchContent : values
			}
		})
	}

	//新增消课记录 ( 打开新增模态框 )
	function addUseClassFunc(){
		dispatch({
			type : 'addUseClassModel/openAddUseClassModal'
		})
	}

	//改变表格显示列
	function changeColumns( newColumns ){
		dispatch({
			type : 'useClassModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	//分页
	function pageChange( pageIndex, pageSize ){
		dispatch({
			type : 'useClassModel/pageChange',
			payload : {
				pageIndex, pageSize
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
				key         : 'cardId' ,
				type        : 'input' ,
				label       : '会员卡号',
				placeholder : '请输入会员卡号'
			},{
				key         : 'userName' ,
				type        : 'input' ,
				label       : '创建人',
				placeholder : '请输入创建人'
			},{
				key         : 'orgId',
				type        : 'orgSelect',
				label       : '所属校区',
				options     : {
					width : 280,
					getPopupContainer : () => document.getElementById( 'super_search_wrap' )
				}
			}
		]
	}

	//表格组件属性
	let useClassComponentProps = {
		search : {
			onSearch   : searchFunction,
            onClear    : searchFunction,
            fields     : [
				{ key : 'stuName', type : 'input' , placeholder : '请输入学员姓名搜索' },
				{ key : 'parentName', type : 'input' , placeholder : '请输入家长姓名搜索' },
				{ key : 'mobile', type : 'input', placeholder : '请输入手机号搜索' },
			]
		},
		rightBars : {
			btns : [
               	{
					label  : '新增消课',
					handle : addUseClassFunc
				}
			],
			isSuperSearch  : true,
			superSearch    : superSearchClick,
			superSearchVisible : searchVisible,
		},
		table : {
            loading       : loading,
            dataSource    : dataSource,
//			xScroll       : ,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns       : [
                {
					dataIndex : 'cardId',
					key       : 'cardId',
					title     : '会员卡号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'applicableStu',
					key       : 'applicableStu',
					title     : '适用学员',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = {
							<span>
								{ !!text && text.map( (item, index) => {
									return <span key = { 'applicableStu' + index } style = {{ marginRight : '10px' }}>{ item.stuName }</span>
								}) }
							</span> } trigger = 'click' >
							<span style = {{ marginRight : '10px' }}>
								{ !!text && !!text[0] && text[0].stuName }
							</span>
							{ text && text.length > 1 &&
								<a>{ '共' + text.length + '人' }</a>
							}
						</Popover>
					)
				},{
					dataIndex : 'applicableParent',
					key       : 'applicableParent',
					title     : '适用家长',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = "top" content = {
							<span>
								{ !!text && text.map( (item, index) => {
									return <span key = { 'applicableParent' + index } style = {{ marginRight : '10px' }}>{ item.name }</span>
								}) }
							</span> } trigger = 'click' >
							<span style = {{ marginRight : '10px' }}>
								{ !!text && !!text[0] && text[0].name }
							</span>
							{ text && text.length > 1 &&
								<a>{ '共' + text.length + '人' }</a>
							}
						</Popover>
					)
				},{
					dataIndex : 'mobile',
					key       : 'mobile',
					title     : '手机号',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = {
							<span>
								{ !!record.applicableParent && record.applicableParent.map( (item, index) => {
									return <span key = { 'mobile' + index } style = {{ marginRight : record.applicableParent.length > 1 && index != record.applicableParent.length - 1 ? 10 : 0 }}>{ (item.name || '--') + ' : ' + (item.mobile || '--') }</span>
								}) }
							</span> } trigger = 'click' >
							<a>查看</a>
						</Popover>
					)
				},{
					dataIndex : 'courseName',
					key       : 'courseName',
					title     : '消课课程',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '无' } trigger = 'hover' >
							{ text || '无' }
						</Popover>
					)
				},{
					dataIndex : 'courseNum',
					key       : 'courseNum',
					title     : '消课数量',
					width     : 96,
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '消课日期',
					width     : 160
				},{
					dataIndex : 'reason',
					key       : 'reason',
					title     : '消课原因',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '无' } trigger = 'hover' >
							{ text || '无' }
						</Popover>
					)
				},{
					dataIndex : 'userName',
					key       : 'userName',
					title     : '创建人',
					width     : 82
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

	return (
		<div style = {{ height : '100%', overflow : 'hidden' }} >
			<SuperSearchComponent { ...superSearchComponentProps } />
			<UseClassComponent { ...useClassComponentProps } />
			<AddUseClassPage />
		</div>
	)
};

function mapStateToProps ({ useClassModel }){
	return { useClassModel };
};

export default connect( mapStateToProps )( UseClassPage );
