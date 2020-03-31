import React from 'react';
import { Form , Checkbox , Button , Radio , Icon , Popover , message , Spin } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import styles from './CheckSameRules.less';
const formItemLayout = {
    labelCol : { span: 7 },
    wrapperCol : { span: 14 }
};

/*查重规则*/
function CheckSameRule({
    //学员
    stuQuerySuc,                    //学员查重规则是否查询成功(成功才渲染组件)
    stuSingleId,                    //学员单个修改序号(传空或不传表示新增)
    stuBatchId,                     //学员批量修改序号(传空或不传表示新增)
    stuSingleScope,                 //学员单个查重范围
    stuBatchScope,                  //学员批量查重范围
    stuSingleConfArray,             //学员单个查重可选项(一般是手机号，姓名)
    stuBatchConfArray,              //学员批量查重可选项(一般是手机号，姓名)
    stuSingleCheckedConfArray,      //学员单个选中的配置项
    stuBatchCheckedConfArray,       //学员批量选中的配置项

    //名单
    leadQuerySuc,                   //名单查重规则是否查询成功(成功才渲染组件)
    leadSingleId,                   //名单单个修改序号(传空或不传表示新增)
    leadBatchId,                    //名单批量修改序号(传空或不传表示新增)
    leadSingleScope,                //名单单个查重范围
    leadBatchScope,                 //名单批量查重范围
    leadSingleConfArray,            //名单单个查重可选项(一般是手机号，姓名)
    leadBatchConfArray,             //名单批量查重可选项(一般是手机号，姓名)
    leadSingleCheckedConfArray,     //名单单个选中的配置项
    leadBatchCheckedConfArray,      //名单批量选中的配置项

    loading,                        //整个页面加载状态
    buttonLoading,                  //按钮加载状态

    Submit,                         //点击保存
    form : {
		getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
	}
}) {

    function submit(e){
        e.preventDefault();
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            if(!values.single_stu_check_range){
                return message.warn('学员单条查重范围必选')
            }
            if(!values.batch_stu_check_range){
                return message.warn('学员批量查重范围必选')
            }
            if(!values.single_lead_check_range){
                return message.warn('名单单条查重范围必选')
            }
            if(!values.batch_lead_check_range){
                return message.warn('名单单条查重范围必选')
            }
            //处理学员单条
            let stuSingleArr = [];
            for(let i in values.single_stu_check_field){
                stuSingleArr.push({
                    value : values.single_stu_check_field[i] + ''
                });
            }
            let stuSingleObj = {
                id : stuSingleId,
                type : '1',                 //设置类型 0 名单查重, 1 学员查重
                addWay : '0',               //添加方式 0 单条添加，1 批量导入
                scope : values.single_stu_check_range,
                configArray : JSON.stringify(stuSingleArr)
            };

            //处理学员批量
            let stuBatchArr = [];
            for(let i in values.batch_stu_check_field){
                stuBatchArr.push({
                    value : values.batch_stu_check_field[i] + ''
                });
            }
            let stuBatchObj = {
                id : stuBatchId,
                type : '1',                 //设置类型 0 名单查重, 1 学员查重
                addWay : '1',               //添加方式 0 单条添加，1 批量导入
                scope : values.batch_stu_check_range,
                configArray : JSON.stringify(stuBatchArr)
            };

            //处理名单单个
            let leadSingleArr = [];
            for(let i in values.single_lead_check_field){
                leadSingleArr.push({
                    value : values.single_lead_check_field[i] + ''
                });
            }
            let leadSingleObj = {
                id : leadSingleId,
                type : '0',                 //设置类型 0 名单查重, 1 学员查重
                addWay : '0',               //添加方式 0 单条添加，1 批量导入
                scope : values.single_lead_check_range,
                configArray : JSON.stringify(leadSingleArr)
            };

            //处理名单批量
            let leadBatchArr = [];
            for(let i in values.batch_lead_check_field){
                leadBatchArr.push({
                    value : values.batch_lead_check_field[i] + ''
                });
            }
            let leadBatchObj = {
                id : leadBatchId,
                type : '0',                 //设置类型 0 名单查重, 1 学员查重
                addWay : '1',               //添加方式 0 单条添加，1 批量导入
                scope : values.batch_lead_check_range,
                configArray : JSON.stringify(leadBatchArr)
            };
            Submit({dataInfo : JSON.stringify([stuSingleObj,stuBatchObj,leadSingleObj,leadBatchObj]) });
        });
    }

    return(
        <div className={styles.all}>
            <Spin spinning = { loading }>
                { !!leadQuerySuc ?
                    <div style = {{ marginBottom : 20 }} className='zj_check_same_rules_area'>
                        <div className={styles.title}>
                            <div className={styles.title_block}></div>
                            <div className={styles.title_content}>名单查重规则</div>
                            <Popover
                                trigger="hover"
                                placement="right"
                                content={
                                    <div>
                                        <div>1.可设置名单列表中添加新名单时的查重规则</div>
                                        <div>2.可在商户（所有机构）级别或单校区级别查重</div>
                                        <div>3.勾选查重规则后，则一旦有重复，可报错，且无法添加成功</div>
                                    </div>
                                }
                            >
                                <Icon type="question-circle-o"/>
                            </Popover>
                        </div>
                        <div className={styles.check_rules} style = {{ marginBottom : 20 }}>
                            <div className={styles.check_rules_name}>
                                <div>单条添加</div>
                                <div>批量导入</div>
                            </div>
                            <div className={styles.check_rules_content}>
                                <div className={styles.check_rules_content_form}>
                                    <Form.Item
                                        label="查重范围"
                                        {...formItemLayout}>
                                        {getFieldDecorator('single_lead_check_range',
                                            { initialValue : leadSingleScope || undefined }
                                        )(
                                            <Radio.Group>
                                                <Radio value='0'>校区</Radio>
                                                <Radio value='1'>商户</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="查重字段"
                                        {...formItemLayout}>
                                        {getFieldDecorator('single_lead_check_field',
                                            { initialValue : leadSingleCheckedConfArray || [] }
                                        )(
                                            <Checkbox.Group options={leadSingleConfArray}/>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className={styles.check_rules_content_form}>
                                    <Form.Item
                                        label="查重范围"
                                        {...formItemLayout}>
                                        {getFieldDecorator('batch_lead_check_range',
                                            { initialValue : leadBatchScope || undefined }
                                        )(
                                            <Radio.Group>
                                                <Radio value='0'>校区</Radio>
                                                <Radio value='1'>商户</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="查重字段"
                                        {...formItemLayout}>
                                        {getFieldDecorator('batch_lead_check_field',
                                            { initialValue : leadBatchCheckedConfArray || [] }
                                        )(
                                            <Checkbox.Group options={leadBatchConfArray}/>
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                { !!stuQuerySuc ?
                    <div style = {{ marginBottom : 40 }} className='zj_check_same_rules_area'>
                        <div className={styles.title}>
                            <div className={styles.title_block}></div>
                            <div className={styles.title_content}>学员查重规则</div>
                            <Popover
                                trigger="hover"
                                placement="right"
                                content={
                                    <div>
                                        <div>1.可设置学员列表中添加新名单时的查重规则</div>
                                        <div>2.可在商户（所有机构）级别或单校区级别查重</div>
                                        <div>3.学员中姓名查重可选，家长手机号在同一校区不允许重复，在不同校区可重复</div>
                                    </div>
                                }
                            >
                                <Icon type="question-circle-o" />
                            </Popover>
                        </div>
                        <div className={styles.check_rules}>
                            <div className={styles.check_rules_name}>
                                <div>单条添加</div>
                                <div>批量导入</div>
                            </div>
                            <div className={styles.check_rules_content}>
                                <div className={styles.check_rules_content_form}>
                                    <Form.Item
                                        label="查重范围"
                                        {...formItemLayout}>
                                        {getFieldDecorator('single_stu_check_range',
                                            { initialValue : stuSingleScope || undefined }
                                        )(
                                            <Radio.Group>
                                                <Radio value='0'>校区</Radio>
                                                <Radio value='1'>商户</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="查重字段"
                                        {...formItemLayout}>
                                        {getFieldDecorator('single_stu_check_field' ,
                                            { initialValue : stuSingleCheckedConfArray || [] }
                                        )(
                                            <Checkbox.Group options={stuSingleConfArray}/>
                                        )}
                                    </Form.Item>
                                </div>
                                <div className={styles.check_rules_content_form}>
                                    <Form.Item
                                        label="查重范围"
                                        {...formItemLayout}>
                                        {getFieldDecorator('batch_stu_check_range' ,
                                            { initialValue : stuBatchScope || undefined }
                                        )(
                                            <Radio.Group>
                                                <Radio value='0'>校区</Radio>
                                                <Radio value='1'>商户</Radio>
                                            </Radio.Group>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="查重字段"
                                        {...formItemLayout}>
                                        {getFieldDecorator('batch_stu_check_field' ,
                                            { initialValue : stuBatchCheckedConfArray || [] }
                                        )(
                                            <Checkbox.Group options={stuBatchConfArray}/>
                                        )}
                                    </Form.Item>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                {/*两项只要加载出一项即可保存*/}
                { !!stuQuerySuc || !!leadQuerySuc ?
                    <Button type = "primary" onClick = { submit } loading = { buttonLoading } disabled = { buttonLoading }>保存</Button>
                    :
                    null
                }
                {/*两项全部请求失败非加载页面，则显示空数据页面*/}
                { !stuQuerySuc && !leadQuerySuc && !loading?
                    <NullData content = '学员和名单查重规则全部加载失败，请检查您的网络并刷新重试' height = '200px'/>
                    :
                    null
                }
            </Spin>
        </div>
    );
}

export default Form.create()(CheckSameRule);
