import React from 'react';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import { Form, Input, Modal, Button, message, Select, Cascader, Popover, Radio, DatePicker, Icon } from 'antd';
import CrmStuTableModal from './crm-stu/CrmStuTableModal';
import styles from './StuMergeModal.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 19,
    },
};

/*转化学员modal*/
const StuMergeModal = ({
    leadsFollowStuMergeModalVisible,                //modal是否显示
    leadsFollowStuMergeModalButtonLoading,          //modal按钮是否加载状态
    leadsFollowDetailLeadMessage,                   //选中leads名单查看详情时当前人的信息
    leadsFollowStuMergeModalParent,                 //modal接口请求家长信息数组

    leadsFollowStuMergeStuTableModalLoading,        //点击转化学员加载状态
    stuClueCrmStuWetherFirstChangeMergeStu,         //是否是第一次点击转化学员(用于改变文案)

    StuMergeOpenCrmStuTable,                        //点击合并已有学员
    LeadsFollowStuMergeModalSubmit,                 //转化学员表单提交
    LeadsFollowStuMergeModalCancel,                 //转化学员表单关闭

    //crm学员列表
    leadsFollowCrmStuModalVisible,                      //crm学员modal是否显示
    leadsFollowCrmStuModalLoading,                      //crm学员modal加载状态
    leadsFollowCrmStuModalPageIndex,                    //crm学员modal页码
    leadsFollowCrmStuModalPageSize,                     //crm学员modal每页条数
    leadsFollowCrmStuModalContent,                      //crm学员列表内容
    leadsFollowCrmStuModalTotal,                        //crm学员列表总共个数
    leadsFollowCrmStuModalSelectedRowKeys,              //表格多选选中的数组
    leadsFollowCrmStuModalSelectedRow,                  //表格多选中的对象数组

    LeadsFollowCrmStuModalOnSubmitOrClose,              //内部CRM学员列表modal点击确认或者关闭
    LeadsFollowCrmStuModalOnSearch,                     //内部CRM学员列表点击查询学员姓名
    LeadsFollowCrmStuModalPageOnChange,                 //内部CRM学员列表分页改变
    LeadsFollowCrmStuModalRowSelectChange,              //内部CRM学员列表复选框onChange事件

    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },

  }) => {

    //如果当前学员已有家长
    let parent = [];
    if(leadsFollowStuMergeModalParent && leadsFollowStuMergeModalParent.length > 0){
        parent = leadsFollowStuMergeModalParent.map((item,index) => {
            return(
                <Radio value = { item.parentId + '' } key = { index }>{ item.parentName + '' }</Radio>
            );
        })
    }

    //转化学员提交
    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if (!!errors) {
                return;
            }

            //处理机构id
            values.orgId = leadsFollowDetailLeadMessage.orgId || '';

            //处理要转化的学员id
            values.sourceStuId = leadsFollowDetailLeadMessage.id || '';

            //要合并到的学员ID
            if(leadsFollowCrmStuModalSelectedRow && leadsFollowCrmStuModalSelectedRow.length > 0){
                //已选择要合并的学员
                values.targetStuId = leadsFollowCrmStuModalSelectedRow[0].id;
            }else{
                //未选择合并学员直接保存
                values.targetStuId = '';
            }

            //处理要转化的家长id和name
            values.sourceParentId = leadsFollowDetailLeadMessage.parentId || '';
            values.parentName = leadsFollowDetailLeadMessage.parentName || '';

            //要合并到的家长ID
            values.targetParentId = values.parents || '';

            //处理target
            values.target = leadsFollowDetailLeadMessage.target;

            delete values.parentId;
            delete values.parents;

            LeadsFollowStuMergeModalSubmit(values);
        });
    }

    //关闭
    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        LeadsFollowStuMergeModalCancel();
    }

    function Title(){
        return(
            <div>学员列表（{leadsFollowDetailLeadMessage.orgName}）</div>
        );
    }

    //本模态框的属性
    let modalOpts = {
        title: '转为学员',
        maskClosable : false,
        visible : leadsFollowStuMergeModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={leadsFollowStuMergeModalButtonLoading}
                    loading={leadsFollowStuMergeModalButtonLoading}
                    style={{marginLeft:20}}>转化</Button>
        ],
        className : 'leads_follow_StuMergeModal'
    };

    //内部CRM学员列表模态框属性
    let innerModalOpts = {
        title: Title(),
        maskClosable : false,
        visible : leadsFollowCrmStuModalVisible,
        closable : true,
        width : leadsFollowCrmStuModalTotal && leadsFollowCrmStuModalTotal > 0 ? 1100 : 550,
        onOk: LeadsFollowCrmStuModalOnSubmitOrClose,
        onCancel : LeadsFollowCrmStuModalOnSubmitOrClose,
        footer : leadsFollowCrmStuModalTotal && leadsFollowCrmStuModalTotal > 0 ?
                [
                    <Button key="cancel" type="ghost" onClick={() => LeadsFollowCrmStuModalOnSubmitOrClose('close')}>取消</Button>,
                    <Button key="submit" type="primary"
                            onClick={() => LeadsFollowCrmStuModalOnSubmitOrClose('ensure')}
                            style={{marginLeft:'10px'}}>确认选择</Button>
                ] : [
                    <Button key="cancel" type="primary" onClick={() => LeadsFollowCrmStuModalOnSubmitOrClose('close')}>我知道了</Button>,
                ],
        className : 'leads_follow_CrmStuTableModal'
    }

    //内部CRM学员列表
    let stuClueCrmStuTableModalProps = {
        leadsFollowCrmStuModalTotal,                        //crm学员列表总共个数
        leadsFollowCrmStuModalPageIndex,                    //crm学员modal页码
        leadsFollowCrmStuModalPageSize,                     //crm学员modal每页条数
        table : {
            loading : leadsFollowCrmStuModalLoading,
            dataSource : leadsFollowCrmStuModalContent,
            rowSelection : {
                selectedRowKeys : leadsFollowCrmStuModalSelectedRowKeys,
                onChange : LeadsFollowCrmStuModalRowSelectChange,        //内部CRM学员列表复选框onChange事件
            },
        },
        LeadsFollowCrmStuModalOnSearch,                     //内部CRM学员列表点击查询学员姓名
        LeadsFollowCrmStuModalPageOnChange,                 //内部CRM学员列表分页改变


//        leadsFollowCrmStuModalSelectedRowKeys,              //表格多选选中的数组
//        leadsFollowCrmStuModalSelectedRow,                  //表格多选中的对象数组
    }

    return (
        <div >
            <Modal {...modalOpts}>
                <Form>
                    { leadsFollowDetailLeadMessage.parentId != '' &&  leadsFollowDetailLeadMessage.parentId != null && leadsFollowDetailLeadMessage.parentId != undefined ?
                        <div>
                            <div className={styles.leads_merge_title}>
                                <div></div>
                                <div>家长信息</div>
                            </div>
                            <div className={styles.parent_intro}>
                                { leadsFollowStuMergeModalParent.length > 1 ?
                                    <div>线索里的家长信息已存在，请选择合并家长(2个家长)</div>
                                    :
                                  leadsFollowStuMergeModalParent.length == 1 ?
                                    <div>系统将自动把线索合并至已有家长(1个家长)</div>
                                    :
                                  leadsFollowStuMergeModalParent.length == 0 ?
                                    <div>系统将自动创建该家长</div>
                                    :
                                    null
                                }
                            </div>
                            <FormItem
                                label="线索家长"
                                {...formItemLayout}
                                style={{lineHeight:'30px'}}
                            >
                                {getFieldDecorator('parentId', {
                                    initialValue : leadsFollowDetailLeadMessage.parentId,
                                    rules: [
                                        { required: true, message: '请选择家长' },
                                    ],
                                })(
                                    <RadioGroup>
                                        <Radio value = { leadsFollowDetailLeadMessage.parentId + '' }>{ leadsFollowDetailLeadMessage.parentName + '' }</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            { leadsFollowStuMergeModalParent && leadsFollowStuMergeModalParent.length > 0 ?
                                <div>
                                    <FormItem
                                        label="已有家长"
                                        {...formItemLayout}
                                        style={{lineHeight:'30px'}}
                                    >
                                        {getFieldDecorator('parents', {
                                            initialValue : leadsFollowStuMergeModalParent[0].parentId,
                                            rules: [
                                                { required: true, message: '请选择家长' },
                                            ],
                                        })(
                                            <RadioGroup>
                                                { parent || [] }
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                </div>
                                :
                                null
                            }

                        </div>
                        :
                        null
                    }
                    <div className={styles.leads_merge_title}>
                        <div></div>
                        <div>创建学员</div>
                    </div>
                    <div className={styles.stu_intro}>
                        <div>线索学员：{leadsFollowDetailLeadMessage.name}</div>
                        <div>
                            <a onClick={() => StuMergeOpenCrmStuTable()}>{ stuClueCrmStuWetherFirstChangeMergeStu == 0 ? '合并已有学员（可选）' : '更换合并学员' }
                            </a>&nbsp;
                            { leadsFollowStuMergeStuTableModalLoading == true ? <Icon type="loading" style={{color:'#5d9cec'}}/> : null}
                        </div>
                    </div>
                    {<QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}
                        className="common-search-queue" >
                        {leadsFollowCrmStuModalSelectedRow.length == 1 ?
                            <div className={styles.choosed_crm_stu} key='choosed_crm_stu'>
                                <div>已有学员：{leadsFollowCrmStuModalSelectedRow[0].name}</div>
                                <div>线索学员将合并至已有学员</div>
                            </div>
                            :
                            null
                        }
                    </QueueAnim>}
                </Form>
                <Modal {...innerModalOpts}>
                    { leadsFollowCrmStuModalVisible == true ?
                        <CrmStuTableModal {...stuClueCrmStuTableModalProps}/>
                        :
                        null
                    }
                </Modal>
            </Modal>
        </div>
    );
};

export default Form.create()(StuMergeModal);
