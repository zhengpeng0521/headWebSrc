import React from 'react';
import styles from './KbReservationMgrComponent.less';
import ManagerListMgr from '../../../common/manager-list/ManagerListMgr';
import {Modal,Input,message,Popconfirm,} from 'antd';

function KbReservationMgrComponent ({
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

    confirmVisible,confirmIds,confirmRemark,changeConfirmRemark,onCloseConfirm,onConfirmClick,onUpdateRemark,
}) {

    function batchConfirmClick() {
        if(selectedRowKeys && selectedRowKeys.length > 0) {
            onConfirmClick(selectedRowKeys.join(','));
        } else {
            message.warn('请至少选择一条预约');
        }
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
                    key: 'searchOrgId',
                    type: 'orgSelect',
                    placeholder: '校区',
                },
                {
                    key: 'tel',
                    type: 'text',
                    placeholder: '联系电话',
                },
                {
                    key: 'status',
                    type: 'select',
                    placeholder: '预约状态',
                    options: [
                        {
                            key: '',
                            label: '全部',
                        },
                        {
                            key: '0',
                            label: '未处理',
                        },
                        {
                            key: '1',
                            label: '已处理',
                        }
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
                  dataIndex: 'handle',
                  width : 80,
                  render:(text,record)=>(
                      <Popconfirm title="确定要确认处理吗?" onConfirm={()=>onConfirmClick(record.id+'')} okText="确认" cancelText="取消">
                          <div className={styles.remark_href} >确认处理</div>
                      </Popconfirm>
                   ),
                },
                {
                  title: '编号',
                  dataIndex: 'id',
                  width : 80
                }, {
                    title: '状态',
                    dataIndex: 'status',
                    render:(text,record)=>(
                        <span>{text == '1' ?
                            <span style={{'color' : '#008000'}}>已处理</span>
                        :
                            <span style={{'color' : '#ff0000'}}>未处理</span>}
                        </span>
                    ),
                      width : 80
                }, {
                    title: '所属门店',
                    dataIndex: 'orgName',
                      width : 150
                }, {
                    title: '宝宝姓名',
                    dataIndex: 'childName',
                      width : 100
                }, {
                    title: '宝宝性别',
                    dataIndex: 'sex',
                    width : 50,
                    render:(text, record)=>{
                        if(text=="1"){
                            return <span>男</span>
                        } else if(text=="2"){
                            return <span>女</span>
                        } else {
                            return <span>男</span>
                        }
                    },
                }, {
                    title: '宝宝生日',
                    dataIndex: 'childBirthday',
                      width : 100
                }, {
                    title: '详细地址',
                    dataIndex: 'addr',
                    width : 150,
                    render:(text, record)=>{
                        return (record.province || '') + (record.city || '') + (record.area || '') + (record.addr || '');
                    },
                },{
                    title: '联系电话',
                    dataIndex: 'tel',
                      width : 100
                }, {
                    title: '备注',
                    dataIndex: 'remark',
                    width : 150,
                    render:(text, record)=>{
                        return (
                        <div className={styles.remark_href} onClick={()=>showConfirm(record.id, record.orgId, record.remark)}>
                            {text || '修改备注'}
                        </div>);
                    },
                }, {
                    title: '来源',
                    dataIndex: 'src',
                    render:(text, record)=>{
                        if(text=="1" || text==null){
                            return <span>闪闪早教</span>
                        } else if(text=="2"){
                            return <span>微信</span>
                        } else if(text=="3"){
                            return <span>支付宝</span>
                        } else {
                            return <span>其他</span>
                        }
                    },
                      width : 80
                }, {
                    title: '类型',
                    dataIndex: 'type',
                    render:(text, record)=>{
                        if(text=="1" || text==null){
                            return <span>机构</span>
                        }else if(text=="2"){
                            return <span>课程</span>
                        }else if(text=="3"){
                            return <span>活动</span>
                        }
                    },
                      width : 50
                }, {
                    title: '预约礼物',
                    dataIndex: 'giftContent',
                    width : 200,
                    render:(text, record)=>{
                        if(text=="" || text==null){
                            return <span>无</span>
                        }else {
                            return <span>{text}</span>
                        }
                    },
                },  {
                      title: '预约时间',
                      dataIndex: 'formatCreateTiem',
                      width : 120
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
        leftBars: {
            label: '操作:',
            btns: [
                {
                    type: 'text',
                    label: '确认处理',
                    icon: '',
                    handle: batchConfirmClick,
                },
            ]
        },
    };

    return (
        <div className={styles.teaching_material_manage_cont} >
            <ManagerListMgr {...managerListProps} />

            <Modal
                title='预约备注'
                visible={confirmVisible}
                maskClosable={false}
                closable={true}
                onCancel={onCloseConfirm}
                okText='确认'
                onOk={onUpdateRemark}
                width={400}>

                <Input type='textarea' placeholder='请输入备注' autosize={{minRows: 3}} className={styles.confirm_textarea} value={confirmRemark} onChange={changeConfirmRemark} />

            </Modal>
        </div>
    );
}


export default KbReservationMgrComponent;
