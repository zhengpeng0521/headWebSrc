import React from 'react';
import moment from 'moment';
import { Popover , Button ,Table , Icon } from 'antd';
import style from './ParentTab.less';

import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';

function ReservedsessionTab ({
    parenttabList,

    addParent,

}) {
    parenttabList && parenttabList.map(function(item, index){
        item.key = index;
    });
    let StumagegeComponentProps = {
        table: {
            //loading,
            dataSource : parenttabList,
            rowKey     : 'id',
            columns: [
                {
                    dataIndex : 'name',
                    key       : 'name',
                    title     : '家长姓名',
                    width     : '140px'
                },{
                    dataIndex : 'relation',
                    key       : 'relation',
                    title     : '家长关系',
                    width     : '96',
                },{
                    dataIndex : 'mobile',
                    key       : 'mobile',
                    title     : '联系电话',
                    width     : '112',
                    render : (text,record) => (
                        <Popover placement="top" content={text||'暂无'} trigger="click">
                            <a>查看</a>
                        </Popover>
                    )
                },{
                    dataIndex : 'bandStatus',
                    key       : 'bandStatus',
                    title     : '绑定微信',
                    width     : '100px',
                    render    : (text, record) => (
						<div>
							{ record.bandStatus == '1' && <Icon type="guanzhuweixin" className={ record.bandStatus == '1' ? style.yiguanzhu : style.noguanzhu } /> }
						</div>

                    )
                },{
                    dataIndex : 'email',
                    key       : 'email',
                    title     : '邮箱',
                    width     : '220px'
                }
            ],
        },
    };
    return (
        <ClassPackageComponent {...StumagegeComponentProps} />
    );
}

export default ReservedsessionTab;
