import React from "react"
import { Input, Button, Upload } from "antd"
import styles from "./SecondStep.less"

const SecondStep = ({
  importName,         //导入上传文件名

  uploadChange,       //选择文件onChange事件
  downloadTemplate    //点击下载数据模板
}) => {
  //上传文件
  let uploadProps = {
    name: "file",
    action: `${BASE_URL}/crm/stuInfo/clue/leads/upload/uploadExcel`,
    accept: ".xlsx" || ".xls",
    // data: {
    //   userId : window.uid,
    // },
    showUploadList: false,
    onChange: info => uploadChange(info)
  }

  return (
    <div className={styles.second_step}>
      <div>
        <Input
          placeholder="请选择文件"
          value={importName}
          disabled={true}
          style={{
            float: "left",
            width: "200px",
            border: "0px",
            borderRadius: "5px 0px 0px 5px",
            borderTop: "1px solid #d9d9d9",
            borderBottom: "1px solid #d9d9d9",
            borderLeft: "1px solid #d9d9d9",
            color: "#666"
          }}
        />
        <Upload {...uploadProps}>
          <Button
            type="primary"
            style={{ borderRadius: "0px 5px 5px 0px", float: "left" }}>
            选择文件
          </Button>
        </Upload>
      </div>
      <p>
        请下载<a onClick={downloadTemplate}>数据模板</a>
        来准备数据后上传
      </p>
    </div>
  )
}

export default SecondStep
