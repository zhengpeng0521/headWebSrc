import React from 'react';
import { Modal, Table, Input, Button, Upload, Select, Popover } from 'antd';
//import { NullData } from '../../../../../common/new-component/NewComponent';
import styles from './SecondStep.less';
const Option = Select.Option;

/*合同导入第二步*/
const SecondStep = ({
    secondStepTableTitle,                       //第二步表头
    secondStepTableDataSourse,                  //第二步列表数据
    secondStepTableDataTotal,                   //第二步列表数据数量
}) => {

    let paginationProps = {
        size : 'large',
        total: secondStepTableDataTotal,
        pageSize : 10,
        showTotal(){
            return '共'+this.total+'条';
        }
    };

    let columns = [];
    if(secondStepTableTitle && secondStepTableTitle.length > 0){
        for(let i in secondStepTableTitle){
            columns.push({
                id : i,
                title : secondStepTableTitle[i].value,
                key : secondStepTableTitle[i].key,
                dataIndex : secondStepTableTitle[i].key,
                width : 100,
            });
        }
    }

    return (
        <div className='contractOrder_second_step'>
            <Table
                columns = { columns }
                rowKey = 'id'
                dataSource = { secondStepTableDataSourse }
                pagination = { paginationProps }
                scroll = {{ x : 1516 , y : 400 }}
                />
		</div>
    );
};

export default SecondStep;
