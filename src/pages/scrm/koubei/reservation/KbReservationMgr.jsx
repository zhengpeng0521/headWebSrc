import React, {PropTypes} from 'react';
import { connect } from 'dva';
import qs from 'qs';
import KbReservationMgrComponent from '../../../../components/scrm/koubei/reservation/KbReservationMgrComponent';

function KbReservationMgr({dispatch, kbReservationMgrModel}) {

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
    } = kbReservationMgrModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'kbReservationMgrModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'kbReservationMgrModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'kbReservationMgrModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'kbReservationMgrModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'kbReservationMgrModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'kbReservationMgrModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*切换状态选择*/
    function onStatusTabChange(statusActive) {
        dispatch({
            type: 'kbReservationMgrModel/queryList',
            payload: {
                statusActive: statusActive.target.value,
                pageIndex: 0,
            }
        });
    }

    function onExportClick() {
        window.open(BASE_URL+'/koubeiReservationController/excelList?' + qs.stringify(query), '_blank');
    }

    function showConfirm(confirmIds, confirmOrgId, confirmRemark) {
        dispatch({
            type: 'kbReservationMgrModel/updateState',
            payload: {
                confirmIds, confirmOrgId, confirmRemark, confirmVisible: true,
            }
        });
    }

    function changeConfirmRemark(e) {
        let {target} = e;
        let value = target && target.value;
        dispatch({
            type: 'kbReservationMgrModel/updateState',
            payload: {
                confirmRemark: value,
            }
        });
    }

    function onCloseConfirm() {
        dispatch({
            type: 'kbReservationMgrModel/updateState',
            payload: {
                confirmIds: '',
                confirmRemark: '',confirmOrgId: '',
                confirmVisible: false,
            }
        });
    }

    function onUpdateRemark() {
        dispatch({
            type: 'kbReservationMgrModel/onUpdateRemark',
        });
    }

    function onConfirmClick(ids) {
        dispatch({
            type: 'kbReservationMgrModel/onConfirmClick',
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
        <KbReservationMgrComponent {...componProps} />
    );
}

KbReservationMgr.propTypes = {
	kbReservationMgrModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ kbReservationMgrModel }) {
  	return { kbReservationMgrModel };
}

export default connect(mapStateToProps)(KbReservationMgr);
