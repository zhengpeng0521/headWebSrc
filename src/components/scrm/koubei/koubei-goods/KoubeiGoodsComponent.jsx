import React from 'react';
import styles from './KoubeiGoodsComponent.less';
import ManagerListMgr from '../../../common/manager-list/ManagerListMgr';
import KoubeiGoodsFormPage from '../../../../pages/scrm/koubei/goods/KoubeiGoodsFormPage';
import { Popconfirm, Popover } from 'antd';
import KoubeiGoodsShare from './KoubeiGoodsShareModal';
import KoubeiAuthValidateModal from '../../../../pages/scrm/koubei/common/KoubeiAuthValidateModal';

function KoubeiGoodsComponent ({
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
    onCreateClick,
    statusActive,
    onStatusTabChange,
    showSelectedOrgModal,

    onEditClick,updateGoodsStatus,onQrcodeShare,
    goodsType,
    effective_count,pause_count,invalid_count,

    shareVisible,shareOrgList,goodsShareBaseUrl,goodsShareUrl,shareGoodsId,shareMerchantPid,shareSelectOrg,onCloseQrcodeShare,changeShareSelectOrg,
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
                    key: 'id',
                    type: 'text',
                    placeholder: '商品编号',
                },
                {
                    key: 'status',
                    type: 'select',
                    placeholder: '商品状态',
                    options: [
                        {
                            key: '',
                            label: '全部',
                        },
                        {
                            key: 'EFFECTIVE',
                            label: '已上架',
                        },
                        {
                            key: 'PAUSE',
                            label: '已下架',
                        },
                        {
                            key: 'ORIGINAL',
                            label: '待上架',
                        },
                        {
                            key: 'FREEZE',
                            label: '冻结',
                        },
                        {
                            key: 'INVALID',
                            label: '失效',
                        },
                    ],
                }
            ],
        },
        table: {
            loading,
            rowKey: 'id',
            columns: [
                {
						title: '操作',
						key: 'operation',
						width: 90,
						render: (text, record) => (
							<div className={styles.table_opt_cont}>
								{(record.status == 'ORIGINAL' || record.status == 'INIT' || record.status == 'EFFECTIVE' || record.status == 'PAUSE' ) ?
								<div className={styles.opt_item} style={{width : '30%'}}>
									<a href="javascript:void(0);" onClick={()=>onEditClick(record.id)}>编辑</a>
								</div>
								: null }
								{(record.status == 'ORIGINAL' || record.status == 'EFFECTIVE' || record.status == 'PAUSE') ?
								<div className={styles.opt_item} style={{width : '30%'}}>
									<Popconfirm placement="left" title={record.status == 'EFFECTIVE'?"确认要下架吗?":record.status == 'PAUSE'?"确认要上架吗?":"确认要上架吗?"}
									    onConfirm={()=>updateGoodsStatus(record)} >
										<a href="javascript:void(0);" >{record.status == 'EFFECTIVE'?"下架":record.status == 'PAUSE'?"上架":"上架"}</a>
								    </Popconfirm>
								</div>
							  : null}

								{record.status == 'EFFECTIVE' ?
									<div className={styles.opt_item} style={{width : '30%'}}>
										<a href="javascript:void(0);" onClick={()=>onQrcodeShare(record.id)} >分享</a>
									</div>
								: null
								}
							</div>
							)
						},  {
				       		title: '口碑商品编号',
				        	dataIndex: 'outItemId',
				         	key: 'outItemId',
				         	width: 120,
		         		},
	         		{
	         			title: '课程信息',
	         			dataIndex: 'subject',
	         			key: 'subject',
	         			width: 200,
	         			render : function(text, record) {
	         				let course_cat = record.courseCat || '';
	         				let course_age = record.courseAge || '';
	         				let course_keshishu = record.courseHour || '';
                            let imgurl = (JSON.parse(record.cover)).imgurl;
	         				  return (
	         					<div className="table-item-info" title={'名称:' + record.subject }>
	         						<p className="table-item-info-item">名称: {record.subject}</p>
                                    <p className="table-item-info-item">
                                        <Popover placement="right" content={<span><img src={imgurl} height='70px' width='120px' style={{paddingTop:'5px'}}/></span>} >
                                            <a>查看封面</a>
                                        </Popover>
                                    </p>
	         					</div>
     						  );
	         			  }
	         		},{
	         			title: '现价',
	         			dataIndex: 'price',
	         			key: 'price',
	         			width: 80,
	         			render(text, record){
			         		return '￥' + record.price || 0;
	         			}
	         		},{
	         			title: '原价',
	         			dataIndex: 'originalPrice',
	         			key: 'originalPrice',
	         			width: 80,
	         			render(text, record){
			         		return record.originalPrice == undefined ? '-' : '￥' + record.originalPrice || 0;
	         			}
	         		},{
	         			title: '适用门店',
	         			dataIndex: 'shopnums',
	         			key: 'shopnums',
	         			width: 120,
	         			render(text, record){
		         			return (<a href="javascript:void(0);" onClick={()=>showSelectedOrgModal(record.id)}>口碑&nbsp;{text||0}家门店</a>);
	         			}
	         		},{
	         			title: '库存',
         				dataIndex: 'inventory',
         				key: 'inventory',
         				width: 50
	         		}, {
	         			title: '销量',
	         			dataIndex: 'sellNum',
	         			key: 'sellNum',
	         			width: 50,
	         			render : function(text, record) {
	         				return (text||0);
         			  	}
	         		}, {
	         			title: '口碑活动信息',
	         			dataIndex: 'activityInfo',
	         			key: 'activityInfo',
	         			width: 100,
	         			render : function(text, record) {
	         			let activityInfo = record.activityInfo;
	         				if(activityInfo) {
	         					return (
     							<div>
     								<p className="table-item-info-item">{activityInfo.name}</p>
     								<p className="table-item-info-item">活动价: ￥{activityInfo.activity_price||0}</p>
     								<p className="table-item-info-item">活动库存: {activityInfo.activity_stock}</p>
	         					</div>);
	         				} else {
	         					return '无';
	         				}
         			  	}
	         		}, {
	         			title: '发布时间',
	         			dataIndex: 'createTime',
	         			key: 'create_time',
	         			width: 120,
     					render : function(text, record) {
	         				return (<p className="table-item-info-item">{text||''}</p>);
         			  	}
	         		},{
	         			title: '排序值',
	         			dataIndex: 'weight',
	         			key: 'weight',
	         			width: 60,
	         		},{
	         			title: '状态',
	         			dataIndex: 'status',
	         			key: 'status',
	         			width: 100,
	         			render: (text, record, index) => (<div>
	         					<span className={record.status=='ORIGINAL' || record.status=='INIT' || record.status=='EFFECTIVE'  ?'status-enable-span':'status-disable-span'}>
	         						{record.status=='ORIGINAL' ? '待上架' :
         							record.status=='INIT' ? '待上架' :
     								record.status=='EFFECTIVE' ? '已上架' :
 									record.status=='PAUSE' ? '已下架' :
									record.status=='FREEZE' ? '已冻结' :
									record.status=='INVALID' ? '失效' :
	         						'无效的状态'}
	         					</span>
	         					<p className="table-item-info-item">上架时间:</p>
	         					<p className="table-item-info-item">{record.gmtStart}</p>
         					</div>
         					)
	         		}
            ],
            dataSource,
            emptyText: '没有商品记录',
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
                    label: goodsType == 'course' ? '新增课程' : '新增活动',
                    icon: 'plus',
                    handle: onCreateClick,
                },
            ]
        },
        statusTab: {
            tabs: [
                {
                    key: '1',
                    label: '已上架(' + effective_count + ')',
                },
                {
                    key: '2',
                    label: '未上架(' + pause_count + ')',
                },
                {
                    key: '3',
                    label: '失效/冻结(' + invalid_count + ')',
                },
            ],
            active: statusActive,
            onTabChange: onStatusTabChange,
        }
    };

    let shareProps = {
        visible: shareVisible,
        orgList: shareOrgList,
        goodsShareBaseUrl,
        goodsShareUrl,selectOrg: shareSelectOrg,
        onCloseClick: onCloseQrcodeShare,
        changeSelectOrg: changeShareSelectOrg,
    };

    return (
        <div className={styles.teaching_material_manage_cont} >
            <ManagerListMgr {...managerListProps} />

            <KoubeiGoodsFormPage />
            <KoubeiGoodsShare {...shareProps} />
            <KoubeiAuthValidateModal />
        </div>
    );
}


export default KoubeiGoodsComponent;
