import React from 'react';
import { DatePicker, Button, message, Icon, Form, Popover } from 'antd';
import moment from 'moment';
import TreeSelectOrgDept from '../../../common/new-component/tree-select-org-dept/TreeSelectOrgDept';
import styles from '../class-month-knot-sheet/ClassMonthKnotTop.less';

const { MonthPicker } = DatePicker;    //按月选择

function TimeMonthTop({
	buttonLoading,           //按钮loading

    //方法
    selectOrgName,           //选择校区
	changeMonth,             //选择月份
	generatingReports,       //生成报表
	exportReports,           //导出报表

    form : {
        setFieldsValue,
        getFieldDecorator,
    }
}){

    /*不可选日期*/
    function disabledMonth(current){
        // return current && current > moment().endOf('day');
        return false
    }

    //select和小区选择的onChange事件
    function selectOnChange(key,value){
        let obj = {};
        obj[key] = value;
        setFieldsValue(obj)
        selectOrgName(obj)
    }


    return(
        <div>
            <div className = { styles.report_form_top_header } >
                <div className={styles.org}>
                    { getFieldDecorator('tenantId-orgId')(
                        <TreeSelectOrgDept allowClear = { true } onChange = {(e) => selectOnChange('tenantId-orgId',e)}/>
                    )}
                </div>
                <div className = { styles.top_header_select } style={{ marginRight: 10 }} >
                    <MonthPicker disabledDate = { disabledMonth } onChange = { changeMonth } placeholder = '请选择月份' />
                </div>

                <Popover content="按签订日期筛选，显示签订日期在筛选月份的月末当天及以前的所有合同">
                    <Icon type="info-circle" className={styles.tip_icon} />
                </Popover>

                <Button type = 'primary' className = { styles.btn } onClick = { () => generatingReports() } loading = { !!buttonLoading } disabled = { !!buttonLoading }>
                    { buttonLoading ? null : <Icon type = 'picture' /> }
                    { buttonLoading ? '统计中' : '生成报表' }
                </Button>
                <Button style = {{ background : '#88c702', border : '1px solid #88c702', color : '#fff' }} className = { styles.export_btn } onClick = { () => exportReports() }>
                    <Icon type = 'export' />按查询结果导出
                </Button>
            </div>
        </div>
    );
}

export default Form.create()(TimeMonthTop);
