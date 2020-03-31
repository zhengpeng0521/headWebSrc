import React from 'react';
import Media from 'react-media';
import { Select, Button, Icon, Form, TreeSelect, Popover } from 'antd';
import moment from 'moment';
import TreeSelectOrgDept from '../../../common/new-component/tree-select-org-dept/TreeSelectOrgDept';
import styles from './PayProjectTop.less';

const FormItem = Form.Item
const Option = Select.Option
const { TreeNode } = TreeSelect

function PayProjectTop({
  buttonLoading,           //按钮loading
  years,                  //年份
  currentYear,
  cityList,               //城市下拉
  orgList,                //校区下拉
  projectList,						//支出项目下拉

  //方法
  citySelect,              //城市select
  resetOrgList,            //重置校区列表
	getList,                 //生成报表
  exportReports,           //导出报表
  popoverTitle,
  popoverContent,

  form : {
      setFieldsValue,
      getFieldDecorator,
      validateFields
  }

}){

  /** 城市change */
  function cityChange(value){
    setFieldsValue({orgIds: undefined})
    if(!value && value !== 0){
      resetOrgList()
    }
  }

  /** 搜索 */
  function getListAction(){
    validateFields((err, values) => {
      if (!err) {
        getList(values)
      }
    })
  }

  function formatData(data){
    return(
        data && data.map((item,index) => {
            if(item.children && item.children.length > 0) {
                return (
                    <TreeNode key = { item.tenant_id + '-' + item.key } initTitle = { item.label } title = {
                            item.mark == 'shop' ? <div className = { styles.item }><Icon type = 'xiaoquguanli' className={styles.icon}/><span>{ item.label }</span></div> : item.label } value = { item.key }>
                        { formatData(item.children) }
                    </TreeNode>
                );
            }else{
                return <TreeNode key = { item.tenant_id + '-' + item.key } initTitle = { item.label } title = {
                            item.mark == 'shop' ? <div className = { styles.item }><Icon type = 'xiaoquguanli' className={styles.icon}/><span>{ item.label }</span></div> : item.label } value = { item.key }/>
            }
        })
    )
  }

    return(
        <div style={{borderBottom: '4px solid #5d9cec'}}>
            <div className = { styles.report_form_top_header } >
              <Form layout="inline">
                <div className={styles.org}>
                  <FormItem>
                    { getFieldDecorator('year', {
                      initialValue: currentYear
                    })(
                      <Select className={styles.select_year} placeholder="请选择支出时间" size="default">
                        {years && years.map((item, index) => {
                          return (
                            <Option key={'year'+index} value={item}>{item}</Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </div>
                {/* <FormItem>
                  { getFieldDecorator('depIds')(
                    <Select
                      className={styles.select}
                      placeholder="请选择城市"
                      allowClear
                      onSelect={citySelect}
                      onChange={cityChange}
                      size="default"
                    >
                      {cityList && cityList.map((city, index) => {
                        return (
                          <Option value={city.key} key={'city'+index} items={city.children || []}>
                            { city.label }
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem> */}
                <div className = { styles.top_header_select } >
                  <FormItem>
                    { getFieldDecorator('depIds')(
                      // <Select className={styles.select} placeholder="请选择校区" allowClear size="default">
                      //   {orgList && orgList.map((org, index) => {
                      //     return (
                      //       <Option value={org.key} key={'org'+index}>
                      //         { org.label }
                      //       </Option>
                      //     )
                      //   })}
                      // </Select>
                      <TreeSelect
                          showSearch
                          style={{ width: 160 }}
                          dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                          placeholder="请选择区域"
                          allowClear
                          treeDefaultExpandAll
                      >
                          <TreeNode value = "all_orgDept" title = "所有校区" key = "all_orgDept" disabled>
                              { formatData(cityList) }
                          </TreeNode>
                      </TreeSelect>
                    )}
                  </FormItem>
                </div>
                {/* <div className = { styles.top_header_select } >
                  <FormItem>
                    { getFieldDecorator('projectId')(
                      <Select className={styles.select} placeholder="请选择支出项目" allowClear size="default">
                        {projectList && projectList.map((item, index) => {
                          return (
                            <Option value={item.key} key={'pro'+index}>
                              { item.label }
                            </Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </div> */}
                <Button type = 'primary' className = { styles.btn } onClick = { getListAction } loading = { !!buttonLoading } disabled = { !!buttonLoading }>
                    { buttonLoading ? null : <Icon type = 'picture' /> }
                    { buttonLoading ? '统计中' : '生成报表' }
                </Button>
                {
                  popoverContent && popoverContent.length > 0 ?
                  <div className={styles.popover_content}>
                    <Popover
                      placement="bottomRight"
                      title={popoverTitle}
                      trigger="click"
                      content={
                        <div className={styles.popoverContent}>
                          {popoverContent && popoverContent.length > 0 && popoverContent.map((item, index) => {
                            return(
                              <p key={index} className={styles.popoverP}><span className={styles.popoverText}>{ item.name }</span>{ item.content }</p>
                            )
                          })}
                        </div>
                      }
                    >
                      <Button type="primary">报表字段定义</Button>
                    </Popover>
                  </div>
                  :
                  null
                }
                <Button style = {{ background : '#88c702', border : '1px solid #88c702', color : '#fff' }} className = { styles.export_btn } onClick = { exportReports }>
                    <Icon type = 'export' />按查询结果导出
                </Button>
              </Form>
            </div>
        </div>
    );
}

export default Form.create()(PayProjectTop);
