import React from 'react';
import styles from './SweepSigninRecordComponent.less';
import { Button,Rate,} from 'antd';
import moment from 'moment';
import ManagerListMgr   from '../../common/manager-list/ManagerListMgr';


function SweepSigninRecordComponent ({
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
        initQuery,
    },
    onEditClick,
    cancleSign,
}) {


    let SweepSigninRecordProps = {
        search: {
            searchAble: true,
            showSearch,
            onSearch,
            onClear,
            onFilterClick,
            fields: [
                {
                    key: 'orgId',
                    type: 'orgSelect',
                    label: '',
                    placeholder: '请选择校区',
                    width: '300px',
                },

                {
                    key: 'stuName',
                    type: 'text',
                    label: '',
                    placeholder: '请输入宝宝姓名',
                    width: '120px',
                },

                {
                    key: 'mobile',
                    type: 'text',
                    label: '',
                    placeholder: '请输入手机号',
                    width: '120px',
                },



            ],
            initSearchValues: [],
        },
        table: {
            loading,
            rowKey: 'id',
            columns: [

                 {
                     key: 'id',
                     title: '操作',
                     dataIndex: 'id',
                     width: 70,
                     render: function(text, record, index) {
                         let signTime = record.signTimeStr;
                         let flg = false;
                         if(signTime && signTime != '') {
                             flg = moment(signTime, 'YYYY-MM-DD').format('YYYY-MM-DD') == moment().format('YYYY-MM-DD');
                         }
                         return (
                             <div>
                                 {!!(record.status == '2') && <a disabled={!flg} className={styles.table_cell_href_item} onClick={()=>cancleSign(record.orgId, record.id)}>撤销</a>}
                                 {!!(record.status == '0') && <div className={styles.table_cell_href_item} style={{color: '#999'}}>已撤销</div>}
                             </div>
                         );
                     },
                 },

                {
                    key: 'stuName',
                    title: '宝宝姓名',
                    dataIndex: 'stuName',
                },

                // {
                //     key: 'phoneNum',
                //     title: '手机号',
                //     dataIndex: 'phoneNum',
                //     width: 120,
                // },

                {
                    key: 'mobile',
                    title: '手机号',
                    dataIndex: 'mobile',
                    width: 180,
                },
                {
                    key: 'orgName',
                    title: '所属校区',
                    dataIndex: 'orgName',
                    width: 250,
                },

                // {
                //     key: 'SigninParentsName',
                //     title: '签到家长',
                //     dataIndex: 'SigninParentsName',
                //     width: 120,
                // },

                {
                    key: 'parentName',
                    title: '签到家长',
                    dataIndex: 'parentName',
                    width: 200,
                },

                {
                    key: 'signTimeStr',
                    title: '签到时间',
                    dataIndex: 'signTimeStr',
                    width: 220,
                },

            ],
            dataSource,
            emptyText: '没有签到记录',
//            rowSelection: {
//                type: 'checkbox',
//                selectedRowKeys,
//                onChange: onRowSelectChange,
//            },
            pagination: {
                total,
                pageIndex,
                pageSize,
                onShowSizeChange,
                onChange: pageChange,
            }
        },
        leftBars: {
//            label: '操作:',
//            btns: [
//                {
//                    type: 'text',
//                    label: '撤销签到',
//                    handle: onBatchDelete,
//                    confirm: true,
//                }
//            ],
        },
        rightBars: {},
    };

    return (
        <div className={styles.sign_record_manage_cont} >
            <ManagerListMgr {...SweepSigninRecordProps} />

        </div>
    );
}


export default SweepSigninRecordComponent;
