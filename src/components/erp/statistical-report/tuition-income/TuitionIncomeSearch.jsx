import React from 'react';
import { Form, Input, Button, Icon, Select, Popconfirm, DatePicker, message } from 'antd';

import styles from './TuitionIncome.less';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const DataMgrSearch = ({
    topAllOrg,                  //上方统计校区数量
    topAllData,                 //上方总统计数据
    SearchSubmit,
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
        SearchSubmit(time);
    }

    function disabledDate(current) {
        return current && current.valueOf() > Date.now()-24*60*60*1000;
    }

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
                            {topAllOrg == '' || topAllOrg == null || topAllOrg == undefined ?
                                '无'
                                :
                                `${topAllOrg}家`
                            }
                        </strong>
                    </span>
                </div>
            </div>
            <div className={styles.SearchBottom}>
                <span style={{color:'#666666'}}>总收入:</span>&nbsp;
                <span style={{color:'#e23636'}}>
                    {topAllData != undefined && topAllData != '' && topAllData != null && topAllData.realMoney && topAllData.realMoney != '' && topAllData.realMoney != null && topAllData.realMoney != undefined ?
                        `￥${topAllData.realMoney}`
                        :
                        '无'
                    }
                </span>
            </div>
        </Form>
    );

};

export default Form.create()(DataMgrSearch);
