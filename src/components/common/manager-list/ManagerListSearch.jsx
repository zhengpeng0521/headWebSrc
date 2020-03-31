import React from 'react';
import {Form, Input, Select, Button, DatePicker} from 'antd';
import QueueAnim from 'rc-queue-anim';
import styles from './ManagerListSearch.less';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
let {keys, values, entries} = Object;

const { MonthPicker, RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option   = Select.Option;

function ManagerListSearch ({
    searchAble,
    showSearch,
    searchBtnText,
    clearBtnText,
    onSearch,
    onSearchOrgId,
    onClear,
    fields,
    wetherClear,
    form: {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {

    if(wetherClear){
        resetFields();
    }

    //校区选择回调
    function functionSearchOrgId(e) {
        resetFields();
        onSearchOrgId && onSearchOrgId(e);
    }

    //点击搜索按钮时
    function onSearchClick() {
        let params = getFieldsValue();
        let query = {};
        if(params) {
            for (let [key, value] of entries(params)) {

              if(value != undefined && value != '') {
                  query[key] = value;
              }
            }
        }
        onSearch && onSearch(query);
    }

    //点击清除条件按钮时
    function onClearClick() {
        resetFields();
        onClear && onClear();
    }

    let fieldsRender = [];
    fields && fields.map(function(fieldItem) {

        let key = fieldItem.key;
        let type = fieldItem.type;
        let label = fieldItem.label || '';
        let placeholder = fieldItem.placeholder;
        let initValue = fieldItem.initValue;
        let width = fieldItem.width || '120px';
        let options = fieldItem.options;
        let opt_key = fieldItem.opt_key || 'key';
        let opt_label = fieldItem.opt_label || 'label';

        if(type == 'text') {
            fieldsRender.push(
                <FormItem key={'form_item_'+key} label={label}>
                {getFieldDecorator(key, {
                    initialValue: initValue,
                  })(
                    <Input placeholder={placeholder} size="default" style={{width: width}} />
                  )}
                </FormItem>
            );
        } else if(type == 'select') {
            fieldsRender.push(
                <FormItem key={'form_item_'+key} label={label}>
                {getFieldDecorator(key, {
                    initialValue: initValue,
                  })(
                    <Select
						   size="default"
                           placeholder={placeholder}
                           allowClear
                           style={{width: width}}>
                            {options && options.map(function(optItem) {
                                return (<Option key={'select_opt_' + optItem[opt_key]} value={optItem[opt_key]+''}>{optItem[opt_label]}</Option>);
                            })}
                        </Select>
                  )}
                </FormItem>
            );
        } else if( type == 'rangePicker' ){
            fieldsRender.push(
                <FormItem key={'form_item_'+key} label={ label }>
                    {getFieldDecorator(key, {
                        initialValue: initValue,
                      })(
                          <RangePicker size = 'default' { ...options } />
                      )}
                </FormItem>
            )
        } else if( type == 'orgSelect' ){
            fieldsRender.push(
                <FormItem key={'form_item_'+key} label={ label }>
                    {getFieldDecorator(key, {
                        initialValue: initValue,
                      })(
                            <TenantOrgSelect { ...options } onChange={functionSearchOrgId}/>
                      )}
                </FormItem>
            )
        }
    });

    return (
        <QueueAnim type="top" duration={500} >
           {!!showSearch &&
           <div className="common_manager_list_search_cont" key="common_manager_list_search_cont" >
                <Form inline >
                    {fieldsRender}
                    <div className={styles.search_btns_temp}>
                        <div className={styles.search_btns}>
                            <Button type="primary" className={styles.search_btn_item} onClick={onSearchClick}>{searchBtnText||'搜索'}</Button>
                            <Button type="ghost"   className={styles.search_btn_clear} onClick={onClearClick}>{clearBtnText||'清除条件'}</Button>
                        </div>
                    </div>
                </Form>
            </div>
           }
        </QueueAnim>
    );
}

export default Form.create()(ManagerListSearch);
