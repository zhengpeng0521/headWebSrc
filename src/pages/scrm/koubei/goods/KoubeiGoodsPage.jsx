import React, {PropTypes} from 'react';
import { connect } from 'dva';
import KoubeiGoodsComponent from '../../../../components/scrm/koubei/koubei-goods/KoubeiGoodsComponent';

function KoubeiGoodsPage({dispatch, koubeiGoodsModel}) {

	let {
        pageIndex,
        pageSize,
        total,
        loading,
        dataSource,
        selectedRowKeys,

        showSearch,
        goodsType,
        statusActive,

        effective_count,pause_count,invalid_count,

        shareVisible,shareOrgList,goodsShareBaseUrl,goodsShareUrl,shareGoodsId,shareMerchantPid,shareSelectOrg,
    } = koubeiGoodsModel;

    /*点击搜索时*/
    function onSearch(query) {
        dispatch({
            type: 'koubeiGoodsModel/queryList',
            payload: {
                pageIndex: 0,
                query,
            }
        });
    }

    /*点击清除条件时*/
    function onClear() {
        dispatch({
            type: 'koubeiGoodsModel/queryList',
            payload: {
                pageIndex: 0,
                query: {},
            }
        });
    }

    /*点击筛选时 切换搜索栏显隐*/
    function onFilterClick() {
        dispatch({
            type: 'koubeiGoodsModel/changeShowSearch',
        });
    }

    /*选中数量变化*/
    function onRowSelectChange(selectedRowKeys, selectedRows) {
        dispatch({
            type: 'koubeiGoodsModel/updateState',
            payload: {
                selectedRowKeys: selectedRowKeys,
            }
        });
    }

    /*每页显示数量变化*/
    function onShowSizeChange(pageIndex, pageSize) {
        dispatch({
            type: 'koubeiGoodsModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
                pageSize,
            }
        });
    }

    /*点击批量删除*/
    function onBatchDelete() {
        if(!(selectedRowKeys && selectedRowKeys.length > 0)) {
            message.error('请先选择账号');
            return;
        }
        dispatch({
            type: 'koubeiGoodsModel/deleteBatch',
            payload: {
                ids: selectedRowKeys.join(',')
            }
        });
    }

    /*点击新增*/
    function onCreateClick() {
        dispatch({
            type: 'koubeiGoodsFormModel/show',
            payload: {
                goodsType
            }
        });
        dispatch({
            type: 'koubeiGoodsFormModel/updateState',
            payload: {
                freeOrTemplate : '1',           //默认是打开模板类型而不是自定义类型
                freeModalContent : [{title : undefined,key : '0',details :[{ value : undefined , key : '0-0'}]}],            //自定义模板数据
                freeSuppleModalContent : [{title : undefined,key : '0',details : [{ value : undefined , key : '0-0'}]}],      //补充数据
            }
        });
    }

    /*页码变更时触发事件*/
    function pageChange(pageIndex) {
        dispatch({
            type: 'koubeiGoodsModel/queryList',
            payload: {
                pageIndex: pageIndex-1,
            }
        });
    }

    /*打开编辑界面*/
    function onEditClick(goodsId) {
        dispatch({
            type: 'koubeiGoodsFormModel/show',
            payload: {
                goodsId,goodsType,
            }
        });
    }

    /*切换状态选择*/
    function onStatusTabChange(statusActive) {
        dispatch({
            type: 'koubeiGoodsModel/queryList',
            payload: {
                statusActive: statusActive.target.value,
            }
        });
    }

    function updateGoodsStatus(record) {
        let {id,status} = record;
        status = (status == 'EFFECTIVE'?"PAUSE":record.status == 'PAUSE'?"EFFECTIVE":"EFFECTIVE");
        dispatch({
            type: 'koubeiGoodsModel/updateGoodsStatus',
            payload: {
                goodsId: id,status,goodsType,
            }
        });
    }

    /*打开分享页面*/
    function onQrcodeShare(goodsId) {
        dispatch({
            type: 'koubeiGoodsModel/showQrcodeShare',
            payload: {
                goodsId,goodsType,
            }
        });
    }

    function onCloseQrcodeShare() {
        dispatch({
            type: 'koubeiGoodsModel/onCloseQrcodeShare',
        });
    }

    function changeShareSelectOrg(orgId) {
        dispatch({
            type: 'koubeiGoodsModel/changeShareSelectOrg',
            payload: {
                orgId,
            }
        });
    }

    function showSelectedOrgModal(record) {

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
        onBatchDelete,
        onCreateClick,showSelectedOrgModal,
        onEditClick,updateGoodsStatus,onQrcodeShare,
        goodsType,
        statusActive,onStatusTabChange,
        effective_count,pause_count,invalid_count,
        shareVisible,shareOrgList,goodsShareBaseUrl,goodsShareUrl,shareGoodsId,shareMerchantPid,shareSelectOrg,onCloseQrcodeShare,changeShareSelectOrg,
    };

    return (
        <KoubeiGoodsComponent {...componProps} />
    );
}

KoubeiGoodsPage.propTypes = {
	koubeiGoodsModel	: PropTypes.object,
  	dispatch	: PropTypes.func,
};

function mapStateToProps({ koubeiGoodsModel }) {
  	return { koubeiGoodsModel };
}

export default connect(mapStateToProps)(KoubeiGoodsPage);
