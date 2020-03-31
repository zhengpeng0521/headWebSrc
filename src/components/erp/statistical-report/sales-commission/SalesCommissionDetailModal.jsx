import React from 'react';
import { Form, Input, Modal, Button, Upload, Icon, message, Select, Transfer, Spin } from 'antd';
import styles from './SalesCommission.less';

//模板1新增文章
const SalesCommissionDetailModal = ({
    salesDetailVisible,     //销售详情表单是否显示
    salesDetailContent,     //销售详情数据
    salesDetailSpining,     //销售详情数据是否加载完成
    salesDetailName,        //销售详情姓名
    salesDetailNameHeight,  //销售详情名字高度(css用)
    salesDetailTotal,       //销售详情总计
    salesDetailModalCancel
  }) => {

    let children = [];
    if(salesDetailContent && salesDetailContent.length > 0){
        children = salesDetailContent.map((item,index) => {
            return(
                <div key={index}>
                    <div className={styles.topTitleAndContent} style={{width:'275px',border:'1px solid #dddddd',borderLeft:'',borderTop:''}}>
                        <div style={{height:'25px',lineHeight:'28px',width:'275px'}} className={styles.popover}>
                            缴费编号:{item.id}
                        </div>
                        <div style={{height:'25px',lineHeight:'25px',width:'275px'}} className={styles.popover}>
                            课程信息:{item.proName}
                        </div>
                    </div>
                    <div className={styles.topTitleAndContent} style={{float:'left',height:'50px',width:'100px',border:'1px solid #dddddd',textAlign:'center',lineHeight:'50px',borderLeft:'',borderTop:''}}>
                        {item.payMoney}
                    </div>
                    <div className={styles.topTitleAndContent} style={{float:'left',height:'50px',width:'100px',border:'1px solid #dddddd',textAlign:'center',lineHeight:'50px',borderLeft:'',borderTop:''}}>
                        {item.percent}
                    </div>
                    <div className={styles.topTitleAndContent} style={{float:'left',height:'50px',width:'100px',border:'1px solid #dddddd',textAlign:'center',lineHeight:'50px',borderLeft:'',borderTop:''}}>
                        {item.perMoney}
                    </div>
                </div>
            );
        });
    }else{
        return (
            <div></div>
        );
    }

    //模态框的属性
    let modalOpts = {
        title: '销售明细',
        maskClosable : false,
        visible : salesDetailVisible,
        closable : true,
        width : 760,
        onCancel : salesDetailModalCancel,
        footer : '',
        className : 'zj_sales_commission_modal'
    };

    return (
        <div>
            <Modal {...modalOpts} style={{minWidth:'760px'}}>
                <Spin tip="Loading..." spinning={salesDetailSpining}>
                    <div className={styles.allModal}>
                        <div style={{float:'left',height:salesDetailNameHeight,lineHeight:salesDetailNameHeight,width:'125px',border:'1px solid #dddddd',textAlign:'center'}}>
                            {salesDetailName}
                        </div>
                        <div className={styles.topTitleAndContent} style={{width:'275px',backgroundColor:'#f5f5f5',border:'1px solid #dddddd',borderLeft:''}}>
                            名称
                        </div>
                        <div className={styles.topTitleAndContent} style={{width:'100px',backgroundColor:'#f5f5f5',border:'1px solid #dddddd',borderLeft:''}}>
                            销售金额
                        </div>
                        <div className={styles.topTitleAndContent} style={{width:'100px',backgroundColor:'#f5f5f5',border:'1px solid #dddddd',borderLeft:''}}>
                            占比
                        </div>
                        <div className={styles.topTitleAndContent} style={{width:'100px',backgroundColor:'#f5f5f5',border:'1px solid #dddddd',borderLeft:''}}>
                            占比金额
                        </div>

                        { children || [] }

                        <div className={styles.topTitleAndContent} style={{width:'275px',border:'1px solid #dddddd',borderLeft:'',borderTop:'',backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>
                            总计
                        </div>
                        <div className={styles.topTitleAndContent} style={{width:'200px',border:'1px solid #dddddd',borderLeft:'',borderTop:'',backgroundColor:'#fcdd4f',borderRight:'1px solid #cccccc'}}>

                        </div>
                        <div className={styles.topTitleAndContent} style={{width:'100px',border:'1px solid #dddddd',borderLeft:'',borderTop:'',backgroundColor:'#fcdd4f'}}>
                            {salesDetailTotal}
                        </div>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default SalesCommissionDetailModal;
