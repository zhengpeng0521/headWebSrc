import React from 'react';
import { Tree, Popconfirm, Spin, Button, Input, Form, Icon, Select } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import styles from './WxBanner.less';
const Option = Select.Option;

/*banner轮播图search*/
function WxBannerSearchBar({
    WxBannerSearchSubmit,               //banner轮播图search点击搜索或清除条件
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
        validateFields((errors,value) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();
            WxBannerSearchSubmit(data);
        });
    }

    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        WxBannerSearchSubmit();
    }

    /*校区选择框属性*/
    let tenantOrgSelectProps = {
        width : 300,
    };

    return(
        <div style={{paddingTop:'20px'}}>
            <Form className={styles.searchForm}>
                <div className={styles.searchItem} >
                    {getFieldDecorator('orgId')(
                        <TenantOrgFilter {...tenantOrgSelectProps}/>
                    )}
                </div>

                <div className={styles.searchItem} >
                    {getFieldDecorator('title')(
                        <Input placeholder="请输入文章标题" style={{ width: 120 }}/>
                    )}
                </div>

                <div className={styles.lastSearchItem} >
                    {getFieldDecorator('status')(
                        <Select placeholder="请选择是否显示" style={{ width: 120 }}>
                            <Option value="">全部</Option>
                            <Option value="1">显示</Option>
                            <Option value="2">隐藏</Option>
                        </Select>
                    )}
                </div>

                <Button onClick={handleSearchClear} className={styles.searchButton} style={{backgroundColor:'#fff'}}>清除条件</Button>
                <Button type="primary" onClick={handleSearchSubmit} className={styles.searchButton}>搜索</Button>
            </Form>
        </div>
    );
}

export default Form.create()(WxBannerSearchBar);
