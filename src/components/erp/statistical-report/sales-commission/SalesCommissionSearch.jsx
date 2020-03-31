import React from 'react';
import { Form, Input, Button, Icon, Select, Popconfirm, DatePicker, message } from 'antd';
import moment from 'moment';
import styles from './SalesCommission.less';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const SalesCommissionSearch = ({
    searchSubmit,
    orgCount,               //查询包含机构的数量
    searchData,
    HandleExport,           //导出数据
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    },
  }) => {

    function TimeOnSelect(dates, dateStrings){
        let time = {};
        time.startTime = dateStrings[0];
        time.endTime = dateStrings[1];
        searchSubmit(time);
    }

    function disabledDate(current) {
        return current && current.valueOf() > Date.now()-24*60*60*1000;
    }

    let dateFormat = 'YYYY-MM-DD';

    let timesInitValue = searchData.startTime && searchData.endTime ?
                                [moment(searchData.startTime, dateFormat), moment(searchData.endTime, dateFormat)] : undefined
    let timesConfig = {
        initialValue: timesInitValue,
    };

    return (
        <Form className={styles.Form}>
            <div className={styles.SearchTop}>
                <div className={styles.SearchItem}>
                    {getFieldDecorator('create_time')(
                        <RangePicker disabledDate={disabledDate} format="YYYY-MM-DD" onChange={TimeOnSelect}/>
                    )}
                </div>

                <div className={styles.SearchItem}>
                    <span style={{lineHeight:'28px',marginLeft:'20px'}}>统计校区:
                        <strong style={{color:'#5d9cec'}}>
                            {orgCount == '' || orgCount == null || orgCount == undefined ?
                                '无'
                                :
                                `${orgCount}家`
                            }
                        </strong>
                    </span>
                </div>

                <div className={styles.SearchItem} style={{fontWeight:'600',lineHeight:'28px'}}>
                {'' == searchData || '' == searchData.startTime || '' == searchData.endTime?
                    <span style={{color:'#999999',marginLeft:'16px'}}>
                        (
                        <span style={{margin:'0 4px'}}>近30日</span>
                        )
                    </span>
                    :
                    null
                }
                </div>
                <div className={styles.SearchButton}>
                    <Popconfirm placement="top" title="确认要导出吗?" onConfirm={() => HandleExport('seller')}>
                        <Button type="primary" ><Icon type="export" />导出数据</Button>
                    </Popconfirm>
                </div>
            </div>
        </Form>
    );

};

export default Form.create()(SalesCommissionSearch);
