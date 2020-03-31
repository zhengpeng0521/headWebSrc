import React from 'react';

import {Modal, Button,Rate,} from 'antd';
import moment from 'moment';
import { StatusFlag} from '../../common/new-component/NewComponent';
import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';

function ReservedsessionTab ({
	spenthourTabLoading,
    spenthourTabList,
	spenthourTabResultCount,
	spenthourTabPageSize,
	spenthourTabPageIndex,

	spenthourTabPageIndexChange

}){
    let StumagegeComponentProps = {
        table: {
			loading     : spenthourTabLoading,
            dataSource  : spenthourTabList,
			height      : 338,
			isWidth     : true,
            columns: [
                {
                    key       : 'courseName',
                    dataIndex : 'courseName',
                    title     : '课程',
                    width     : 96,
                },{
                    dataIndex : 'itemTime',
                    key       : 'itemTime',
                    title     : '上课时间',
                    width     : 160,
                },{
                    key       : 'periodChange',
                    dataIndex : 'periodChange',
                    title     : '课时',
                    width     : 68,
                },{
                    key       : 'classRoom',
                    dataIndex : 'classRoom',
                    title     : '教室',
                    width     : 102,
                },{
                    key       : 'tradeType',
                    dataIndex : 'tradeType',
                    title     : '状态',
                    width     : 102,
                },
            ],
        },
		pagination : {
            total            : spenthourTabResultCount,
            pageIndex        : spenthourTabPageIndex,
            pageSize         : spenthourTabPageSize,
            showTotal        : total => `总共 ${ total } 条`,
            showQuickJumper  : true,
            onChange         : spenthourTabPageIndexChange
        },
    };

    return (
        <ClassPackageComponent { ...StumagegeComponentProps } />
    );
}

export default ReservedsessionTab;

// 3 课时退回
// 5 课时消耗
// 6 课时返还
// 8课程-出勤
// 9课程-请假
// 10课程-旷课）
