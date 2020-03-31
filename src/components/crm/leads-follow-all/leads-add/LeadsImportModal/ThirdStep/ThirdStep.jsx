import React from 'react';
import { Modal, Table, Input, Button, Upload, Select, Popover } from 'antd';
//import { NullData } from '../../../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import styles from './ThirdStep.less';
const Option = Select.Option;

/*leads导入第三步*/
const ThirdStep = ({
    thirdStepTableTitle,                //第三步表头
    thirdStepTableDataSourse,           //第三步列表数据
    thirdStepTableDataTotal,            //第三步列表数据数量
}) => {

    let paginationProps = {
        size : 'large',
        total: thirdStepTableDataTotal,
        pageSize : 10,
        showTotal(){
            return '共'+this.total+'条';
        }
    };

    let columns = [];
    if(thirdStepTableTitle && thirdStepTableTitle.length > 0){
        for(let i in thirdStepTableTitle){
            columns.push({
                id : i,
                title : thirdStepTableTitle[i].value,
                key : thirdStepTableTitle[i].key,
                dataIndex : thirdStepTableTitle[i].key,
                width : 100,
            });
        }
    }

    return (
        <div className='leads_import_third_step'>
            <Table
                columns = { columns }
                rowKey = 'id'
                dataSource = { thirdStepTableDataSourse }
                pagination = { paginationProps }
                scroll = {{ x : 1516 , y : 400 }}
                />
		</div>
    );
};

export default ThirdStep;
