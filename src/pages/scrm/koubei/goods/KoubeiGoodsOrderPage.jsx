import React, {PropTypes} from 'react';
import { connect } from 'dva';
import qs from 'qs';
import KoubeiGoodsOrderComponent from '../../../../components/scrm/koubei/koubei-goods/KoubeiGoodsOrderComponent';

function KoubeiGoodsOrderPage({dispatch, koubeiGoodsOrderModel}) {

	let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        query,
        showSearch,
        statusActive,
    } = koubeiGoodsOrderModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'koubeiGoodsOrderModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'koubeiGoodsOrderModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'koubeiGoodsOrderModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'koubeiGoodsOrderModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'koubeiGoodsOrderModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'koubeiGoodsOrderModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*切换状态选择*/
    function onStatusTabChange(statusActive) {
        dispatch({
            type: 'koubeiGoodsOrderModel/queryList',
            payload: {
                statusActive: statusActive.target.value,
                pageIndex: 0,
            }
        });
    }

    function onExportClick() {
        window.open(BASE_URL+'/purchaseController/exportPurchaseExcel?' + qs.stringify(query), '_blank');
    }

    let componProps = {
        table: {
            pageIndex,
            pageSize,
            total,
            loading,
            dataSource,
            selectedRowKeys,
            onRowSelectChange,
            onShowSizeChange,
            pageChange,
        },
        search: {
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
        },
        statusActive,onStatusTabChange,onExportClick,
    };

    return (
        <KoubeiGoodsOrderComponent {...componProps} />
    );
}

KoubeiGoodsOrderPage.propTypes = {
	koubeiGoodsOrderModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ koubeiGoodsOrderModel }) {
  	return { koubeiGoodsOrderModel };
}

export default connect(mapStateToProps)(KoubeiGoodsOrderPage);
