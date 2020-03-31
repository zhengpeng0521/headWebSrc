import React from 'react';
import { Form, Input, Button, Icon, Select, Popconfirm,DatePicker } from 'antd';
import styles from './Cousulting.less';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const ConsultingSearch = ({
    consultationListSearchReset,
    consultationListSearchSubmit,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
    },
  }) => {

    function handleSearchSubmit(e) {
        e.preventDefault();
        validateFields((errors,fieldsValue) => {
          if (!!errors) {
            return;
          }
        const rangeValueC = getFieldValue('create_time');
        let data = {...getFieldsValue()};
        consultationListSearchSubmit(data);
        });
    }
    function handleExport(){
        validateFields((errors) => {
          if (!!errors) {
            return;
          }
        searchExport(getFieldsValue());
        });
    }

    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        consultationListSearchReset();
    }

    let loopChannel = data => data.map((item) => {
    	return <Option value={item.id + ''} key={item.id} style={{color:item.status=='1'?'black':'red'}}>{item.title}</Option>;
    });

    return (
        <div>
            <Form horizontal className={styles.searchForm}>
                <div className={styles.searchContent}>
                    <div className={styles.searchItem} style={{ width: 120 }}>
                        {getFieldDecorator('id')(
                            <Input placeholder="学员姓名" />
                        )}
                    </div>

                    <div className={styles.searchItem}>
                        {getFieldDecorator('up')(
                            <Select placeholder="所属校区" style={{ width: 120 }}>
                                <Option value="">全部</Option>
                                <Option value="1" key="1">嘿嘿嘿</Option>
                                <Option value="0" key="0">哈哈哈</Option>
                            </Select>
                        )}
                    </div>

                    <div className={styles.searchItemButton}>
                        <Button type="primary" onClick={handleSearchSubmit} className={styles.SearchButton}><Icon type="search" />搜索</Button>
                        <Button onClick={handleSearchClear} className={styles.SearchButton} ><Icon type="delete" />清除条件</Button>
                    </div>
                </div>
            </Form>
        </div>
     );
};

export default Form.create()(ConsultingSearch);
