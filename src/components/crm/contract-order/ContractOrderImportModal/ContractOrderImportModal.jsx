import React from 'react';
import { Modal, Form, Input, Button, Select, Radio, Spin, message, DatePicker, Steps, Tabs, Upload } from 'antd';
import FirstStep from './FirstStep/FirstStep';          //第一步
import SecondStep from './SecondStep/SecondStep';       //第二步
import ThirdStep from './ThirdStep/ThirdStep';          //第三步
import QueueAnim from 'rc-queue-anim';
import styles from './ContractOrderImportModal.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
const TabPane = Tabs.TabPane;

/*合同导入*/
const ContractOrderImportModal = ({
    contractOrderImportOrgId,                   //批量导入时选择校区ID
    contractOrderImportModalVisible,            //合同导入modal是否显示
    contractOrderImportModalButtonLoading,      //合同导入按钮加载状态
    contractOrderImportModalStep,               //合同导入进行的步数

    ModalOperation,                             //点击modal内按钮
    ContractOrderImportModalClose,              //合同导入modal关闭

    /*第一步*/
    contractOrderImportFirstSuc,                //第一步是否完成
    contractOrderImportModalExcelName,          //合同导入上传文件名
    FirstStepOrgOnChange,                       //选择校区onChange事件
    FirstStepUploadOnChange,                    //选择文件onChange事件
    FirstStepDownLoadDataModal,                 //点击下载数据模板

    /*第二步*/
    secondStepTableTitle,                       //第二步表头
    secondStepTableDataSourse,                  //第二步列表数据
    secondStepTableDataTotal,                   //第二步列表数据数量

    /*第三步*/
    thirdLastButtonDisplay,                     //第三步中上一步按钮是否显示(点击确定后消失)
    LastStepRadioOnChange,                      //第三步单选框onChange事件

  }) => {

    let footer = [];
    if(contractOrderImportModalStep == '0'){
        footer = [
            <Button key="submit" type="primary"
                        disabled = {!contractOrderImportFirstSuc}
                        loading={contractOrderImportModalButtonLoading}
                        onClick={() => ModalOperation('first_next')}
                        style={{marginLeft:10}}>下一步</Button>
        ];
    }else if(contractOrderImportModalStep == '1'){
        footer = [
            <Button key="cancel" type="ghost" onClick={() => ModalOperation('second_prestep')}>上一步</Button>,
            <Button key="submit" type="primary"
                    onClick={() => ModalOperation('second_next')}
                    disabled={contractOrderImportModalButtonLoading}
                    loading={contractOrderImportModalButtonLoading}
                    style={{marginLeft:10}}>下一步</Button>
        ];
    }else if(contractOrderImportModalStep == '2'){
        footer = [
            <Button key="cancel" type="ghost" onClick={() => ModalOperation('last_prestep')} style = {{ display : thirdLastButtonDisplay }}>上一步</Button>,
            <Button key="submit" type="primary"
                    onClick={() => ModalOperation('finish')}
                    disabled={contractOrderImportModalButtonLoading}
                    loading={contractOrderImportModalButtonLoading}
                    style={{marginLeft:10}}>确认</Button>
        ];
    }

    //模态框的属性
    let modalOpts = {
        title: '合同批量导入',
        maskClosable : false,
        visible : contractOrderImportModalVisible,
        closable : true,
        width : 1000,
        onCancel : handleCancel,
        className : 'contractOrder_import_modal',
        footer : footer,
    };

    function handleComplete(e){
        e.preventDefault();
    }

    function handleCancel(e) {
        e.preventDefault();
        ContractOrderImportModalClose();
    }


    //第一步属性
    let firstStepProps = {
        contractOrderImportOrgId,                   //批量导入时选择校区ID
        contractOrderImportModalExcelName,          //合同导入上传文件名

        FirstStepOrgOnChange,                       //选择校区onChange事件
        FirstStepUploadOnChange,                    //选择文件onChange事件
        FirstStepDownLoadDataModal,                 //点击下载数据模板
    }

    //第二步属性
    let SecondStepProps = {
        secondStepTableTitle,                       //第二步表头
        secondStepTableDataSourse,                  //第二步列表数据
        secondStepTableDataTotal,                   //第二步列表数据数量
    }

    //第三步属性
    let ThirdStepProps = {
        contractOrderImportModalButtonLoading,      //合同导入按钮加载状态
        LastStepRadioOnChange,                      //第三步单选框onChange事件
    }

    return (
        <Modal {...modalOpts}>
            <div className={styles.steps}>
                <Steps current = { contractOrderImportModalStep }>
                    <Step title="上传文件" />
                    <Step title="预览表格" />
                    <Step title="导入数据" />
                </Steps>
                <Tabs defaultActiveKey='0' activeKey={ contractOrderImportModalStep + '' }  size="small">
					<TabPane tab="" key='0'>{ contractOrderImportModalStep == '0' ? <FirstStep {...firstStepProps}/> : null }</TabPane>
					<TabPane tab="" key='1'>{ contractOrderImportModalStep == '1' ? <SecondStep {...SecondStepProps}/> : null }</TabPane>
					<TabPane tab="" key='2'>{ contractOrderImportModalStep == '2' ? <ThirdStep {...ThirdStepProps}/> : null }</TabPane>
				</Tabs>
            </div>
        </Modal>
    );
};

export default ContractOrderImportModal;
