import React from 'react';
import { Table } from 'antd';
import './ThirdStep.less';

const ThirdStep = ({
    importTableTitle,                       //表头
    importTableDataSourse,                  //列表数据
    importTableTotal,                       //列表数据数量
}) => {

    let paginationProps = {
        size : 'large',
        total: importTableTotal,
        pageSize : 10,
        showTotal(){
            return '共'+this.total+'条';
        }
    };

    let columns = [];
    if(importTableTitle && importTableTitle.length > 0){
        for(let i in importTableTitle){
            columns.push({
                id : i,
                title : importTableTitle[i].value,
                key : importTableTitle[i].key,
                dataIndex : importTableTitle[i].key,
                width : 100,
            });
        }
    }

    return (
        <div className='third_step'>
            <Table
                columns = { columns }
                rowKey = 'id'
                dataSource = { importTableDataSourse }
                pagination = { paginationProps }
                scroll = {{ x : true , y : 400 }}
            />
		</div>
    );
};

export default ThirdStep;
