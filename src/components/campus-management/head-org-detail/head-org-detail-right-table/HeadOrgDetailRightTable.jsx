import React from 'react';
import { Popover } from 'antd';
import { StatusFlag , ProgressBar , NullData } from '../../../common/new-component/NewComponent';
import RightTable from '../../../common/new-component/right-table/RightTable';
import QueueAnim from 'rc-queue-anim';
import styles from './HeadOrgDetailRightTable.less';

/*校区信息右侧table*/
function HeadOrgDetailRightTable({
    packageModalData,                   //套餐数据
    /*搜索内容*/
    RightOnSearch,                      //点击搜索

    /*列表内容*/
    rightTablePageIndex,                //页码
    rightTablePageSize,                 //每页条数
    rightTableLoading,                  //表格加载状态
    rightTableTotal,                    //表格数据总数
    rightTableData,                     //表格数据所有内容
    rightTableOrgType,                  //校区类型

    RightTablePageOnChange,             //分页onChange事件
    RightTableOpenPackageModal,         //查看套餐
    RightTableOpenDetail,               //点击校区名称获取详情并且打开左划框
  }) {

    const columns = [{
        width: 160,
        title: '校区名称',
        dataIndex: 'orgName',
        key: 'orgName',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                <a onClick = {() => RightTableOpenDetail(record)}>{ text }</a>
            </Popover>
        )
      }, {
        width: 120,
        title: '校长',
        dataIndex: 'name',
        key: 'name',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      }, {
        width: 120,
        title: '联系方式',
        dataIndex: 'tel',
        key: 'tel',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      }, {
        width: 180,
        title: '地址',
        dataIndex: 'mobile',
        key: 'mobile',
        render:(text,record) => (
            <Popover placement="top" content = { (record.province || '') + (record.city || '') + (record.area || '') + (record.addr || '') }>
                { (record.province || '') + (record.city || '') + (record.area || '') + (record.addr || '') }
            </Popover>
        )
      }, {
        width: 120,
        title: '所属品牌',
        dataIndex: 'brandName',
        key: 'brandName',
        render: (text, record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        )
      }, {
        width: 120,
        title: '校区类型',
        dataIndex: 'orgType',
        key: 'orgType',
        render : (text,record) => {
            for(let i = 0 , len = rightTableOrgType.length ; i < len ; i++){
                if(rightTableOrgType[i].id == text){
                    return(
                        <Popover placement = "top" content = { rightTableOrgType[i].name }>
                            { rightTableOrgType[i].name }
                        </Popover>
                    )
                }
            }
        },
      }, {
        title: '所属部门',
        dataIndex: 'deptName',
        key: 'deptName',
        render:(text,record) => (
            <Popover placement = "top" content = { text }>
                { text }
            </Popover>
        ),
      }];

    //剩余套餐数量，所有套餐的库存相加
    let pkgLeftNum = 0;
    packageModalData && packageModalData.map((item,index) => {
        if(!!item.pkgLeftNum){
            pkgLeftNum += parseInt(item.pkgLeftNum)
        }
    })

    return(
        <div className = { styles.right_all }>
            <div className = { styles.right_explain }>
                <span className = { styles.right_explain_span }>
                    包含套餐：共
                    <span style = {{ color : 'red' }}>
                    { pkgLeftNum }
                    </span>
                    套
                </span>
                <a onClick = {() => RightTableOpenPackageModal('check')}>查看</a>
            </div>
            <div className = { styles.right_table }>
                <RightTable
                    search = {{
                        onSearch : RightOnSearch,
                        fields : [{
                            type : 'input',
                            key : 'orgName',
                            placeholder : '校区名称'
                        },{
                            type : 'select',
                            key : 'orgType',
                            opt_label : 'name',
                            opt_key : 'id',
                            options : rightTableOrgType,
                            placeholder : '校区类型'
                        },{
                            type : 'input',
                            key : 'brandName',
                            placeholder : '品牌名称'
                        }]
                    }}
                    table = {{
                        columns : columns,
                        loading : rightTableLoading,
                        dataSource : rightTableData,
                        rowKey : 'orgId',
                        height : 273
                    }}
                    pagination = {{
                        pageIndex : rightTablePageIndex,
                        pageSize : rightTablePageSize,
                        total : rightTableTotal,
                        onChange : RightTablePageOnChange
                    }}
                />
            </div>
        </div>
    );
}

export default HeadOrgDetailRightTable;
