import React, {PropTypes} from 'react';
import { connect } from 'dva';
import qs from 'qs';
import WxReservationMgrComponent from '../../../components/scrm/wx-reservation/WxReservationMgrComponent';

function WxReservationMgr({dispatch, wxReservationMgrModel}) {

	let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,
        query,
        showSearch,

        confirmVisible,confirmIds,confirmRemark,confirmOrgId,
    } = wxReservationMgrModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'wxReservationMgrModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'wxReservationMgrModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'wxReservationMgrModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'wxReservationMgrModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'wxReservationMgrModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'wxReservationMgrModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*切换状态选择*/
    function onStatusTabChange(statusActive) {
        dispatch({
            type: 'wxReservationMgrModel/queryList',
            payload: {
                statusActive: statusActive.target.value,
                pageIndex: 0,
            }
        });
    }

    function onExportClick() {
        window.excelExport('/reservationController/excelList', query);
    }

    function showConfirm(confirmIds, confirmOrgId, confirmRemark) {
        dispatch({
            type: 'wxReservationMgrModel/updateState',
            payload: {
                confirmIds, confirmOrgId, confirmRemark, confirmVisible: true,
            }
        });
    }

    function changeConfirmRemark(e) {
        let {target} = e;
        let value = target && target.value;
        dispatch({
            type: 'wxReservationMgrModel/updateState',
            payload: {
                confirmRemark: value,
            }
        });
    }

    function onCloseConfirm() {
        dispatch({
            type: 'wxReservationMgrModel/updateState',
            payload: {
                confirmIds: '',
                confirmRemark: '',confirmOrgId: '',
                confirmVisible: false,
            }
        });
    }

    function onUpdateRemark() {
        dispatch({
            type: 'wxReservationMgrModel/onUpdateRemark',
        });
    }

    function onConfirmClick(ids) {
        dispatch({
            type: 'wxReservationMgrModel/onConfirmClick',
            payload: {
                ids,
            }
        });
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
        onExportClick,
        showConfirm,

        confirmVisible,confirmIds,confirmOrgId,confirmRemark,onCloseConfirm,changeConfirmRemark,onConfirmClick,onUpdateRemark,
    };

    return (
        <WxReservationMgrComponent {...componProps} />
    );
}

WxReservationMgr.propTypes = {
	wxReservationMgrModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ wxReservationMgrModel }) {
  	return { wxReservationMgrModel };
}

export default connect(mapStateToProps)(WxReservationMgr);
