import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';
import VipManageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';

function VipManagePage({ dispatch, vipManageModel }){
    let {
		/*搜索项*/
        fastSearchContent,         //快捷搜索内容

		/*高级搜索项*/
		searchVisible,
        superSearchContent,         //高级搜索内容

		loading,
		dataSource,
		newColumns,
		resultCount,
		pageIndex,
		pageSize

    } = vipManageModel;

    /*改变表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'vipManageModel/updateState',
			payload : {
				newColumns : newColumns
			}
		})
	}

    //搜索
    function searchFunction( values ){
		if( !!values && values.dept_org ){
			values.tenantIds = values.dept_org.split('-')[0];
			values.orgIds = values.dept_org.split('-')[1];
			values.orgId = values.dept_org.split('-')[1];
			delete values.dept_org;
		}
		dispatch({
			type : 'vipManageModel/getVipList',
			payload : {
				pageIndex : 0,
				pageSize,
				fastSearchContent : values,
				superSearchContent
			}
		})
    };

    //改变分页
    function pageOnChange( pageIndex, pageSize ){
		dispatch({
			type : 'vipManageModel/getVipList',
			payload : {
				pageIndex : pageIndex - 1,
				pageSize,
				fastSearchContent,
				superSearchContent
			}
		})
    };

	/*高级搜索点击事件*/
	function superSearchClick(){
		dispatch({
			type : 'vipManageModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
		dispatch({
			type : 'vipManageModel/getVipList',
			payload : {
				pageIndex : 0,
				pageSize,
				fastSearchContent,
				superSearchContent : values,
			}
		})
	}

    let vipManageComponentProps = {
        search : {
            onSearch      : searchFunction,
            onClear       : searchFunction,
            fields        : [
				{ key : 'dept_org' , type : 'dept_org' },
				{ key : 'stuName' , type : 'input' , placeholder : '请输入学员姓名搜索' },
				{ key : 'mobile', type : 'input', placeholder : '请输入手机号搜索' },
			]
        },
		rightBars : {
			isSuperSearch : true,
			superSearch  : superSearchClick,
			superSearchVisible : searchVisible
		},

        table : {
            loading       : loading,
            dataSource    : dataSource,
			xScroll       : 1600,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
					dataIndex : 'id',
					key       : 'id',
					title     : '会员卡号',
					width     : '96px',
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'applicableStu',
					key       : 'applicableStu',
					title     : '适用学员',
					width     : '160px',
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
					width     : 150,
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
					dataIndex : 'periodAll',
					key       : 'periodAll',
					title     : '总课时(赠送)',
					width     : 110,
					render    : ( text, record ) => (
						<span>{ text + '（' + (record.periodExt || '0') + '）' }</span>
					)
				},{
					dataIndex : 'periodLeft',
					key       : 'periodLeft',
					title     : '剩余课时',
					width     : 96,
				},{
					dataIndex : 'periodAvailable',
					key       : 'periodAvailable',
					title     : '可用课时',
					width     : 96,
				},{
					dataIndex : 'periodForward',
					key       : 'periodForward',
					title     : '已预约课时',
					width     : 110,
				},{
					dataIndex : 'periodExpend',
					key       : 'periodExpend',
					title     : '已消耗课时',
					width     : 110,
				},{
					dataIndex : 'periodRefund',
					key       : 'periodRefund',
					title     : '已退课时',
					width     : 110,
				},
//                {
//					dataIndex : 'balance',
//					key       : 'balance',
//					title     : '余额',
//					width     : 96,
//				},
                {
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '创建时间',
					width     : 160,
				},{
					dataIndex : 'orgName',
					key       : 'orgName',
					title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				}
            ]

         },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `共 ${total} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageOnChange,
			onChange         : pageOnChange
		}
    };

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperSearch,
		fields        : [
			{
				key         : 'id' ,
				type        : 'input' ,
				label       : '会员卡号',
				placeholder : '请输入会员卡号'
			}
		]
	}

    return (
        <div style = {{ height : '100%', overflow : 'hidden' }}>
            <VipManageComponent { ...vipManageComponentProps } />
			<SuperSearch { ...superSearchProps } />
        </div>
    )
};

function mapStateToProps ({ vipManageModel }){
	return { vipManageModel };
};

export default connect( mapStateToProps )( VipManagePage );
