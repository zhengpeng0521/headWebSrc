import React, {PropTypes} from 'react';
import { connect } from 'dva';
import qs from 'qs';
import KoubeiGoodsVerifyComponent from '../../../../components/scrm/koubei/koubei-goods/KoubeiGoodsVerifyComponent';

function KoubeiGoodsVerifyPage({dispatch, koubeiGoodsVerifyModel}) {

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
    } = koubeiGoodsVerifyModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'koubeiGoodsVerifyModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'koubeiGoodsVerifyModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'koubeiGoodsVerifyModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'koubeiGoodsVerifyModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'koubeiGoodsVerifyModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'koubeiGoodsVerifyModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*切换状态选择*/
    function onStatusTabChange(statusActive) {
        dispatch({
            type: 'koubeiGoodsVerifyModel/queryList',
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
        <KoubeiGoodsVerifyComponent {...componProps} />
    );
}

KoubeiGoodsVerifyPage.propTypes = {
	koubeiGoodsVerifyModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ koubeiGoodsVerifyModel }) {
  	return { koubeiGoodsVerifyModel };
}

export default connect(mapStateToProps)(KoubeiGoodsVerifyPage);
