import React from 'react';
import { Tabs , Form , Modal , Button , Input , Select , Popover } from 'antd';
import styles from './AccountDetailsComponent.less';
import ClassPackageComponent from '../../common/new-component/manager-list/ManagerList';
import { AlertModal } from '../../common/new-component/NewComponent';
import VeryCodeButton from '../../../pages/common/very-code-button/VeryCodeButton';
import moment from 'moment';
import accountWaterColumn from './column/accountWaterColumn';
import paymentDetailsColumn from './column/paymentDetailsColumn';
import refundDetailsColumn from './column/refundDetailsColumn';
import withdrawalsRecordColumn from './column/withdrawalsRecordColumn';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

function AccountDetailsComponent({
    accountBalance,
    availableBalance,
    tableLoading,
    routeChange,
    isChecked,
    isPickOn,
    accountFlow,        //账户流水展示数据
    withdrawalsRecord,  //提现记录展示数据
    accountFlowData,    //账户流水表格数据
    accountFlowChangeColumns,
    accountFlowChangeColumns1,
    accountFlowNewColumns,
    accountFlowNewColumns1,
    applicationFun,        //提现申请
    hasPhoneNum,
    showAlertModal,
    AlertModalOnCancelFun,
    alertModalButtonLoading,
    CancelXuzhiModal,
    showXuzhiModal,
    remindedFun,
    mentionStates,
    mentionWay, mentionWayList,mentionAcctName,mentionAcctNo,mentionBank,mentionAlipayAccount,
    mentionPhone,
    mentionSubmitAction,//提交
    verificationCodeFun,
    pageIndex,
    pageSize,
    total,
    pageIndexChange,
    changeRoute,
    tixianjine,
    onSelectFun, //切换显示
    selectValue, //切换支付方式值
    tabsKey,
    changeTabsKey,
    searchFun,
    clearFun,
    checkOutTable,
    startDate,
    endDate,
    tabsKeyArr,
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
    totalIncome,  						//总收入
	incomeNum,							//收入几笔
}) {

    function checkAmount( rule , value, callback ){
	    if(value && value != ''){
	      if((value < 200 || value > 50000)){
	          callback('提现金额须大于等于200，小于等于50000');
	        } else {
	          callback();
	        }
	    } else {
	        callback();
	    }
	  };

    let formItemLayout = {
		labelCol   : { span : 5 },
		wrapperCol : { span : 19 }
	};

    if (routeChange == true) {
        isChecked = true;
        isPickOn = false;
    }

    //整数
    function checkNum(rule, value, callback){
        if(value && value != '') {
	      if(!(/^[0-9]\d*$/.test(value))){
	          callback('请填写整数');
	        } else {
	          callback();
	        }
	    } else {
	      callback();
	    }
    }

    //最多保留两位小数
	function checkIntegerNum(rule, value, callback) {
		if(value && value != '') {
			if(!(/^-?\d+(\.\d{1,2})?$/.test(value))){
	    		callback('最多保留两位小数');
	    	} else {
	    		callback();
	    	}
		} else {
			callback();
		}
	}


    let AccountDetailComProp = {
        rightBars : (tabsKey == tabsKeyArr[1].id || tabsKey == tabsKeyArr[2].id) ? {
            btns : [
                {
                    label    : '导出',
                    handle   : checkOutTable,
                    type     : 'button'
                }
            ],
        } : undefined,

        search : (tabsKey == tabsKeyArr[1].id || tabsKey == tabsKeyArr[2].id) ? {
			showSearch : true,
			onSearch : searchFun,
			onClear : clearFun,
			wetherClear : false,
			fields : [
                {
                    key : 'orgname',
                    type : 'dept_org',
                    placeholder : '请选择校区'
                },
                {
                    key : 'busTime',
                    type : 'rangePicker',
                    initialValue : [moment(startDate,'YYYY-MM-DD'),moment(endDate,'YYYY-MM-DD')],
                    showTime : false,
                    width : 300,
                    format : 'YYYY-MM-DD'
                },
				{
					key : 'busType',
					type : 'select',
					placeholder : '业务类型',
					options : [{key : '10' , label : '微游戏'},
                               {key : '11' , label : '微活动'},
                               {key : '12' , label : '微官网活动'}],
				},
                {
					key : 'busName',
					type : 'input',
					placeholder : '业务名称',
				},
			]
		} : undefined,
		incomeBars:(tabsKey == tabsKeyArr[1].id || tabsKey == tabsKeyArr[2].id) ? {
			totalIncomeNum : totalIncome,
			incomeCount : incomeNum,
		} : undefined,
        table: {
            loading : tableLoading,
            rowKey : 'id',
            dataSource : accountFlowData,
            xScroll : 1520,
            height : 363,
    //右上角的设置
            columns: tabsKey == tabsKeyArr[0].id ?
            accountWaterColumn
            :
                tabsKey == tabsKeyArr[1].id ?
                paymentDetailsColumn
                :
                    tabsKey == tabsKeyArr[2].id ?
                    refundDetailsColumn
                    :
                        tabsKey == tabsKeyArr[3].id ?
                        withdrawalsRecordColumn
                        :
                        []
        },

        pagination : {
            total:!isNaN(parseInt(total))?total:0,
            pageIndex : pageIndex,
            pageSize : pageSize,
            showTotal        : total => `总共 ${total} 条`,
            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : pageIndexChange,
            onChange         : pageIndexChange,
        }

    }

    //取消
    function AlertModalOnCancel(){
        resetFields();
        AlertModalOnCancelFun();

    }
    //提现申请 弹框
    let AlertModalProps = {
        visible : showAlertModal,                //提示框是否显示
        title : '提现申请',                    //提示框标题
        content : mentionStates == 10000 ? '没有绑定安全手机号码' :  mentionStates == 20000 ? '没有设置银行卡' : '银行卡信息不完整',                //提示框内容
        onCancel : AlertModalOnCancel,              //提示框点击取消
        buttonLoading : alertModalButtonLoading,    //提示框按钮是否加载状态
        footerEnsure : '马上去设置',
        onOk : changeRoute,
    }

    //申请提现 提交
    function mentionSubmit(){
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
     		mentionSubmitAction(values);
        });
    }

    let AlertModalProps1 = {
        visible : showAlertModal,                //提示框是否显示
        title : '提现申请',                    //提示框标题
        footer : [
            <Button key="cancel" type="ghost" onClick={AlertModalOnCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    style={{marginLeft:'10px'}}
                    onClick={mentionSubmit}>提交</Button>
        ],
        onCancel : AlertModalOnCancel,
        className : 'online_account_cash_application'
    }

    //提现须知的弹框
    let AlertModalNotice = {
        visible : showXuzhiModal,
        title : '提现须知',
        content : (
                <div style={{textAlign:'left'}}>
					<p>1、闪闪提供支付代收服务，用户通过线上微信支付金额直接进入闪闪微信支付的代收账号中。</p>
					<p>2、用户成功支付订单时，微信会收取占交易金额一定比例的手续费。此手续费由微信官方统一扣费。</p>
					<p>3、提现手续费统一为交易额的1％。</p>
					<p>4、申请提现请在营销模板的支付中心进行操作，每周四会统一审核各机构提交的提现申请。</p>
					<p>5、单次提现最高不超过5万。</p>
					<p>6、到账时间：审核通过后2天左右到账，若遇到法定节假日顺延。</p>
                </div>
            ),
        onCancel : CancelXuzhiModal,
        onOk : CancelXuzhiModal,
    }

    //手机号码截取
    let mentionPhone1 = !!mentionPhone && mentionPhone.length > 0 ? mentionPhone.substr(0, 3) + '****' + mentionPhone.substr(7) : undefined;

    //获取验证码
    function verificationCodeFunction(){
        let value = mentionPhone;
        verificationCodeFun(value)
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.accountTitle }>
                <p>可用余额 : <span>{ (accountBalance - availableBalance).toFixed(2) }</span>元</p>
                <Button type="primary" size="default" onClick={ applicationFun }>提现</Button>
                <Button size="default" onClick={ remindedFun }>提现需知</Button>
            </div>


            <Tabs activeKey = { tabsKey } onChange={ changeTabsKey }>
                { tabsKeyArr && tabsKeyArr.map((item) => <TabPane tab={item.name} key={item.id}></TabPane> ) }
            </Tabs>

            <ClassPackageComponent {...AccountDetailComProp} />
            { (mentionStates == 10000 || mentionStates == 20000 || mentionStates == 30000) ?
                <AlertModal {...AlertModalProps}/>
                :
                mentionStates == 9000 ?
                <Modal {...AlertModalProps1}>
                    <Form>
                        {!!showAlertModal &&
                        <FormItem
                            { ...formItemLayout }
                            label = "提现方式"
                        >
                            { getFieldDecorator('mentionWay' , {
                                initialValue : selectValue,
                                rules : [
                                    { required : true , message : '请选择提现方式' },
                                ],
                            })(
                                <Select
                                    notFoundContent = "未找到"
                                    showSearch
                                    allowClear
                                    size = 'default'
                                    placeholder = '请选择提现方式'
                                    optionFilterProp = "children"
                                    onSelect = {onSelectFun}
                                    >
                                    { mentionWayList && mentionWayList.map((item, index) =>
                                       <Option key={'mention_way_opt_'+index} value={`${index}`}>{item.name}</Option>
                                	)}
                                </Select>
                            )}
                        </FormItem>
                            }

                         {
                            mentionWay == 'alipay' ? <FormItem
                                { ...formItemLayout }
                                label =  "账号名称"
                            >
                                { getFieldDecorator('accountName' , {
                                    initialValue : mentionAlipayAccount || undefined,
                                    rules : [
                                        {
                                            required : true,
                                            message : '请填写账户名称！'
                                        },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem> : ''

						}

                        {
                             mentionWay == 'bank' ? <FormItem
                                { ...formItemLayout }
                                label =  "户名"
                            >
                                { getFieldDecorator('accountName' , {
                                    initialValue : mentionAcctName || undefined,
                                    rules : [
                                        {
                                            required : true,
                                            message : '请填写户名！'
                                        },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem> : ''

						}

						{
                        	(mentionWay == 'alipay' || mentionWay == 'bank')?
                        	<FormItem
                                { ...formItemLayout }
                                label = "账号/卡号"
                            >
                                { getFieldDecorator('acctNo' , {
                                    initialValue : mentionAcctNo || undefined,
                                    rules : [
                                        {
                                            required : true,
                                            message : '请填写账号/卡号！'
                                        },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem>
                        	: ''
                        }

						{
                        	mentionWay == 'bank'?
                        	<FormItem
                                { ...formItemLayout }
                                label = "开户行"
                            >
                                { getFieldDecorator('ourBank' , {
                                    initialValue : mentionBank || undefined,
                                    rules : [
                                        { required : true,  },
                                    ],
                                })(
                                    <Input size = 'default' style = {{ width : '100%' }} disabled/>
                                )}
                            </FormItem>
                        	: ''
                        }

                        {
                            showAlertModal == true ?
                            <FormItem
                                { ...formItemLayout }
                                label = "提现金额"
                            >
                                { getFieldDecorator('mentionShow' , {
                                    initialValue : tixianjine || undefined,
                                    rules : [
                                        { required : true , message : '请输入提现金额!' ,  },
                                        { validator: checkAmount },
                                        { validator: checkIntegerNum },
                                    ],
                                })(
                                    <Input size = 'default' placeholder = "请输入提现金额" style = {{ width : '100%' }}/>
                                )}
                            </FormItem>
                            :
                            ''
                        }
                        <FormItem
                            { ...formItemLayout }
                            label = "实际到账"
                            extra={<div>
                                  将收取1%的提现手续费
                                </div>}
                            >
                            { getFieldDecorator('mentionReal' , {
                                initialValue : '',

                            })(
                                <span className={styles.mentionReal}>{ parseInt(getFieldValue('mentionShow')) * ( 1 - 0.01) || 0}</span>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label = "安全认证手机"
                        >
                            { getFieldDecorator('mentionPhone' , {
                                initialValue : mentionPhone1 || undefined,
                            })(
                                <Input disabled size = 'default' style = {{ width : '100%' }} />
                            )}
                        </FormItem>
                        {
                            showAlertModal == true ?
                            <FormItem
                                { ...formItemLayout }
                                label = "验证码"
                            >
                                { getFieldDecorator('mentionPhoneVal' , {
                                    initialValue : undefined,
                                    rules : [
                                        { required : true , message : '请输入验证码' },
                                        { validator: checkNum },
                                    ],
                                })(
                                    <div>
                                        <Input size = 'default' style = {{ width : 140 }}/>
                                        <VeryCodeButton onClick={verificationCodeFunction}/>
                                    </div>
                                )}
                            </FormItem>
                            :
                            ''
                        }

                    </Form>
                </Modal>
                :
                ''
            }

            <AlertModal {...AlertModalNotice}/>
        </div>
    );
}

export default Form.create({})(AccountDetailsComponent);
