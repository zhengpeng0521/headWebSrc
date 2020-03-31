import React from 'react';
import { Modal, Form, Input, Button, Select, Radio, Spin, message, DatePicker, Steps, Tabs, Upload } from 'antd';
import FirstStep from './FirstStep/FirstStep';      //第一步
import SecondStep from './SecondStep/SecondStep';   //第二步
import ThirdStep from './ThirdStep/ThirdStep';      //第三步
import ForthStep from './ForthStep/ForthStep';      //第四步
import QueueAnim from 'rc-queue-anim';
import styles from './LeadsImportModal.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const TabPane = Tabs.TabPane;

/*leads导入modal*/
const LeadsImportModal = ({
    localOrgId,                         //分布系统当前校区orgId
    leadsImportModalVisible,            //leads导入modal是否显示
    leadsImportModalButtonLoading,      //leads导入按钮加载状态
    leadsImportModalStep,               //leads导入进行的步数

    ModalOperation,                     //点击modal内按钮
    LeadsImportModalClose,              //leads导入modal关闭

    /*第一步*/
    leadsImportFirstSuc,                //第一步是否完成
    leadsImportModalExcelName,          //leads导入上传文件名
    FirstStepOrgOnChange,               //选择校区onChange事件
    FirstStepUploadOnChange,            //选择文件onChange事件
    FirstStepDownLoadDataModal,         //点击下载数据模板

    /*第二步*/
    leadsImportSecondSuc,               //第二步是否完成
    secondStepMatchData,                //第二步匹配数据
    secondStepMisMatchData,             //第二步不匹配数据
    secondStepSelectData,               //第二步下拉列表数据

    SecondStepSelectOnChange,           //第二步下拉列表onChange事件

    /*第三步*/
    thirdStepTableTitle,                //第三步表头
    thirdStepTableDataSourse,           //第三步列表数据
    thirdStepTableDataTotal,            //第三步列表数据数量

    /*第四步*/
    forthLastButtonDisplay,             //第四步中上一步按钮是否显示(点击确定后消失)
    ForthStepRadioOnChange,             //第四步单选框onChange事件

  }) => {
console.info(leadsImportModalButtonLoading)
    let footer = [];
    if(leadsImportModalStep == '0'){
        footer = [<Button key="submit" type="primary"
                        disabled = {!leadsImportFirstSuc}
                        loading={leadsImportModalButtonLoading}
                        onClick={() => ModalOperation('first_next')}
                        style={{marginLeft:10}}>下一步</Button>];
    }else if(leadsImportModalStep == '1'){
        footer = [
                <Button key="cancel" type="ghost" onClick={() => ModalOperation('second_prestep')}>上一步</Button>,
                <Button key="submit" type="primary"
                        onClick={() => ModalOperation('second_next')}
                        disabled={!leadsImportSecondSuc}
                        loading={leadsImportModalButtonLoading}
                        style={{marginLeft:10}}>下一步</Button>
            ];
    }else if(leadsImportModalStep == '2'){
        footer = [
                <Button key="cancel" type="ghost" onClick={() => ModalOperation('third_prestep')}>上一步</Button>,
                <Button key="submit" type="primary"
                        onClick={() => ModalOperation('third_next')}
                        disabled={leadsImportModalButtonLoading}
                        loading={leadsImportModalButtonLoading}
                        style={{marginLeft:10}}>下一步</Button>
            ];
    }else if(leadsImportModalStep == '3'){
        footer = [
                <Button key="cancel" type="ghost" onClick={() => ModalOperation('forth_prestep')} style = {{ display : forthLastButtonDisplay }}>上一步</Button>,
                <Button key="submit" type="primary"
                        onClick={() => ModalOperation('finish')}
                        disabled={leadsImportModalButtonLoading}
                        loading={leadsImportModalButtonLoading}
                        style={{marginLeft:10}}>确认</Button>
            ];
    }

    //模态框的属性
    let modalOpts = {
        title: '名单批量导入',
        maskClosable : false,
        visible : leadsImportModalVisible,
        closable : true,
        width : 1000,
        onCancel : handleCancel,
        className : 'leads_import_modal',
        footer : footer,
    };

    function handleComplete(e){
        e.preventDefault();
    }

    function handleCancel(e) {
        e.preventDefault();
        LeadsImportModalClose();
    }


    //第一步属性
    let firstStepProps = {
        localOrgId,                         //分布系统当前校区orgId
        leadsImportModalExcelName,          //leads导入上传文件名

        FirstStepOrgOnChange,               //选择校区onChange事件
        FirstStepUploadOnChange,            //选择文件onChange事件
        FirstStepDownLoadDataModal,         //点击下载数据模板
    }

    //第二步属性
    let SecondStepProps = {
        leadsImportModalStep,               //leads导入进行的步数
        secondStepMatchData,                //第二步匹配数据
        secondStepMisMatchData,             //第二步不匹配数据
        secondStepSelectData,               //第二步下拉列表数据

        SecondStepSelectOnChange,           //第二步下拉列表onChange事件
    }

    //第三步属性
    let ThirdStepProps = {
        secondStepMatchData,                //第二步匹配数据,协助格式化表头
        thirdStepTableTitle,                //第三步表头
        thirdStepTableDataSourse,           //第三步列表数据
        thirdStepTableDataTotal,            //第三步列表数据数量
    }

    //第四步属性
    let ForthStepProps = {
        leadsImportModalButtonLoading,      //leads导入按钮加载状态
        ForthStepRadioOnChange,             //第四步单选框onChange事件
    }

    return (
        <Modal {...modalOpts}>
            <div className={styles.steps}>
                <Steps current = { leadsImportModalStep }>
                    <Step title="上传文件" />
                    <Step title="信息配对" />
                    <Step title="预览表格" />
                    <Step title="导入数据" />
                </Steps>
                <Tabs defaultActiveKey='0' activeKey={ leadsImportModalStep + '' }  size="small">
					<TabPane tab="" key='0'>{ leadsImportModalStep == '0' ? <FirstStep {...firstStepProps}/> : null }</TabPane>
					<TabPane tab="" key='1'>{ leadsImportModalStep == '1' ? <SecondStep {...SecondStepProps}/> : null }</TabPane>
					<TabPane tab="" key='2'>{ leadsImportModalStep == '2' ? <ThirdStep {...ThirdStepProps}/> : null }</TabPane>
					<TabPane tab="" key='3'>{ leadsImportModalStep == '3' ? <ForthStep {...ForthStepProps}/> : null }</TabPane>
				</Tabs>
            </div>
        </Modal>
    );
};

export default LeadsImportModal;
