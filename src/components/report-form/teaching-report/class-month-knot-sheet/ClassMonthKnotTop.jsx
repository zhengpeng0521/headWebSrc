/*
* @author yhwu
* 课时月结表 头部
*/
import React from 'react';
import Media from 'react-media';
import { Dropdown, Menu, Select, DatePicker, Button, Radio, message, Icon, Form, Popover, Modal } from 'antd';
import moment from 'moment';
import TreeSelectOrgDept from '../../../common/new-component/tree-select-org-dept/TreeSelectOrgDept';
import styles from './ClassMonthKnotTop.less';

const MenuItem = Menu.Item;            //菜单项
const { MonthPicker } = DatePicker; //按月选择
function ClassMonthKnotTop({
    modalToVisible,
    menuOrgList,             //校区下拉列表
    isShowOrgName,           //是否选择了校区
    orgId,                   //所选校区Id
    orgName,                 //所选校区Name
    buttonLoading,           //按钮loading
    startDate,
	endDate,
    //方法
    selectOrgName,           //选择校区
    clickToClearOrg,         //点击清除所选orgName
    changeMonth,             //选择月份
    generatingReports,       //生成报表
    exportReports,           //导出报表
    exportReportsVip,
    exportReportsCloud,     //云数据更新
    queryPeriodMonthTotal,
    setModalToVisible,   //点击时模态框确定，确定按钮
    setModalVisible,    //点击时模态框确定，取消按钮
    getStartDate,
    getEndDate,
    content,
    shadow,
    form: {
        setFieldsValue,
        getFieldDecorator,
    },

}) {

    //select和小区选择的onChange事件
    function selectOnChange(key, value) {
        let obj = {};
        obj[key] = value;
        setFieldsValue(obj)
        selectOrgName(obj)
    }

    //不可选日期
    function disabledMonth(current) {
        return current > moment().endOf('day');
    }

    let menu = (
        <Menu onClick={(e) => selectOrgName(e.key)}>
            {
                !!menuOrgList && menuOrgList.map(function (item, index) {
                    return (
                        <MenuItem key={'menuOrgSelect_' + index} >
                            <span>{item.orgName}</span>
                        </MenuItem>
                    )
                })
            }
        </Menu>
    )
    //			<div className = { styles.top_header_orgName } >
    //				<span className = { styles.top_header_orgName_label } >统计校区</span>
    //				<Dropdown overlay = { menu } trigger = { [ 'click' ] } >
    //					<a className = { styles.top_header_orgName_value } >{ isShowOrgName ? orgName : (( !!menuOrgList && menuOrgList.length > 0 && menuOrgList.length + '家') || '暂无校区可选') }</a>
    //				</Dropdown>
    //				{ !!isShowOrgName &&
    //					<a onClick = { clickToClearOrg } className = { styles.top_header_clear } >清除</a>
    //				}
    //			</div>

    const disabledDate = function (current) {
        let d = new Date('2019-09-30')
        if(window._init_data.language === 'dsf') {
          return current < d;
        }
    };

    return (
        <div>
            <Modal
                className="gx_ysj_course_manage_modal"
                centered
                title="更新云数据"
                visible={modalToVisible}
                onOk={setModalToVisible}
                onCancel={setModalVisible}
                okButtonProps={{ disabled: true }}
            >
                <div className={styles.export_btn_block}>
                    <span className={styles.export_select_date}>选择日期 :</span>
                    <MonthPicker
                        format="YYYY-MM"
                        placeholder="请选择月份"
                        disabledDate={disabledDate}
                        onChange={getStartDate}
                    />
                </div>
                {shadow ? <span className={styles.fontstyle}>时间不能为空</span> : null}
                <div className={styles.export_break_style}>
                <span className={styles.font_style}>1、更新云数据将花费较长时间，每次最多可更新1个月数据</span>
                <span className={styles.font_style}>2、为保证数据正常更新，请在08:00-22:00这段间内操作，每15天可更新一次</span>
                <span className={styles.font_style}>3、我们努力在两小时内将历史数据更新完毕</span>
                </div>
            </Modal>
            <div className={styles.report_form_top_header} >
                <div className={styles.org}>
                    {getFieldDecorator('tenantId-orgId')(
                        <TreeSelectOrgDept allowClear={true} onChange={(e) => selectOnChange('tenantId-orgId', e)} />
                    )}
                </div>
                <div className={styles.top_header_select} >
                    <MonthPicker disabledDate={disabledMonth} onChange={changeMonth} defaultValue={moment()} placeholder='请选择月份' />
                </div>
                <Button type='primary' className={styles.btn} onClick={() => generatingReports()} loading={!!buttonLoading} disabled={!!buttonLoading}>
                    {buttonLoading ? null : <Icon type='picture' />}
                    {buttonLoading ? '统计中' : '生成报表'}
                </Button>
                <Popover content={content}>
                    <Button className={styles.export_btn_cloud} onClick={exportReportsCloud}>更新云数据</Button>
                </Popover>
                <Button style={{ background: '#FBB323', border: '1px solid #FBB323', color: '#fff' }} className={styles.export_btn_vip} onClick={exportReportsVip}>
                    <Icon type='export' />按课程维度导出
                </Button>
                <Button style={{ background: '#88c702', border: '1px solid #88c702', color: '#fff' }} className={styles.export_btn} onClick={exportReports}>
                    <Icon type='export' />按会员卡导出
                </Button>
            </div>
            <div className={styles.report_form_top_total}>
                <ul className={styles.report_form_top_total_title}>
                    <li>统计类型</li>
                    <li>上月底剩余课时</li>
                    <li>上月底剩余金额</li>
                    <li>本月增加课时</li>
                    <li>本月实收金额</li>
                    <li>本月应收金额</li>
                    <li>总剩余课时</li>
                    <li>总剩余金额</li>
                    <li>本月已消耗课时</li>
                    <li>本月已消耗金额</li>
                    <li>转课转出总课时</li>
                    <li>转课转出总金额</li>
                    <li>转课转入总课时</li>
                    <li>转课转入总金额</li>
                    <li>转校转出总数量</li>
                    <li>转校转出总金额</li>
                    <li>转校转入总数量</li>
                    <li>转校转入总金额</li>
                    <li>总退课时</li>
                    <li>总退课金额</li>
                    <li>总退课手续费</li>
                    <li>总过期作废课时</li>
                    <li>总过期作废金额</li>
                    <li>总消耗课时</li>
                    <li>总消耗金额</li>
                    <li>总剩余课时</li>
                    <li>总剩余金额</li>
                </ul>
                <ul className={styles.report_form_top_total_date}>
                    <li>总计</li>
                    <li>{queryPeriodMonthTotal.periodEndLeftNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodEndLeftMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodAddNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.payMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.oriMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.totalPeriodLeftNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.totalPeriodLeftMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodCostNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodCostMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranOutNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranOutMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranInNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranInMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranSchOutNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranSchOutMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranSchInNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodTranSchInMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodRefundNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodRefundMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodRefundFeeTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodExpireNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodExpireMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodAllCostTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodAllCostMoneyTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodLeftNumTotal || '0'}</li>
                    <li>{queryPeriodMonthTotal.periodLeftMoneyTotal || '0'}</li>
                </ul>
            </div>
        </div>
    );
}

export default Form.create()(ClassMonthKnotTop);
