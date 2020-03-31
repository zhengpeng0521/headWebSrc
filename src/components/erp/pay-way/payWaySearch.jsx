import React from 'react';
import { Form, Input, Button, Icon, Select } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from './payWay.less';

const Option = Select.Option;
const FormItem = Form.Item;

const payWaySearch = ({
    searchData,
    searchVisible,
    searchReset,
    searchSubmit,
    form: {
        getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
    },
  }) => {

    //查询事件
    function handleSearchSubmit(e) {
        e.preventDefault();
        validateFields((errors,value) => {
          if (!!errors) {
            return;
          }
          let organId = value.organId
          searchSubmit(organId);
        });
    }

   //清除条件
    function handleSearchClear(e) {
        e.preventDefault();
        resetFields();
        searchReset();
    }

    let formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };

  return (
      <div>
        <Form horizontal className={style.search_form} >
            <div className={style.search_content}>
               <div className={style.search_top}>
                    <div className={style.search_item}>
                        {getFieldDecorator('organId', {
                            initialValue: "",
                            rules: [{
                              required: true, message: '请选择校区',
                            }],
                          })(
                            <TenantOrgFilter width="300px" />
                          )}
                    </div>
                    <div className={style.search_btns}>
                        <Button onClick={ handleSearchClear } className={style.del}>清除条件</Button>
                        <Button type="primary" onClick={ handleSearchSubmit } className={style.search_btn}>搜索</Button>
                    </div>
               </div>

            </div>
        </Form>
      </div>
  );
};

export default Form.create()(payWaySearch);
