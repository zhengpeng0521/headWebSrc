import React from 'react';
import moment from 'moment';
import { Popover , Input , Button , Icon , Form , Pagination } from 'antd';
import ManagerList from '../../../../../common/new-component/manager-list/ManagerList';
import styles from './CrmStuTableModal.less';

/*内部CRM学员列表*/
const StuClueCrmStuTableModal = ({
    leadsFollowCrmStuModalTotal,                        //crm学员列表总共个数
    leadsFollowCrmStuModalPageIndex,                    //crm学员modal页码
    leadsFollowCrmStuModalPageSize,                     //crm学员modal每页条数
    table,
    LeadsFollowCrmStuModalOnSearch,                     //内部CRM学员列表点击查询学员姓名
    LeadsFollowCrmStuModalPageOnChange,                 //内部CRM学员列表分页改变
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    const columns = [{
        width: 150,
        title: '学员姓名',
        dataIndex: 'name',
        key: 'name',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
      }, {
        width: 150,
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
      }, {
        width: 150,
        title: '负责人',
        dataIndex: 'sellerName',
        key: 'sellerName',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
      }, {
        width: 150,
        title: '创建人',
        dataIndex: 'creatorName',
        key: 'creatorName',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
      }, {
        width: 150,
        title: '所属校区',
        dataIndex: 'orgName',
        key: 'orgName',
        render : (text,record) => (
            <Popover placement="top" content={text} trigger="hover">
                { text }
            </Popover>
        )
      }];

    table.columns = columns;

    function OnSearch(e){
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }
            LeadsFollowCrmStuModalOnSearch(values)          //内部CRM学员列表点击查询学员姓名
        })
    }

    return (
        <div>
            { leadsFollowCrmStuModalTotal && leadsFollowCrmStuModalTotal > 0 ?
                <div className={styles.query}>
                    <div>
                        {getFieldDecorator('name')(
                            <Input placeholder = '请输入学员姓名' style={{ marginRight : 10 , width : 220 }}/>
                        )}
                    </div>
                    <Button type = 'primary' onClick = { OnSearch }><Icon type='search'/></Button>
                </div>
                :
                null
            }
            { leadsFollowCrmStuModalTotal && leadsFollowCrmStuModalTotal > 0 ?
                <div className={styles.table}>
                    <ManagerList
                        table = { table }
                        />
                </div>
                :
                <div className={styles.nullSource}>
                    <img src='https://img.ishanshan.com/gimg/img/0f4b3e548fb0edce54c578866babc7af'/>
                    <span>没有学员数据</span>
                </div>
            }

            { leadsFollowCrmStuModalTotal && leadsFollowCrmStuModalTotal > 0 ?
                <div className={styles.pagination}>
                    <Pagination
                        style = {{ float : 'right' }}
                        showQuickJumper
                        current = { leadsFollowCrmStuModalPageIndex + 1 }
                        pageSize = { leadsFollowCrmStuModalPageSize }
                        total = {leadsFollowCrmStuModalTotal}
                        showTotal = {() => `共${leadsFollowCrmStuModalTotal}条`}
                        onChange = { LeadsFollowCrmStuModalPageOnChange }
                        />
                </div>
                :
                null
            }
        </div>
    );
};

export default Form.create()(StuClueCrmStuTableModal);
