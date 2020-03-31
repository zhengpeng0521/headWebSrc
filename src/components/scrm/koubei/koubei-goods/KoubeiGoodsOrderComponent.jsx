import React from 'react';
import styles from './KoubeiGoodsOrderComponent.less';
import ManagerListMgr from '../../../common/manager-list/ManagerListMgr';
import KoubeiAuthValidateModal from '../../../../pages/scrm/koubei/common/KoubeiAuthValidateModal';

function KoubeiGoodsOrderComponent ({
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

    let managerListProps = {
        search: {
            searchAble: true,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'purchaseId',
                    type: 'text',
                    placeholder: '商品订单编号',
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
	         			dataIndex: 'itemList',
	         			key: 'itemList',
	         			width: 200,
	         			render : function(text, record) {
	         				let itemListCont = [];
	         				record.itemList && record.itemList.length>0 && record.itemList.map(function(item) {
	         					itemListCont.push(<p className="table-item-info-item">{item||''}</p>);
     						});
	         				  return (
	         					<div className="table-item-info">
	         						{itemListCont}
	         					</div>
     						  );
	         			  }
	         		},{
	         			title: '数量',
	         			dataIndex: 'price',
	         			key: 'price',
	         			width: 100,
	         			render(text, record){
			         		return record.itemList ? record.itemList.length : 0;
	         			}
	         		},{
	         			title: '金额',
	         			dataIndex: 'realAmount',
	         			key: 'realAmount',
	         			width: 100,
	         		},{
	         			title: '订单状态',
	         			dataIndex: 'status',
	         			key: 'status',
	         			width: 100,
	         			render: (text, record, index) => (
	         					<span className={record.status=='PAY' || record.status=='FINISH' ?'status-enable-span':'status-disable-span'}>
	         						{record.status=='UNPAY' ? '待支付' :
         							record.status=='PAY' ? '已支付' :
     								record.status=='FINISH' ? '已完成 ' :
 									record.status=='CLOSE' ? '已关闭' :
									record.status=='SETTLE' ? '已核销' :
									record.status=='REFUND' ? '已退款' :
	         						'无效的状态'}
	         					</span>
         					)
	         		},{
	         			title: '下单时间',
	         			dataIndex: 'gmtCreate',
	         			key: 'gmt_create',
	         			width: 150,
	         		},{
	         			title: '创建时间',
	         			dataIndex: 'createTime',
	         			key: 'create_time',
	         			width: 150,
	         		}, {
	         			title: '订单来源',
	         			dataIndex: 'orderSrc',
	         			key: 'orderSrc',
	         			width: 200,
	         			render(text, record){
	         				let orderSrcText = record.orderSrc == '0' ? '闪闪早教' :
		         				record.orderSrc == '1' ? '支付宝口碑' :
		         				'未知的来源';
	         				let orderSrcDetail = '';
	         				if(record.orderSrc == '1') {
	         					if(record.shop && record.shop.length > 0) {
	         						let shop = JSON.parse(record.shop) || {};
	         						orderSrcDetail = shop.shop_name || ''
	         					}
	         				}
			         		return (
	         					<div className="table-item-info">
	         						<p className="table-item-info-item">{orderSrcText}</p>
	         						<p className="table-item-info-item">{orderSrcDetail}</p>
	         					</div>
     						  );
	         			}
	         		},{
	         			title: '商品状态',
	         			dataIndex: 'PAY',
	         			key: 'PAY',
	         			width: 100,
	         			render(text, record){
	         				let pay = record.PAY || 0;//已支付
	         				let refund = record.REFUND || 0;//已退款
	         				let settle = record.SETTLE || 0;//已核销
	         				let unpay = record.UNPAY || 0; //待付款

		         			return (<div className="table-item-info">
					         			{unpay > 0 ? <p className="table-item-info-item">待付款 x{unpay}</p> : null}
					         			{pay > 0 ? <p className="table-item-info-item">已支付 x{pay}</p> : null}
					         			{settle > 0 ? <p className="table-item-info-item">已核销 x{settle}</p> : null}
					         			{refund > 0 ? <p className="table-item-info-item">已退款x{refund}</p> : null}
			     					</div>);
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
                    key: 'PAY',
                    label: '已付款',
                },
                {
                    key: 'UNPAY',
                    label: '待付款',
                },
                {
                    key: 'FINISH',
                    label: '已完结',
                },
                {
                    key: 'CLOSE',
                    label: '已关闭',
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


export default KoubeiGoodsOrderComponent;
