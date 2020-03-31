import React from 'react';
import { Modal, Tabs, Table, Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
};

function classModal({
    loading,
    formLoading,
    classFormVisible,      //报班弹框显示

    selectContent,         //获得学员的下拉框数据

    form: {
        getFieldDecorator,
        validateFields,
        getFieldValue,
        getFieldsValue,
        resetFields,
        validateFieldsAndScroll,
        setFieldsValue,
    },
}){
    const columns = [{
    title: '课程名称',
    dataIndex: 'coursename',
    key: 'name',
  }, {
    title: '剩余专用课时',
    dataIndex: 'specialClass',
    key: 'specialClass',
  }, {
    title: '剩余共用课时',
    dataIndex: 'commonClass',
    key: 'commonClass',
  }, {
    title: '班级数量',
    dataIndex: 'classNumber',
    key: 'classNumber',
  }, {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
  }];


    let children  = [];     //学员下拉框数据
    if(selectContent && selectContent.length > 0){
        children = selectContent.map((item,index) => {
             return (<Option value={item.key} key={item.key}>{item.value}</Option>);
        });
    }




    let modalOpts = {
        title: '报班',
        visible : classFormVisible,
        maskClosable : true,
        closable : true,
        width : 500,
    };

    return (
         <Modal {...modalOpts}>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Tab 1" key="1">
                    <Form>
                        <FormItem
                          {...formItemLayout}
                          label="选择学员"
                          hasFeedback
                        >
                              {getFieldDecorator('key', {
                                rules: [{
                                  required: true, message: '请先选择学员!',
                                }],
                              })(
                                    <Select style={{width:'240px'}} >
                                        { children || [] }
                                    </Select>
                              )}
                        </FormItem>
                    </Form>
                    <Button type="primary">确定</Button>
                </TabPane>
                <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
            </Tabs>
         </Modal>

    );


}


export default Form.create()(classModal);
