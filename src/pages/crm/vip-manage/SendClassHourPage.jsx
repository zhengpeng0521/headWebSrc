import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import SendClassHourComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import CheckSendClassModal from '../../../components/crm/vip-manage/vip-manage-modal/CheckSendClassModal';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';

function SendClassHourPage({ dispatch, sendClassHourModel }){
    let {

		/*常用搜索项*/
		purchaseId,
		cardId,
		status,

		/*高级搜索项*/
		searchVisible,
		orgId,
		creatorName,

		/*表格*/
		dataSource,
		loading,
		resultCount,
		pageSize,
		pageIndex,
		newColumns,
		selectedRowKeys,
		selectedRows,
		selectedRecordIds,

		chechClassVisible,
		checkClassBtnLoading,
		checkClassBtnFailLoading

    } = sendClassHourModel;

    //搜索
    function searchFunction( values ){
		dispatch({
			type : 'sendClassHourModel/searchFunction',
			payload : {
				values
			}
		})
    };

    //清除条件
    function clearFunction(){
		dispatch({
			type : 'sendClassHourModel/searchFunction',
			payload : {
				values : {
					purchaseId : undefined,
					cardId     : undefined,
					status     : undefined,
				}
			}
		})
    };

    //改变pageSize
    function pageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'sendClassHourModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
		dispatch({
			type : 'sendClassHourModel/pagination',
			payload : {
				pageIndex,
				pageSize
			}
		})
    };

	/*改变表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'sendClassHourModel/updateState',
			payload : {
				newColumns : newColumns
			}
		})
	}

	/*高级搜索点击事件*/
	function superSearchClick(){
		dispatch({
			type : 'sendClassHourModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
		dispatch({
			type : 'sendClassHourModel/onSuperSearch',
			payload : {
				values
			}
		})
	}

	/*高级搜索清除*/
	function onSuperClear(){
		dispatch({
			type : 'sendClassHourModel/onSuperSearch',
			payload : {
				values : {
					orgId       : undefined,
					creatorName : undefined,
				}
			}
		})
	}

	/*表格项选择*/
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'sendClassHourModel/rowSelectChange',
			payload : {
				selectedRowKeys,
				selectedRows
			}
		})
	}

	/*点击审核*/
	function checkClassHour(){
		dispatch({
			type : 'sendClassHourModel/updateState',
			payload : {
				chechClassVisible : true
			}
		})
	}

	/*审核通过*/
	function confirmSendClass(){
		let recordIds = selectedRecordIds.join(',');
		dispatch({
			type : 'sendClassHourModel/checkSendClass',
			payload : {
				recordIds,
				status : '1'
			}
		})
	}

	/*审核不通过*/
	function cancelSendClass(){
		let recordIds = selectedRecordIds.join(',');
		dispatch({
			type : 'sendClassHourModel/checkSendClass',
			payload : {
				recordIds,
				status : '2'
			}
		})
	}

	function closeSendClass(){
		dispatch({
			type : 'sendClassHourModel/updateState',
			payload : {
				chechClassVisible : false
			}
		})
	}

    let sendClassHourComponentProps = {
        search : {
            onSearch      : searchFunction,
            onClear       : clearFunction,
            fields : [
				{
					key         : 'orderNum',
					type        : 'input',
					placeholder : '合同编号',
					render      : ( text, record ) => (
						<a>{ text }</a>
					)
				},{
					key         : 'cardId',
					type        : 'input',
					placeholder : '会员卡号',
				},{
					key         : 'status',
					type        : 'select',
					placeholder : '状态',
					options     : [
						{ key : '0', label : '待审核' },
						{ key : '1', label : '已通过' },
						{ key : '2', label : '已驳回' },
					]
				}
            ]
        },
		leftBars : {
			label : '已选',
			labelNum : selectedRowKeys.length,
			btns : [
				{
					label : '审核',
					handle : checkClassHour,
				}
			]
		},
		rightBars : {
			isSuperSearch : true,
			superSearch   : superSearchClick,
			superSearvhVisible : searchVisible,
		},
        table : {
            loading       : loading,
			xScroll       : 826,
            dataSource    : dataSource,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '合同编号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'cardId',
					key       : 'cardId',
					title     : '会员卡号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'periodNum',
					key       : 'periodNum',
					title     : '课时数量',
					width     : 96,
				},{
					dataIndex : 'extPeriodMoney',
					key       : 'extPeriodMoney',
					title     : '赠课成本',
					width     : 96,
				},{
					dataIndex : 'extPeriodReason',
					key       : 'extPeriodReason',
					title     : '赠课原因',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'status',
					key       : 'status',
					title     : '状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { text == '0' ? 'red' : text == '2' ? 'deep_red' : '' }>{ text == '0' ? '待审核' : text == '1' ? '已通过' : text == '2' ? '已驳回' : '' }</StatusFlag>
					)
				},{
					dataIndex : 'creatorName',
					key       : 'creatorName',
					title     : '创建人',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
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
							{ text }
						</Popover>
					)
				}
            ],
			rowSelection : {
				selectedRowKeys  : selectedRowKeys,
				onChange         : rowSelectChange,
				getCheckboxProps : record => ({
					disabled : record.status === '1' || record.status == '2',
				}),
            },
         },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `总共 ${total} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageSizeChange,
			onChange         : pageIndexChange
		}
    };

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'creatorName',
				type        : 'input',
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

	let checkSendClassModalProps = {
		chechClassVisible,
		selectedRowKeys,

		checkClassBtnLoading,
		checkClassBtnFailLoading,

		confirmSendClass,
		cancelSendClass,
		closeSendClass,

	}

    return (
        <div style = {{ height : '100%', overflowX : 'hidden' }} >
            <SendClassHourComponent { ...sendClassHourComponentProps } />
			<SuperSearch { ...superSearchProps } />
			<CheckSendClassModal { ...checkSendClassModalProps } />
        </div>
    )
};

function mapStateToProps ({ sendClassHourModel }){
	return { sendClassHourModel };
};

export default connect( mapStateToProps )( SendClassHourPage );
