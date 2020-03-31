import React from 'react';

import {Modal, Button,Rate,} from 'antd';
import moment from 'moment';
import { StatusFlag} from '../../common/new-component/NewComponent';
import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';

function ReservedsessionTab ({
	reservedsessionLoading,
    reservedsessionList,
	reservedsessionResultCount,
	reservedsessionPageIndex,
	reservedsessionPageSize,
	reservedsessionPageSizeChange,
	reservedsessionPageIndexChange
}) {
    let StumagegeComponentProps = {
        table : {
			loading     : reservedsessionLoading,
            dataSource  : reservedsessionList,
			height      : 338,
			isWidth     : true,
            columns : [
                {
                    key       : 'courseName',
                    title     : '课程',
                    dataIndex : 'courseName',
                    width     : 96,
                },{
                    dataIndex : 'itemTime',
                    key       : 'itemTime',
                    title     : '上课时间',
                    width     : 160,
                },{
                    key       : 'total',
                    title     : '课时',
                    dataIndex : 'total',
                    width     : 68,
                },{
                    key       : 'classRoom',
                    title     : '教室',
                    dataIndex : 'classRoom',
                    width     : 102,
                },{
                    key       : 'status',
                    title     : '状态',
                    dataIndex : 'status',
                    width     : 102,
                    render    : (text,record) => (
                        <StatusFlag type = { (text == '1' || text == '2') ? 'blue' :'gray'   }>{ text == '1' ? '进行中' : text == '2' ? '完成' : text == '3' ? '已取消' : '' }</StatusFlag>
                    )
                },
            ],
		},
		pagination : {
            total            : reservedsessionResultCount,
            pageIndex        : reservedsessionPageIndex,
            pageSize         : reservedsessionPageSize,
            showTotal        : total => `总共 ${ total } 条`,
//            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : reservedsessionPageSizeChange,
            onChange         : reservedsessionPageIndexChange
        },
    };

    return (
            <ClassPackageComponent {...StumagegeComponentProps} />
    );
}

export default ReservedsessionTab;


