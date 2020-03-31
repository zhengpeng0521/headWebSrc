import React from 'react';
import { Form, Input, Button, Icon, Select, Popconfirm, DatePicker, message } from 'antd';

import styles from './TuitionConsumption.less';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const DataMgrSearch = ({
    topAllData,         //统计校区，总消耗课时，总学费消耗数
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
                            {topAllData != undefined && topAllData != '' && topAllData != null && topAllData.num && topAllData.num != '' && topAllData.num != null && topAllData.num != undefined ?
                                `${topAllData.num}家`
                                :
                                '无'
                            }
                        </strong>
                    </span>
                </div>
            </div>
            <div className={styles.SearchBottom}>
                <span style={{color:'#666666'}}>总消耗课时:</span>&nbsp;
                <span style={{color:'#e23636',marginRight:'100px'}}>
                    {topAllData != undefined && topAllData != '' && topAllData != null && topAllData.cost && topAllData.cost != '' && topAllData.cost != null && topAllData.cost != undefined ?
                        `${topAllData.cost}`
                        :
                        '无'
                    }
                </span>
                <span style={{color:'#666666'}}>总消耗金额:</span>&nbsp;
                <span style={{color:'#e23636'}}>
                    {topAllData != undefined && topAllData != '' && topAllData != null && topAllData.money && topAllData.money != '' && topAllData.money != null && topAllData.money != undefined ?
                        `￥${topAllData.money}`
                        :
                        '无'
                    }
                </span>
            </div>
        </Form>
    );

};

export default Form.create()(DataMgrSearch);
