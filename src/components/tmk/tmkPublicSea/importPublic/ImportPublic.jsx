import React from 'react'
import { Steps, Button, Modal } from 'antd'
import FirstStep from './firstStep/FirstStep'
import SecondStep from './secondStep/SecondStep'
import InfoMatch from './infoMatch/InfoMatch'
import ThirdStep from './thirdStep/ThirdStep'
import FourthStep from './fourthStep/FourthStep'

const Step = Steps.Step

function ImportPublic({
  importVisible,
  importStep,     //当前步数
  importLoading,

  importNext,     //下一步
  importPrev,     //上一步
  importCancel,   //取消

  /** 第一步 */
  cityList,       //城市下拉
  importDeptId,   //选中城市

  deptIdChange,

  /** 第二步 */
  uploadSuc,
  importName,         //导入上传文件名

  uploadChange,       //选择文件onChange事件
  downloadTemplate,   //点击下载数据模板

  /** 第三步 */
  importTableTitle,                       //表头
  importTableDataSourse,                  //列表数据
  importTableTotal,                       //列表数据数量

  /** 信息配对 */
  leadsImportSecondSuc,               //第二步是否完成
  secondStepMatchData,                //第二步匹配数据
  secondStepMisMatchData,             //第二步不匹配数据
  secondStepSelectData,               //第二步下拉列表数据

  SecondStepSelectOnChange,           //第二步下拉列表onChange事件
}){

  const btnName = importStep === 4 ? '确认' : '下一步'
  const disabled = importStep === 1 ? !uploadSuc : importStep === 2 ? !leadsImportSecondSuc : false

  const footer = importStep === 0 ? [
    <Button
      key="submit"
      type="primary"
      onClick={importNext}
      loading={importLoading}
      style={{ marginLeft: 10 }}>
      下一步
    </Button>
  ] : [
    <Button
      key="cancel"
      type="ghost"
      loading={importLoading}
      onClick={importPrev}>
      上一步
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={importNext}
      disabled={disabled}
      loading={importLoading}
      style={{ marginLeft: 10 }}>
      {btnName}
    </Button>
  ]

  //模态框的属性
  const modalOpts = {
    title: "导入数据",
    maskClosable: false,
    visible: importVisible,
    closable: true,
    width: 1000,
    onCancel: importCancel,
    footer: footer
  }

  //第一步
  const firstProps = {
    cityList,       //城市下拉
    importDeptId,   //选中城市

    deptIdChange,
  }

  //第二步
  const secondProps = {
    importName,         //导入上传文件名

    uploadChange,       //选择文件onChange事件
    downloadTemplate    //点击下载数据模板
  }

  //信息配对
  const matchProps = {
    secondStepMatchData,                //第二步匹配数据
    secondStepMisMatchData,             //第二步不匹配数据
    secondStepSelectData,               //第二步下拉列表数据

    SecondStepSelectOnChange,           //第二步下拉列表onChange事件
  }

  //第三步
  const thirdProps = {
    importTableTitle,                       //表头
    importTableDataSourse,                  //列表数据
    importTableTotal,                       //列表数据数量
  }

  //第四步
  const fourthProps = {
    importLoading,      //导入按钮加载状态
  }

  const steps = [{
    title: '选择城市',
    content: <FirstStep {...firstProps} />,
  }, {
    title: '上传文件',
    content: <SecondStep {...secondProps} />,
  }, {
    title: '信息配对',
    content: <InfoMatch {...matchProps} />,
  }, {
    title: '预览表格',
    content: <ThirdStep {...thirdProps} />,
  }, {
    title: '导入数据',
    content: <FourthStep {...fourthProps} />,
  }]

  return (
    <Modal {...modalOpts}>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Steps current={importStep} style={{ marginBottom: 30 }}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div>{steps[importStep].content}</div>
      </div>
    </Modal>
  )
}

export default ImportPublic
