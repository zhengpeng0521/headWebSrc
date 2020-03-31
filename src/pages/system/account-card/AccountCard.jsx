import React from 'react';
import { message , Pagination } from 'antd';
import { connect } from 'dva';
//import AccountCardComponent from '../../../components/system/account-card/AccountCardComponent';
import AccountCardForm from './AccountCardForm';
import AccountCardComponent from '../../../components/common/new-component/manager-list/ManagerList';
import styles from './AccountCard.less';

function AccountCard({dispatch, accountCardModel}) {

	let {
		newColumns,
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        selectedRows,

        showSearch,
        listOrgShow,
        record_org_select,
    } = accountCardModel;

	/*表格显示项*/
	function changeColumns( newColumns ){
		dispatch({
			type : 'accountCardModel/updateState',
			payload : {
				newColumns
			}
		})
	}

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'accountCardModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'accountCardModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'accountCardModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'accountCardModel/updateState',
            payload: {
                selectedRowKeys : selectedRowKeys,
                selectedRows : selectedRows,
            }
        });
    }

    /*点击批量删除*/
    function onBatchDelete() {
        if(!(selectedRowKeys &&  selectedRowKeys.length > 0)) {
            return message.warn('请先选择删除项');
        }
        let paymentKeys= [];            //每个支付方式的paymentKey数组
        let ids = [];                   //每个支付方式的id数组
        let paymentKeysAndIds = [];     //每个支付方式的paymentKey和id数组[{ id : xx , paymentKey : xx }]
        for(let i in selectedRows){
            paymentKeys.push(selectedRows[i].paymentKey);
            paymentKeysAndIds.push({
                id : selectedRows[i].id,
                paymentKey : selectedRows[i].paymentKey
            })
        }
        if(paymentKeys.indexOf('xianjin') > -1){
            message.warn('系统默认支付方式（现金）不可删除');
        }
        if(paymentKeys.indexOf('pos') > -1){
            message.warn('系统默认支付方式（pos）不可删除');
        }
        for(let i in paymentKeysAndIds){
            if(paymentKeysAndIds[i].paymentKey != 'xianjin' && paymentKeysAndIds[i].paymentKey != 'pos'){
                ids.push(paymentKeysAndIds[i].id)
            }
        }
        dispatch({
            type: 'accountCardModel/deleteBatch',
            payload: {
                ids: ids.join(',')
            }
        });
    }

    /*点击新增*/
    function onCreateClick() {
        dispatch({
            type: 'accountCardFormModel/showAccountCardForm',
        });
    }

    /*页码变更时触发事件*/
    function pageOnChange(pageIndex,pageSize) {
        dispatch({
            type: 'accountCardModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize
            }
        });
    }

    /*打开编辑界面*/
    function onEditClick(id) {
        dispatch({
            type : 'accountCardFormModel/showAccountCardForm',
            payload: {
                id,
            }
        });
    }

    //是否打开校区选择界面
    function closeListOrgShow(orgSelect) {
        dispatch({
            type: 'accountCardModel/closeListOrgShow',
        });
    }

    function showRecordOrgSelect(id) {
        dispatch({
            type: 'accountCardModel/showRecordOrgSelect',
            payload: { id }
        });
    }

	let accountCardComponentProps = {
		search : {},
        leftBars : {
            label : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '删除',
                    handle   : onBatchDelete,
                    confirm  : true,
                }
            ]
        },
        rightBars : {
            btns : [
                {
                    label    : '新增支付方式',
                    handle   : onCreateClick
                }
            ],
			isSuperSearch : false,
        },
        table : {
            height        : 332,
            NullDataHeight : document.body.clientHeight - 370,
            ProgressBarHeight : document.body.clientHeight - 370,
            loading       : loading,
            dataSource    : dataSource,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
				{
					key : 'paymentKeyName',
					title : '支付方式',
					dataIndex : 'paymentKeyName',
					width : 150,
					render: function(text, record, index) {
						return(
							<div>{text}</div>
						)
                    },
				},
                {
                    key       : 'name',
                    title     : '支付方式名称',
                    dataIndex : 'name',
                    width     : 150,
                    render    : ( text, record ) => {
                        if( record.paymentKey == 'pos' || record.paymentKey == 'xianjin' ){
                            return(
                                <span>{ text }</span>
                            )
                        }else{
                            return (
                                <a onClick={ () => onEditClick( record.id ) }>{ text }</a>
                            );
                        }
                    },
                },{
                    key       : 'acctNo',
                    title     : '账号/卡号',
                    dataIndex : 'acctNo',
                    width     : 200,
                },{
                    key       : 'rate',
                    title     : '费率',
                    dataIndex : 'rate',
                    render    : ( text, record ) => (
                        <div>{ !isNaN(text) ? (parseFloat(text + '') * 100).toFixed(3) + '%' : '无' }</div>
                    )
                }
            ],
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : onRowSelectChange,
            },
         },
	}

	return (
		<div className = { styles.all }>
			<AccountCardComponent { ...accountCardComponentProps } />
            <div className = { styles.pagination }>
                <Pagination
                    showSizeChanger
                    showQuickJumper
                    total = { total }
                    current = { !isNaN(pageIndex) ? pageIndex + 1 : 1 }
                    pageSize = { pageSize }
                    showTotal = {(total) => `共 ${total} 条`}
                    onChange = { pageOnChange }
                    onShowSizeChange = { pageOnChange }
					pageSizeOptions = {['20', '50', '100', '200']}
                />
            </div>
			<AccountCardForm />
		</div>
    );
}

function mapStateToProps({ accountCardModel }) {
  	return { accountCardModel };
}

export default connect(mapStateToProps)(AccountCard);
