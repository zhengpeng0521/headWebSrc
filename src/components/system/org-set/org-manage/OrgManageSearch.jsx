import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Form, Icon, Select } from 'antd';
import styles from './OrgManage.less';
const Option = Select.Option;

/*校区管理search*/
function RefundFormSearch({
    OrgManageSearchSubmit,              //校区管理search点击搜索
    OrgManageSearchReset,               //校区管理search点击清除条件
    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
    },
  }) {

    //console.info('refundFormSearchOrgMessage',refundFormSearchOrgMessage);

    function handleSearchSubmit(e) {
        e.preventDefault();
        validateFields((errors,fieldsValue) => {
            if (!!errors) {
            return;
        }
        let data = getFieldsValue();
        OrgManageSearchSubmit(data);
        });
    }

    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        OrgManageSearchReset();
    }

    return(
        <div className={styles.searchForm}>
            <div className={styles.searchArea}>
                <div className={styles.searchItem} >
                    {getFieldDecorator('id')(
                        <Input placeholder="校区编号" style={{ width: 120 }}/>
                    )}
                </div>
                <div className={styles.searchItem}>
                    {getFieldDecorator('organName')(
                        <Input placeholder="校区名称" style={{ width: 120 }}/>
                    )}
                </div>
                <div className={styles.searchItem}>
                    {getFieldDecorator('organType',{
                    })(
                        <Select placeholder="机构类型" style={{ width: 120 }}>
                            <Option value="">全部</Option>
                            <Option value="1">直营</Option>
                            <Option value="2">加盟</Option>
                        </Select>
                    )}
                </div>
            </div>
            <div className={styles.searchBtn}>
                <Button onClick={handleSearchClear} className={styles.searchButton} style={{backgroundColor:'#fff'}}>清除条件</Button>
                <Button type="primary" onClick={handleSearchSubmit} className={styles.searchButton}>搜索</Button>
            </div>
        </div>
    );
}

export default Form.create()(RefundFormSearch);
