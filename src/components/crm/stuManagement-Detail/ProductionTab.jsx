import React from 'react';
import {Modal, Button,Rate,Popconfirm} from 'antd';
import moment from 'moment';
import styles from './ProductionTab.less';

import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';

function ReservedsessionTab ({

	ProductionList,
	updateStudentWork,
	deleteWork,
	ProductionNum,
	ProductionPageIndex,
	ProductionPageSize,
	ProductionpageSizeChange,
	ProductionpageIndexChange,
	uploadWorks,

}) {
    let StumagegeComponentProps = {
        table: {
            //loading,
            dataSource    : ProductionList,
            rowKey        : 'id',
			height        : 336,
			isWidth       : true,
            columns:[
               {
                    dataIndex : 'id',
                    key       : 'id',
                    title     : '作品编号',
                    width     : 200,
                },{
                    dataIndex : 'title',
                    key       : 'title',
                    title     : '作品名称',
                    width     : 200,
                },{
                    dataIndex : 'tagName',
                    key       : 'tagName',
                    title     : '作品类型',
                    width     : 180,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '上传时间',
                    width     : 220,
                },
            ],

        },

        pagination : {
            total            : ProductionNum,
            pageIndex        : ProductionPageIndex,
            pageSize         : ProductionPageSize,
            showTotal        : total => `总共 ${total} 条`,
            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : ProductionpageSizeChange,
            onChange         : ProductionpageIndexChange,
        }
    };

    return(
        <div className={styles.Production_plan_inner_list}  >
            <Button type='primary' className ={styles.stumanageBtn} style={{ width : 120 ,    marginLeft: '30px', marginTop: '20px', }} onClick = {() =>  uploadWorks('add')}>添加作品</Button>
            <div className ={styles.stumanageProduction_plan_inner_list}>  <ClassPackageComponent {...StumagegeComponentProps} /> </div>
        </div>
    );
}


export default ReservedsessionTab;
