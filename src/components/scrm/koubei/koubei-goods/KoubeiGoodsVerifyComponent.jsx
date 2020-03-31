import React from 'react';
import styles from './KoubeiGoodsOrderComponent.less';
import ManagerListMgr from '../../../common/manager-list/ManagerListMgr';
import KoubeiAuthValidateModal from '../../../../pages/scrm/koubei/common/KoubeiAuthValidateModal';
import {Modal} from 'antd';

function KoubeiGoodsVerifyComponent ({
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
    statusActive,
    onStatusTabChange,

}) {

    function showMessage(message) {
        Modal.warning({
            title: '退款原因',
            content: message,
        });
    }

    let managerListProps = {
        search: {
            searchAble: true,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'orderNo',
                    type: 'text',
                    placeholder: '商品核销编号',
                },
            ],
        },
        table: {
            loading,
            rowKey: 'id',
            columns: [
                {
			       		title: '支付宝交易号',
			        	dataIndex: 'transNo',
			         	key: 'transNo',
			         	width: 280,
	         		},
					{
			       		title: '口碑订单编号',
			        	dataIndex: 'outBizNo',
			         	key: 'outBizNo',
			         	width: 280,
	         		},
	         		{
	         			title: '商品信息',
	         			dataIndex: 'subject',
	         			key: 'subject',
	         			width: 200,
	         		},
	         		{
	         			title: '验证状态',
	         			dataIndex: 'status',
	         			key: 'status',
	         			width: 100,
	         			render: (text, record, index) => (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">
		         						<span className={record.status=='PAY' || record.status=='SETTLE' ?'status-enable-span':'status-disable-span'}>
			         						{record.status=='UNPAY' ? '待支付' :
		         							record.status=='PAY' ? '待核销' :
		     								record.status=='SETTLE' ? '已核销 ' :
		 									record.status=='REFUND' ? '已退款' :
			         						'无效的状态'}
			         					</span>
	         						</p>
	         						{record.status=='REFUND' ?
         								<p className="table-item-info-item">
	         								<a href="javascript:void(0)" onClick={()=>showMessage(record.memo||'无')}>查看原因</a>
	         							</p>
	         						: null}
	         					</div>
         					)
	         		},
	         		{
	         			title: '变更时间',
	         			dataIndex: 'createTime',
	         			key: 'createTime',
	         			width: 200,
	         			render(text, record){

			         		return (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">创建时间:{record.createTime}</p>
	         						{record.status != 'UNPAY' ?
         								<p className="table-item-info-item">
	         							{record.status == 'PAY' ? '付款时间:' :
	         								record.status == 'SETTLE' ? '核销时间:' :
	     									record.status == 'REFUND' ? '退款时间:' : '修改时间'}
	         							{record.modifyTime}</p>
	         						:null}
	         					</div>
     						  );
	         			}
	         		},{
	         			title: '购买门店',
	         			dataIndex: 'buyOrgName',
	         			key: 'buyOrgName',
	         			width: 150
	         		},{
	         			title: '核销门店',
	         			dataIndex: 'settleOrgName',
	         			key: 'settleOrgName',
	         			width: 150
	         		},{
	         			title: '适用门店',
	         			dataIndex: 'shopnum',
	         			key: 'shopnum',
	         			width: 150,
	         			render(text, record){
		         			return (<a href="javascript:void(0);" onClick={()=>showSelectedOrgModal(record.goodsid)} >口碑&nbsp;{text||0}家门店</a>);
	         			}
	         		},{
	         			title: '来源',
	         			dataIndex: 'orderSrc',
	         			key: 'orderSrc',
	         			width: 100,
	         			render(text, record){
	         				return text == '0' ? '闪闪早教' : text == '1' ? '支付宝口碑' : '未知的来源';
	         			}
	         		}
            ],
            dataSource,
            emptyText: '没有商品订单记录',
            rowSelection: {
                type: 'checkbox',
                selectedRowKeys,
                onChange: onRowSelectChange,
            },
            pagination: {
                total,
                pageIndex,
                pageSize,
                onShowSizeChange,
                onChange: pageChange,
            }
        },
        rightBars: {
            label: '',
            btns: [
                {
                    type: 'btn',
                    label: '按查询结果导出',
                    icon: 'plus',
                    handle: onExportClick,
                },
            ]
        },
        statusTab: {
            tabs: [
                {
                    key: 'ALL',
                    label: '全部',
                },
                {
                    key: 'SETTLE',
                    label: '已核销',
                },
                {
                    key: 'PAY',
                    label: '待核销',
                },
                {
                    key: 'REFUND',
                    label: '已退款',
                },
            ],
            active: statusActive,
            onTabChange: onStatusTabChange,
        }
    };

    return (
        <div className={styles.teaching_material_manage_cont} >
            <ManagerListMgr {...managerListProps} />
            <KoubeiAuthValidateModal />
        </div>
    );
}


export default KoubeiGoodsVerifyComponent;
