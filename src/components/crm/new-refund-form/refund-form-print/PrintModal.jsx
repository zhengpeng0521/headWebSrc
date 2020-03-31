import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Popover, Icon } from 'antd';
import { do_print } from '../../../../utils/printUtils';
import styles from './PrintModal.less';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

/*退费单打印(包括退款和退课时)*/
const PrintModal = ({
    refundFormPrintModalVisible,             //打印退款单modal是否显示
    refundFormPrintModalPrintType,           //打印退款单类型
    refundFormPrintData,                    //打印退款单选择退款类型以后接口返回的数据

    RefundFormPrintModalCancel,              //打印退款单modal关闭
  }) => {

    //打印
	function print() {
		do_print('zj_new_refund_form_print');
	}

    //模态框的属性
    let modalOpts = {
    title: refundFormPrintModalPrintType == '1' ? '退费打印' : '退课时打印',
    maskClosable : false,
    visible : refundFormPrintModalVisible,
    closable : true,
    width : 800,
    onOk: print,
    onCancel : RefundFormPrintModalCancel,
    footer : [
        <Button key="submit" type="primary"
                onClick={ print }>打印</Button>
    ],
    className : 'new_refund_form_print_modal'
  };

    let printContent;
    if('1' == refundFormPrintModalPrintType){
        printContent = (
            <div className={styles.tr_refund_money} style={{width:'100%',height:'40px',position:'relative'}}>
                <div style={{position:'absolute',left:'0',top:'0',width:'80%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0'}}>
                    退费
                </div>
                <div style={{position:'absolute',left:'80%',top:'0',width:'20%',height:'40px',float:'right',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0',borderLeft:'0'}}>
                    {refundFormPrintData.money}元
                </div>
            </div>
        );
    }else if('2' == refundFormPrintModalPrintType){
        let children = [];
        if(refundFormPrintData.peridInfo && (refundFormPrintData.peridInfo).length > 0){
            children = (refundFormPrintData.peridInfo).map((item) => {
                return(
                    <div key={item.courseId} style={{width:'100%',height:'40px',position:'relative'}}>
                        <div style={{position:'absolute',left:'0',top:'0',width:'80%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0',whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden',padding:'0 10px'}}>
                            <Popover content={'课程：' + (!!item.courseName ? item.courseName : '--')} placement='top'>
                                课程：{ !!item.courseName ? item.courseName : '--' }
                            </Popover>
                        </div>
                        <div style={{position:'absolute',left:'80%',top:'0',width:'20%',height:'40px',float:'right',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderTop:'0',borderLeft:'0'}}>
                            {item.periodNum}
                        </div>
                    </div>
                );
            });
        }
        printContent = (
            <div>
                { children || [] }
            </div>
        );
    }

    return (
        <Modal {...modalOpts}>
            <div id='zj_new_refund_form_print' style={{width:'100%',padding:'20px'}}>
                <div style={{width:'100%',height:'30px',lineHeight:'30px',textAlign:'center',fontSize:'20px'}}>{refundFormPrintData.orgName}</div>
                <div style={{width:'100%',height:'25px',lineHeight:'25px',textAlign:'center',fontSize:'16px'}}>
                    退款单
                    { '1' == refundFormPrintData.status ?
                        (<span>（待退款）</span>)
                        :
                      '2' == refundFormPrintData.status ?
                        (<span>（已退款）</span>)
                        :
                      '3' == refundFormPrintData.status ?
                        (<span>（已驳回）</span>)
                        :
                        ''
                    }
                </div>
                <div style={{width:'100%',height:'20px',lineHeight:'20px',fontSize:'14px'}}>会员卡号&nbsp;：&nbsp;{refundFormPrintData.cardId}</div>

                <div style={{width:'100%',height:'40px',marginTop:'10px',position:'relative'}}>
                    <div style={{position:'absolute',left:'0',top:'0',width:'80%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd'}}>交易内容</div>
                    <div style={{position:'absolute',left:'80%',top:'0',width:'20%',height:'40px',lineHeight:'40px',textAlign:'center',border:'1px solid #dddddd',borderLeft:'0'}}>数量</div>
                </div>

                { printContent || []}

                <div style={{width:'100%',height:'40px',marginTop:'20px',position:'relative'}}>
                    <div style={{position:'absolute',left:'0',top:'0',width:'50%',float:'left',lineHeight:'40px',textAlign:'left',paddingLeft:'10%'}}>
                        账户变动：{ refundFormPrintModalPrintType == '1' ? '-' : '+'}{refundFormPrintData.money}元
                    </div>
                    <div style={{position:'absolute',left:'50%',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left'}}>
                        当前余额：{refundFormPrintData.balance}元
                    </div>
                </div>

                <div style={{width:'100%',height:'40px',position:'relative'}}>
                    <div style={{position:'absolute',left:'0',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left',paddingLeft:'10%'}}>
                        课时变动：{ refundFormPrintModalPrintType == '2' ? '-' : ''}{refundFormPrintData.perid}
                    </div>
                    <div style={{position:'absolute',left:'50%',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left'}}>
                        当前课时：{refundFormPrintData.periodLeft}/{refundFormPrintData.periodAll}
                    </div>
                </div>

                <div style={{width:'100%',height:'40px',position:'relative'}}>
                    <div style={{position:'absolute',left:'0',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left',paddingLeft:'10%'}}>
                        经办人：{refundFormPrintData.uname}
                    </div>
                    <div style={{position:'absolute',left:'50%',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left'}}>
                        经办日期：{refundFormPrintData.createTime}
                    </div>
                </div>

                <div style={{width:'100%',height:'40px',position:'relative',marginBottom:'10px'}}>
                    <div style={{position:'absolute',left:'0',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left',paddingLeft:'10%'}}>
                        电话：{refundFormPrintData.tel}
                    </div>
                </div>

                <div style={{width:'85%',position:'relative',marginBottom:'20px',paddingLeft:'10%'}}>
                    <div style={{width:'100%'}}>
                        处理说明：{refundFormPrintData.refundWay}
                    </div>
                </div>

                <div style={{width:'85%',position:'relative',marginBottom:'20px',paddingLeft:'10%'}}>
                    <div style={{width:'100%'}}>
                        地址：{refundFormPrintData.addr}
                    </div>
                </div>

                <div style={{width:'100%',height:'40px',position:'relative',marginTop:'60px'}}>
                    <div style={{position:'absolute',left:'0',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left',paddingLeft:'10%'}}>
                        经办人签字：
                    </div>
                    <div style={{position:'absolute',left:'50%',top:'0',width:'50%',height:'40px',float:'left',lineHeight:'40px',textAlign:'left'}}>
                        客户签字：
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PrintModal;
