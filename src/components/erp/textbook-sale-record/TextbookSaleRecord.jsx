import React from 'react';
import styles from './TextbookSaleRecord.less';
import { Table, Icon, Button, Form, Select, Input, Row, Col, Modal, Popconfirm, DatePicker, } from 'antd';
import QueueAnim from 'rc-queue-anim';

const FormItem = Form.Item;
let Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

function TextbookSaleComponent ({
        textbookSaleTable,
        textbookSaleSearch,
       form : {
            getFieldDecorator,
            validateFieldsAndScroll,
            validateFields,
            getFieldsValue,
            getFieldValue,
            getFieldError,
            setFieldsValue,
            resetFields,
        },
}) {

    //筛选
    function Onsearch () {
        textbookSaleSearch.showSearchFunction();
    }

    //筛选  搜索
    function searchBtn () {
        let values  = getFieldsValue();
        textbookSaleSearch.textbookSearch(values);
    }

    //筛选  清除条件
    function handleReset () {
        resetFields();
    }

    //添加
    function OnAdd () {
        alert('跳转到缴费的编辑界面')
    }

    //表头定义
    const columns = [{
      title      : '关联缴费单',
      dataIndex  : 'RelatedPaymentList',
      key        : 'RelatedPaymentList',
      render: text => <a href="#" onClick = {textbooksalerecordAddUpdate}>{text}</a>,
    }, {
      title      : '教材名称',
      dataIndex  : 'TextbookTitle',
      key        : 'TextbookTitle',
    }, {
      title      : '数量',
      dataIndex  : 'Amount',
      key        : 'Amount',
    }, {
      title      : '总价',
      dataIndex  : 'TotalPrices',
      key        : 'TotalPrices',
    }, {
      title      : '实收',
      dataIndex  : 'OfficialReceipts',
      key        : 'OfficialReceipts',
    }, {
      title      : '学员',
      dataIndex  : 'Student',
      key        : 'Student',
    }, {
      title      : '购买时间',
      dataIndex  : 'TimeBuying',
      key        : 'TimeBuying',
    }, {
      title      : '所属校区',
      dataIndex  : 'School',
      key        : 'School',
    }];

    //关联缴费单
    function textbooksalerecordAddUpdate () {
        alert('跳转到缴费的编辑界面');
    }

    const rowSelection = {
        onChange : textbookSaleTable.rowSelectChange(),
    };

    //分页
    const paginationProps = {
        total               : textbookSaleTable.textbookSaleRecordDataSource.length,
        showQuickJumper     : true,  //是否显示快速跳页
        onChange            : textbookSaleTable.tablePageChange,   //页码改变的回调，参数是改变后的页码及每页条数
        showTotal(){
            return '总共'+this.total+'条数据';
        }
    };

    return (
        <div className={styles.textbookSalebasediv}>

            <QueueAnim
				type = {[ 'top', 'bottom' ]}
                ease = {[ 'easeOutQuart', 'easeInOutQuart' ]}
                style = {{ width : '100%' }} >
					{ !! textbookSaleSearch.showSearch  &&
                        <Form
                        className={styles.searchForm}
                        >
                        <FormItem
                            style={{float : 'left',width:'120px',marginRight : '10px'}}
                        >
                          {getFieldDecorator('textbookNum', {

                          })(
                            <Input placeholder="教材编号" />
                          )}
                        </FormItem>

                        <FormItem
                            style={{float : 'left',width:'120px',marginRight:'10px'}}
                        >
                          {getFieldDecorator('textbookName', {

                          })(
                            <Input placeholder="教材名称" />
                          )}
                        </FormItem>

                        <FormItem
                            style={{float : 'left',width:'120px',marginRight:'10px'}}
                        >
                          {getFieldDecorator('studentsName', {

                          })(
                            <Input placeholder="学员姓名" />
                          )}
                        </FormItem>

                        <FormItem
                            style={{float : 'left',width:'120px',marginRight:'10px'}}
                        >
                          {getFieldDecorator('classroomSchool', {

                          })(
                            <Select placeholder="所属校区">
                              <Option value="school1">滨江</Option>
                              <Option value="school2">西湖</Option>
                            </Select>
                          )}
                        </FormItem>

                        <FormItem
                           style={{float : 'left',width:'120px',marginRight:'10px'}}
                        >
                            { getFieldDecorator('time' , {

                            })(
                                <RangePicker showTime format = "YYYY-MM-DD"/>
                            )}
                        </FormItem>

                        <div className={styles.searchButton}>
                            <Button onClick={searchBtn} type="primary">
                                搜索
                            </Button>
                            <Button onClick={handleReset}>
                              清除条件
                            </Button>
                        </div>
                    </Form>
                    }
			</QueueAnim>


            <div className={styles.topOperation}>
                <div className={styles.topOperationLeft}>
                    <span>当前统计结果 </span>
                    <span>总计实收金额：111</span>
                </div>
                <div className={styles.topOperationRight}>
                    <Button type="primary" onClick = {OnAdd}><Icon type="plus" />添加</Button>
				    <Button type="primary" onClick = {Onsearch}><Icon type="filter" />筛选</Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={textbookSaleTable.textbookSaleRecordDataSource}
                rowSelection={rowSelection}
                pagination={paginationProps}
                bordered
            />

        </div>
    );
}


export default Form.create({})(TextbookSaleComponent);
