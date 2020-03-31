import React from 'react';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import { Form, Input, Button, Icon, Select } from 'antd';

import style from './materialsManage.less';

const Option = Select.Option;

const materialManageSearch = ({
    searchData,
    searchVisible,
    searchReset,
    searchSubmit,
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
    },
  }) => {


   //搜索查询
    function handleSearchSubmit(e) {
        e.preventDefault();
        validateFields((errors,value) => {
          if (!!errors) {
            return;
          }
        let data = getFieldsValue();
           // data.tenantId = '127';
         searchSubmit(data);
        });
    }


    //清除条件
    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        searchReset();
    }


  return (
      <div>
        <Form horizontal className={style.search_form} >
                 <div className={style.search_item}>
                    {getFieldDecorator('name')(
                      <Input placeholder="教材名称" />
                    )}
                 </div>

                 <div className={style.search_item}>
                   {getFieldDecorator('status')(
                      <Select placeholder="状态">
                        <Option value="">全部</Option>
                        <Option value="1">上架</Option>
                        <Option value="2">下架</Option>
                      </Select>
                    )}
                 </div>
                 <div className={style.search_item}>
                  {getFieldDecorator('orgId', {
                  })(
                    <TenantOrgFilter width="120px" />
                  )}
                 </div>

                  <Button onClick={handleSearchClear} className={style.del}>清除条件</Button>
                  <Button type="primary" onClick={handleSearchSubmit} className={style.search_btn}>搜索</Button>

           </Form>
      </div>
  );
};

export default Form.create()(materialManageSearch);
