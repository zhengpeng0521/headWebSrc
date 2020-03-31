import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Form, Icon, Select } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './GetHoliday.less';
const Option = Select.Option;

/*请假列表search*/
function GetHolidaySearchBar({
    GetHolidaySearchSubmit,             //请假列表search点击搜索或清除条件
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
    },
  }) {

    function handleSearchSubmit(e) {
        e.preventDefault();
        validateFields((errors,fieldsValue) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();
            GetHolidaySearchSubmit(data);
        });
    }

    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        GetHolidaySearchSubmit();
    }

    /*校区选择框属性*/
    let tenantOrgSelectProps = {
        width : 300,
    };

    return(
        <div style={{paddingTop:'20px'}}>
            <Form className={styles.searchForm}>
                <div className={styles.searchItem} >
                    {getFieldDecorator('orgIds')(
                        <TenantOrgFilter {...tenantOrgSelectProps}/>
                    )}
                </div>

                <div className={styles.searchItem} >
                    {getFieldDecorator('stuName')(
                        <Input placeholder="请输入姓名" style={{ width: 120 }}/>
                    )}
                </div>

                <div className={styles.searchItem} >
                    {getFieldDecorator('mobile')(
                        <Input placeholder="请输入手机号" style={{ width: 120 }}/>
                    )}
                </div>

                <div className={styles.lastSearchItem} >
                    {getFieldDecorator('status')(
                        <Select placeholder="请选择状态" style={{ width: 120 }}>
                            <Option value="">全部</Option>
                            <Option value="3,4">已处理</Option>
                            <Option value="1">未处理</Option>
                        </Select>
                    )}
                </div>

                <Button onClick={handleSearchClear} className={styles.searchButton} style={{backgroundColor:'#fff'}}>清除条件</Button>
                <Button type="primary" onClick={handleSearchSubmit} className={styles.searchButton}>搜索</Button>
            </Form>
        </div>
    );
}

export default Form.create()(GetHolidaySearchBar);
