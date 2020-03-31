/*
 *  OrgOnchange function 校区onChange事件(orgId)
 *  DateOnChange function 日期改变事件(包括下拉列表和时间选择器) { startTime : 'YYYY-MM-DD' , endTime : 'YYYY-MM-DD' }
 *  TabOnChange function tab页onChange事件 参数为选中项的key
 *  GeneratingReports function 点击生成报表
 *  searchContent array 搜索项(type:'select',[{type:'select',render_key:'aaa',render_value:'bbb',options:[]}],默认渲染options中的key和value，可以通过render_key和   render_value格式化渲染参数名)
 *  tabContent array tab页数据[{ key : '1' value : '课程' },{ key : '2' value : '教室' }]，默认选中数组第一项
 *  exportPath string 导出时路径
 *  dataTotal number 查询结果数量，用来判断是否可导出
 *  style object 外来样式
 *  buttonLoading boolean 生成报表按钮加载状态
 */
import React from 'react';
import { Dropdown, Menu, Select, DatePicker, Button, Radio, message, Icon, Form, TreeSelect, Input, Popover, Modal } from 'antd';
import { FormatDate, GetCountDays } from '../../../../utils/dateFormat';
import TreeSelectOrgDept from '../../new-component/tree-select-org-dept/TreeSelectOrgDept';
import Media from 'react-media';
import moment from 'moment';
import dateChooseItem from '../dateData.json';
import styles from './ReportFormTop.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const { TreeNode } = TreeSelect

class SheetTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: this.props.startDate,      //开始时间
            endDate: this.props.endDate,
            modalBoxAppears: this.props.modalBoxAppears,//模态框的判断
            updateDate: this.props.updaDate,  //
            updateshow: this.props.updateshow,//判断按钮的出现
            nowDate: undefined,                                //当前日期
            orgMenuList: [],                                   //校区选择下拉列表
            isShowOrgName: false,                              //是否显示校区名称(未选择校区时false，点击清空时置为false)
            orgId: undefined,                                  //选择校区的id
            orgName: undefined,                               //选择校区后显示的校区名称
            dataSelectValue: this.props.dataSelectValue || undefined, //快捷选择的值
            rangerPicker: this.props.rangerPicker || {},       //时间选择器选择范围
            selectMonth: undefined,
            // searchContent : this.props.searchContent || [],     //搜索栏内容
            tabContent: this.props.tabContent || [],           //导出左边的tabs页面(现在是替换为下拉列表，暂未使用)
            exportPath: this.props.exportPath || undefined,    //导出路径 置于window.open中
            exportObj: this.props.exportObj || undefined,      //导出参数 置于window.open中
            dataTotal: this.props.dataTotal || 0,              //查询结果，用来判断是否可导出(如果是空数组，则不导出)
            style: this.props.style || {},                     //外来样式
            buttonLoading: this.props.buttonLoading || false,  //生成报表按钮加载状态
            cityList: [],                                       //tmk城市下拉
            orgList: [],                                        //tmk校区下拉
            tenantId: undefined,
            getEndDate: this.props.getEndDate,//结束时间的方法
            getStartDate: this.props.getStartDate,//开始时间的方法
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps) {
            if (!!nextProps.exportPath) {
                this.setState({
                    exportPath: nextProps.exportPath
                });
            }
            if (!!nextProps.exportObj) {
                this.setState({
                    exportObj: nextProps.exportObj
                });
            }
            if (!!nextProps.dataTotal) {
                this.setState({
                    dataTotal: nextProps.dataTotal
                });
            }
            if (!!nextProps.style) {
                this.setState({
                    style: nextProps.style
                });
            }
            if (!!nextProps.rangerPicker) {
                this.setState({
                    rangerPicker: nextProps.rangerPicker
                });
            }
            if (!!nextProps.dataSelectValue) {
                this.setState({
                    dataSelectValue: nextProps.dataSelectValue
                });
            }
            if (!!nextProps.firstEnter) {
                this.props.form.resetFields();
                this.setState({
                    isShowOrgName: false,
                    orgId: undefined,
                    dataSelectValue: 'today',
                    rangerPicker: {
                        startTime: this.state.nowDate,
                        endTime: this.state.nowDate
                    }
                })
            }
            this.setState({
                buttonLoading: nextProps.buttonLoading || false
            });
        }
    }
    componentDidMount() {
        this.setState({ buttonLoading: false });
        this.init();
        let that = this
        tmkServiceRequest(`${BASE_URL}/crm/hq/spend/deptOrgTreeQuery`, {},
            function (ret) {
                let all_org_list = ret.deptTreeItemList
                that.setState({
                    // cityList: that.filterMainOrg(all_org_list),  //过滤总部校区
                    cityList: all_org_list,
                })
            }
        );
    }

    componentWillUnmount() {
        this.setState({ buttonLoading: false });
    }
    //点击更新云数据
    updateClond() {
        const date = new Date()
        const hour = date.getHours()
        if (hour >= 8 && hour <=22) {
            this.props.onconfirmDeptOrg(this.colBind.bind(this),this.shutBind.bind(this))
        } else {
            this.shutBind()
            message.warning('请在08:00-22:00这段间内操作');
        }
    }
    //点击云数据模态框的判断关闭
    shutBind() {
        this.setState({
            modalBoxAppears:false,
        })   
    }
    //点击云数据模态框的判断打开
    colBind() {
        this.setState({
            modalBoxAppears:true,
        }) 
    }
    //点击弹框取消
    cancelBtn() {
        this.setState({ modalBoxAppears: false })
        this.setState({
            shadow: false,
            startDate: undefined,
            endDate: undefined,
        })
    }
    filterCan() {
        this.setState({
            modalBoxAppears: false,
            startDate: undefined,
            endDate: undefined,
        })
    }
    affirmBtnBtn() {
        if (this.state.startDate < this.state.endDate) {
            let params = {
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }
            this.props.affirmBtn(params, this.filterCan.bind(this))
            this.setState({ shadow: false })
        } else {
            this.setState({ shadow: true })
        }
    }
    //过滤总部机构
    filterMainOrg(all_org_list) {

        let new_org_list = [];
        if (all_org_list && all_org_list.length > 0) {
            for (let i = 0;i < all_org_list.length;i++) {
                let city_item = {};
                Object.assign(city_item, all_org_list[i]);
                let city_org_list = city_item.children;
                let new_city_org_list = [];
                if (city_org_list && city_org_list.length > 0) {
                    for (let j = 0;j < city_org_list.length;j++) {
                        let org_item = city_org_list[j];
                        if (org_item.pid != '0') {
                            new_city_org_list.push(org_item);
                        }
                    }
                }

                if (new_city_org_list.length > 0) {
                    city_item.children = new_city_org_list;
                    new_org_list.push(city_item);
                }
            }
        }

        return new_org_list;
    }

    init() {
        //列表默认查询今日数据，这里则默认显示头部信息
        let nowObj = window.GetNowDateAndTime();
        let dataSelectValue = 'today'
        let rangerPicker = {
            startTime: nowObj.startDate,
            endTime: nowObj.endDate
        };

        let nowDate = rangerPicker.startTime
        let formatNowDate = new Date(nowDate);
        // 默认为本月时
        if (this.props.default && this.props.default == 'thisMonth') {
            dataSelectValue = 'thisMonth'
            let year = formatNowDate.getFullYear();
            let month = formatNowDate.getMonth() + 1;
            let days = GetCountDays(year, month);           //获取本月有多少天
            rangerPicker.startTime = nowDate.substr(0, 8) + '01';
            rangerPicker.endTime = nowDate.substr(0, 8) + days;
        }
        // 月份选择时，默认当前月
        let selectMonth = undefined
        if (this.props.dateType == 'month') {
            selectMonth = moment().format('YYYY-MM')
        }
        this.setState({
            nowDate,
            orgMenuList: window._init_data.orgIdList || [],
            dataSelectValue,
            rangerPicker,
            selectMonth
        })
    }

    //时间下拉列表选择事件
    fastDateSelectOnChange(e) {
        let rangerPicker = {};
        let nowDate = this.state.nowDate;
        let formatNowDate = new Date(nowDate);
        if (e == 'today') {
            rangerPicker.startTime = nowDate;
            rangerPicker.endTime = nowDate;
        } else if (e == 'yesterday') {
            rangerPicker.startTime = FormatDate(formatNowDate.getTime() - 24 * 60 * 60 * 1000).substr(0, 10);
            rangerPicker.endTime = FormatDate(formatNowDate.getTime() - 24 * 60 * 60 * 1000).substr(0, 10);
        } else if (e == 'week') {
            let week = formatNowDate.getDay();          //获取当前星期几(0-6/周日-周六)
            if (week == 0) {      //如果当前日期是周日
                rangerPicker.startTime = FormatDate(formatNowDate.getTime() - 6 * 24 * 60 * 60 * 1000).substr(0, 10);
                rangerPicker.endTime = nowDate;
            } else {
                rangerPicker.startTime = FormatDate(formatNowDate.getTime() - (week - 1) * 24 * 60 * 60 * 1000).substr(0, 10);
                rangerPicker.endTime = FormatDate(formatNowDate.getTime() - (week - 1 - 6) * 24 * 60 * 60 * 1000).substr(0, 10);
            }
        } else if (e == '7') {
            rangerPicker.startTime = FormatDate(formatNowDate.getTime() - 6 * 24 * 60 * 60 * 1000).substr(0, 10);
            rangerPicker.endTime = nowDate;
        } else if (e == '30') {
            rangerPicker.startTime = FormatDate(formatNowDate.getTime() - 29 * 24 * 60 * 60 * 1000).substr(0, 10);
            rangerPicker.endTime = nowDate;
        } else if (e == 'thisMonth') {
            let year = formatNowDate.getFullYear();
            let month = formatNowDate.getMonth() + 1;
            let days = GetCountDays(year, month);           //获取本月有多少天
            rangerPicker.startTime = nowDate.substr(0, 8) + '01';
            rangerPicker.endTime = nowDate.substr(0, 8) + days;
        } else if (e == 'lastMonth') {
            let days = '';
            if (formatNowDate.getMonth() > 0) {       //不是1月份,直接取上一月份数
                let year = formatNowDate.getFullYear();
                let month = formatNowDate.getMonth();
                days = GetCountDays(year, month);           //获取本月有多少天
                if (formatNowDate.getMonth() >= 10) {
                    rangerPicker.startTime = nowDate.substr(0, 5) + formatNowDate.getMonth() + '-01';
                    rangerPicker.endTime = nowDate.substr(0, 5) + formatNowDate.getMonth() + '-' + days;
                } else {
                    rangerPicker.startTime = nowDate.substr(0, 5) + '0' + formatNowDate.getMonth() + '-01';
                    rangerPicker.endTime = nowDate.substr(0, 5) + '0' + formatNowDate.getMonth() + '-' + days;
                }
            } else {
                rangerPicker.startTime = parseFloat(nowDate.substr(0, 4)) - 1 + '-12-01';
                rangerPicker.endTime = parseFloat(nowDate.substr(0, 4)) - 1 + '-12-31';
            }
        } else if (e == 'free') {
            rangerPicker = this.state.rangerPicker;
        }
        this.setState({
            rangerPicker,
            dataSelectValue: e
        });
        this.props.DateOnChange && this.props.DateOnChange(rangerPicker);
    }

    //时间选择器选择事件
    dateRangePickerOnChange(date, dateString) {
        //如果是选择，则切换至自定义
        let rangerPicker = {};
        rangerPicker.startTime = !!dateString[0] ? dateString[0] : undefined;
        rangerPicker.endTime = !!dateString[1] ? dateString[1] : undefined;
        this.setState({
            rangerPicker,
            dataSelectValue: !!dateString[0] && !!dateString[1] ? 'free' : undefined
        })
        this.props.DateOnChange && this.props.DateOnChange(rangerPicker);

    }

    // 月份选择
    monthOnChange(date, dateString) {
        this.setState({
            selectMonth: dateString
        })
        this.props.DateOnChange && this.props.DateOnChange(dateString);
    }

    disabledStartDate = (startDate) => {
        let { endDate } = this.state
        if (!moment(startDate) || !moment(endDate)) {
            return false
        }
        return new Date().getTime() <= moment(startDate).valueOf() || moment(startDate).valueOf() < moment(endDate).valueOf() - 7776000000

    }
    disabledEndDate = (endDate) => {
        let { startDate } = this.state
        if (!moment(startDate) || !moment(endDate)) {
            return false
        }
        return moment(endDate).valueOf() >= new Date().getTime()
    }
    getStartDate = (value) => {
        this.state.getStartDate(value)
        this.setState({ startDate: value })
    }
    getEndDate = (value) => {
        this.state.getEndDate(value)
        this.setState({ endDate: value })
    }


    //生成报表
    GeneratingReports() {
        if (!this.state.rangerPicker.startTime || !this.state.rangerPicker.endTime) {
            return message.warn('请选择时间范围');
        }
        let formData = this.props.form.getFieldsValue();
        if (!!formData['tenantId-orgId']) {
            let index = formData['tenantId-orgId'].indexOf('-');
            formData.tenantIds = formData['tenantId-orgId'].substr(0, index);
            formData.orgId = formData['tenantId-orgId'].substr(index + 1);              //由于后台太特么2了参数不统一，前端发送orgId和orgIds，值相同
            formData.orgIds = formData['tenantId-orgId'].substr(index + 1);             //由于后台太特么2了参数不统一，前端发送orgId和orgIds，值相同
            delete formData['tenantId-orgId'];
        }
        // dateType
        // 为nothing时，没有时间段选择
        // 为month时，显示月份选择
        let obj = this.props.dateType == 'nothing' ? {
            ...formData
        } : this.props.dateType == 'month' ? {
            orgId: this.state.orgId,
            month: this.state.selectMonth,
            ...formData
        } : {
                    orgId: this.state.orgId,
                    startDate: this.state.rangerPicker.startTime,
                    endDate: this.state.rangerPicker.endTime,
                    ...formData
                }
        // tmk
        if (this.props.tmkCity) {
            obj.tenantId = this.state.tenantId
        }
        if (this.props.tmkOrg) {
            obj.orgId = this.state.orgId
        }
        this.props.GeneratingReports && this.props.GeneratingReports(obj);
    }

    //tabs选择事件
    tabOnChange(key) {
        this.props.TabOnChange && this.props.TabOnChange(key);
    }

    //select和小区选择的onChange事件
    selectOnChange(key, value) {
        let obj = {};
        obj[key] = value;
        this.props.form.setFieldsValue(obj)
    }

    //导出事件
    export() {
        if (typeof (this.state.exportPath) != 'string') {
            return message.warn('路径参数必须是字符串');
        }
        if (isNaN(parseFloat(this.state.dataTotal)) || this.state.dataTotal == '0') {
            return message.warn('无查询结果可导出');
        }
        // if(!this.state.exportObj.startDate || !this.state.exportObj.endDate){
        //     return message.warn('请选择时间范围');
        // }
        window.excelExport(this.state.exportPath, this.state.exportObj);
    }

    /** 城市change */
    cityChange(value) {
        if (!value && value !== 0) {
            this.setState({
                orgList: []
            })
        }
        this.setState({ tenantId: value, orgId: undefined })
    }

    /** 城市select */
    citySelect(value, option) {
        this.setState({
            orgList: option.props.items
        })
    }
    orgChange(value) {
        this.setState({ orgId: value })
    }

    formatData(data) {
        return (
            data && data.map((item, index) => {
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode key={item.tenant_id + '-' + item.key} initTitle={item.label} title={
                            item.mark == 'shop' ? <div className={styles.item}><Icon type='xiaoquguanli' className={styles.icon} /><span>{item.label}</span></div> : item.label} value={item.key}>
                            {this.formatData(item.children)}
                        </TreeNode>
                    );
                } else {
                    return <TreeNode key={item.tenant_id + '-' + item.key} initTitle={item.label} title={
                        item.mark == 'shop' ? <div className={styles.item}><Icon type='xiaoquguanli' className={styles.icon} /><span>{item.label}</span></div> : item.label} value={item.key} />
                }
            })
        )
    }

    render() {
        const { cityList, orgList, tenantId, orgId } = this.state
        const { hasTotal } = this.props
        let { startDate, endDate,modalBoxAppears} = this.state
        //渲染日期下拉列表
        let formatDate = [];
        if (dateChooseItem && dateChooseItem.length > 0) {
            formatDate = dateChooseItem.map((item, index) => {
                return (
                    <Option key={item.key} style={item.key == 'free' ? { display: 'none' } : null}>{item.value}</Option>
                );
            })
        }

        //渲染tab选项
        let radiogroup = [];
        if (this.state.tabContent && this.state.tabContent.length > 0) {
            radiogroup = this.state.tabContent.map((item, index) => {
                return (
                    <Radio.Button key={item.key} value={item.key}>{item.value}</Radio.Button>
                );
            })
        }

        //渲染搜索栏内容
        let searchgroup = [];
        if (this.props.searchContent && this.props.searchContent.length > 0) {
            searchgroup = this.props.searchContent.map((select_item, select_index) => {
                if (select_item.type && select_item.type == 'select') {
                    let initialValue = select_item.notFirst ? undefined : (select_item.initialValue || select_item.options[0].key || select_item.options[0][select_item.render_key])

                    return (
                        <FormItem key={select_index}>
                            {this.props.form.getFieldDecorator(select_item.key, {
                                initialValue
                            })(
                                <Select
                                    notFoundContent="未找到"
                                    showSearch
                                    allowClear={select_item.allowClear}
                                    size='default'
                                    optionFilterProp="children"
                                    placeholder={select_item.placeholder || '排序方式'}
                                    style={{ width: 140 }}
                                    onChange={(e) => this.selectOnChange(select_item.key, e)}>
                                    {select_item && select_item.options.length > 0 ?
                                        select_item.options.map((options_item, options_index) => {
                                            //可以通过外部的render_key和render_value来使传入的options的参数名与渲染参数名对应
                                            return (
                                                <Option value={options_item.key || options_item[select_item.render_key]} key={options_item.key || options_item[select_item.render_key]}>
                                                    {options_item.value || options_item[select_item.render_value]}
                                                </Option>
                                            )
                                        }) : []
                                    }
                                </Select>
                            )}
                        </FormItem>
                    )
                } else if (select_item.type && select_item.type == 'input') {
                    return (
                        <FormItem key={select_index}>
                            {this.props.form.getFieldDecorator(select_item.key, {
                                initialValue: select_item.initialValue
                            })(
                                <Input
                                    size='default'
                                    placeholder={select_item.placeholder || '请输入'}
                                    style={{ width: 140 }} />
                            )}
                        </FormItem>
                    )
                }
            })
        }

        // tmk城市下拉
        let citySearch = (
            <Select
                allowClear
                notFoundContent="未找到"
                showSearch
                size='default'
                placeholder="请选择城市"
                style={{ width: 140 }}
                onChange={(value) => this.cityChange(value)}
                onSelect={this.citySelect.bind(this)}
                value={tenantId}
            >
                {cityList && cityList.length > 0 ? cityList.map((city, index) => {
                    return (
                        <Option value={city.key} key={'city' + index} items={city.children || []}>
                            {city.label}
                        </Option>
                    )
                }) : null}
            </Select>
        )

        // tmk校区下拉
        // let orgSearch = (
        //     <Select
        //         allowClear
        //         notFoundContent = "未找到"
        //         showSearch
        //         size = 'default'
        //         placeholder = "校区 (请先选择城市)"
        //         style = {{ width : 140 }}
        //         value={orgId}
        //         onChange = {(value) => this.orgChange(value)}>
        //         { orgList && orgList.length > 0 ? orgList.map((org, index) => {
        //             return(
        //                 <Option value={org.key} key={'org'+index}>
        //                     { org.label }
        //                 </Option>
        //             )
        //         }) : null}
        //     </Select>
        // )
        let orgSearch = (
            <TreeSelect
                showSearch
                style={{ width: 160 }}
                value={orgId}
                dropdownStyle={{ maxHeight: 250, overflow: 'auto' }}
                placeholder="请选择区域"
                allowClear
                treeDefaultExpandAll
                onChange={(value) => this.orgChange(value)}
            >
                <TreeNode value="all_orgDept" title="所有校区" key="all_orgDept" disabled>
                    {this.formatData(cityList)}
                </TreeNode>
            </TreeSelect>
        )

        const popoverContent = (
            <div className={styles.popoverContent}>
                {this.props.popoverContent && this.props.popoverContent.length > 0 && this.props.popoverContent.map((item, index) => {
                    return (
                        <div key={index} className={styles.popoverP}>
                            <p style={{ color: '#333' }}>
                                <span className={styles.popoverText}>{item.name}</span>
                                {item.content}
                            </p>
                            <p style={{ color: '#909399' }}>{item.annotation}</p>
                        </div>
                    )
                })}
            </div>
        )

        return (
            <Form>
                <Modal
                    className="gx_ysj_course_manage_modal"
                    centered
                    title="更新云数据"
                    onOk={() => this.affirmBtnBtn()}
                    onCancel={() => this.cancelBtn()}
                    visible={modalBoxAppears}
                >
                    <div className={styles.export_btn_block}>
                        <span className={styles.export_select_date}>选择日期:</span>
                        <DatePicker
                            disabledDate={(value) => this.disabledStartDate(value)}
                            format="YYYY-MM-DD"
                            placeholder="开始时间"
                            value={startDate}
                            onChange={(value) => this.getStartDate(value)}
                        />
                        <span className={styles.export_break_line}>~</span>
                        <DatePicker
                            disabledDate={(value) => this.disabledEndDate(value)}
                            format="YYYY-MM-DD"
                            placeholder="结束时间"
                            value={endDate}
                            onChange={(value) => this.getEndDate(value)}
                        />
                    </div>
                    {this.state.shadow ? <span className={styles.fontstyle}>时间不能为空或者开始时间没有大于结束时间</span> : null}
                    <div className={styles.export_break_style}>
                        <span className={styles.font_style}>1、更新云数据将花费较长时间，每次最多可更新3个月数据</span>
                        <span className={styles.font_style}>2、为保证数据正常更新，请在08:00-22:00这段间内操作</span>
                        <span className={styles.font_style}>3、我们努力在两小时内将历史数据更新完毕</span>
                    </div>
                </Modal>
                <Media query="(max-width: 1350px)">
                    {matches => matches ?
                        (
                            <div className={hasTotal ? styles.s_all_total : styles.s_all} style={this.state.style && typeof (this.state.style) == 'object' ? this.state.style : null}>
                                <div className={styles.s_left}>
                                    {!this.props.noOrg && <div className={styles.org}>
                                        {this.props.form.getFieldDecorator('tenantId-orgId')(
                                            <TreeSelectOrgDept allowClear={true} onChange={(e) => this.selectOnChange('tenantId-orgId', e)} />
                                        )}
                                    </div>}
                                    {/* dateType为month时为月份选择 */}
                                    {this.props.dateType == 'nothing' ? null
                                        : this.props.dateType == 'month' ? <div className={styles.data_select} style={{ marginRight: (searchgroup && searchgroup.length > 0) || this.props.tmkCity || this.props.tmkOrg ? 10 : 20 }}>
                                            <MonthPicker
                                                value={this.state.selectMonth ? moment(this.state.selectMonth, 'YYYY-MM') : undefined}
                                                onChange={(date, dateString) => this.monthOnChange(date, dateString)} />
                                        </div>
                                            :
                                            <div className={styles.data_select} style={{ marginRight: (searchgroup && searchgroup.length > 0) || this.props.tmkCity || this.props.tmkOrg ? 10 : 20 }}>
                                                <Select
                                                    notFoundContent="未找到"
                                                    showSearch
                                                    size='default'
                                                    optionFilterProp="children"
                                                    placeholder='日期快捷选择'
                                                    style={{ width: 100, marginRight: 10 }}
                                                    value={this.state.dataSelectValue}
                                                    onChange={(e) => this.fastDateSelectOnChange(e)}>
                                                    {formatDate || []}
                                                </Select>
                                                <RangePicker
                                                    allowClear={false}
                                                    size='default'
                                                    onChange={(date, dateString) => this.dateRangePickerOnChange(date, dateString)}
                                                    style={{ width: 210 }}
                                                    value={[!!this.state.rangerPicker.startTime ? moment(this.state.rangerPicker.startTime, 'YYYY-MM-DD') : undefined,
                                                    !!this.state.rangerPicker.endTime ? moment(this.state.rangerPicker.endTime, 'YYYY-MM-DD') : undefined]}
                                                />
                                            </div>}
                                    {this.props.tmkCity && <div style={{ marginRight: (searchgroup && searchgroup.length > 0) || this.props.tmkOrg ? 10 : 20 }}>{citySearch}</div>}
                                    {this.props.tmkOrg && <div style={{ marginRight: searchgroup && searchgroup.length > 0 ? 10 : 20 }}>{orgSearch}</div>}
                                    {searchgroup && searchgroup.length > 0 ?
                                        <div className={styles.other_search}>
                                            {searchgroup || []}
                                        </div>
                                        :
                                        []
                                    }
                                    <Button type='primary' className={styles.btn} onClick={() => this.GeneratingReports()} loading={this.state.buttonLoading} disabled={this.state.buttonLoading}>
                                        {this.state.buttonLoading ? null : <Icon type="picture" />}
                                        {this.state.buttonLoading ? '统计中' : '生成报表'}
                                    </Button>
                                </div>
                                {(!!this.state.tabContent && this.state.tabContent.length > 0) || !!this.state.exportPath ?
                                    <div className={styles.s_right}>
                                        {this.state.updateshow ? (<Popover content={this.props.content}><Button style={{color: '#5d9cec' }} className={styles.export_btn_cloud} onClick={() => this.updateClond()}>更新云数据</Button></Popover>) : null}
                                        {!!this.state.tabContent && this.state.tabContent.length > 0 ?
                                            <div className='report_form_radioGroup'>
                                                <Radio.Group onChange={(e) => this.tabOnChange(e.target.value)} defaultValue={this.state.tabContent[0].key}>
                                                    {radiogroup || []}
                                                </Radio.Group>
                                            </div>
                                            :
                                            null
                                        }
                                        {
                                            this.props.popoverContent && this.props.popoverContent.length > 0 ?
                                                <div className='report_form_radioGroup'>
                                                    <Popover
                                                        placement="bottomRight"
                                                        title={this.props.popoverTitle}
                                                        trigger="click"
                                                        content={popoverContent}
                                                    >
                                                        <Button type="primary">报表字段定义</Button>
                                                    </Popover>
                                                </div>
                                                :
                                                null
                                        }
                                        {!!this.state.exportPath ?
                                            <div>
                                                <Button className={styles.btn} style={{ background: '#88c702', border: '1px solid #88c702', color: '#fff' }} onClick={() => this.export()}><Icon type="export" />按查询结果导出</Button>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        )
                        :
                        (
                            <div className={hasTotal ? styles.l_all_total : styles.l_all} style={this.state.style && typeof (this.state.style) == 'object' ? this.state.style : null}>
                                <div className={styles.l_left}>
                                    {!this.props.noOrg && <div className={styles.org}>
                                        {this.props.form.getFieldDecorator('tenantId-orgId')(
                                            <TreeSelectOrgDept allowClear={true} onChange={(e) => this.selectOnChange('tenantId-orgId', e)} />
                                        )}
                                    </div>}
                                    {this.props.dateType == 'nothing' ? null
                                        : this.props.dateType == 'month' ? <div className={styles.data_select} style={{ marginRight: (searchgroup && searchgroup.length > 0) || this.props.tmkCity || this.props.tmkOrg ? 10 : 20 }}>
                                            <MonthPicker
                                                value={this.state.selectMonth ? moment(this.state.selectMonth, 'YYYY-MM') : undefined}
                                                onChange={(date, dateString) => this.monthOnChange(date, dateString)} />
                                        </div>
                                            :
                                            <div className={styles.data_select} style={{ marginRight: (searchgroup && searchgroup.length > 0) || this.props.tmkCity || this.props.tmkOrg ? 10 : 20 }}>
                                                <Select
                                                    notFoundContent="未找到"
                                                    showSearch
                                                    size='default'
                                                    optionFilterProp="children"
                                                    placeholder='日期快捷选择'
                                                    style={{ width: 100, marginRight: 10 }}
                                                    value={this.state.dataSelectValue}
                                                    onChange={(e) => this.fastDateSelectOnChange(e)}>
                                                    {formatDate || []}
                                                </Select>
                                                <RangePicker
                                                    size='default'
                                                    allowClear={false}
                                                    onChange={(date, dateString) => this.dateRangePickerOnChange(date, dateString)}
                                                    style={{ width: 210 }}
                                                    value={[!!this.state.rangerPicker.startTime ? moment(this.state.rangerPicker.startTime, 'YYYY-MM-DD') : undefined,
                                                    !!this.state.rangerPicker.endTime ? moment(this.state.rangerPicker.endTime, 'YYYY-MM-DD') : undefined]}
                                                />
                                            </div>}
                                    {this.props.tmkCity && <div style={{ marginRight: (searchgroup && searchgroup.length > 0) || this.props.tmkOrg ? 10 : 20 }}>{citySearch}</div>}
                                    {this.props.tmkOrg && <div style={{ marginRight: searchgroup && searchgroup.length > 0 ? 10 : 20 }}>{orgSearch}</div>}
                                    {searchgroup && searchgroup.length > 0 ?
                                        <div className={styles.other_search}>
                                            {searchgroup || []}
                                        </div>
                                        :
                                        []
                                    }
                                    <Button className={styles.btn} type='primary' onClick={() => this.GeneratingReports()} loading={this.state.buttonLoading} disabled={this.state.buttonLoading}>
                                        {this.state.buttonLoading ? null : <Icon type="picture" />}
                                        {this.state.buttonLoading ? '统计中' : '生成报表'}
                                    </Button>
                                </div>
                                {(!!this.state.tabContent && this.state.tabContent.length > 0) || !!this.state.exportPath ?
                                    <div className={styles.l_right}>
                                        {this.state.updateshow ? (<Popover content={this.props.content}><Button style={{color: '#5d9cec' }} className={styles.export_btn_cloud} onClick={() => this.updateClond()}>更新云数据</Button></Popover>) : null}
                                        {!!this.state.tabContent && this.state.tabContent.length > 0 ?
                                            <div className='report_form_radioGroup'>
                                                <Radio.Group onChange={(e) => this.tabOnChange(e.target.value)} defaultValue={this.state.tabContent[0].key}>
                                                    {radiogroup || []}
                                                </Radio.Group>
                                            </div>
                                            :
                                            null
                                        }
                                        {
                                            this.props.popoverContent && this.props.popoverContent.length > 0 ?
                                                <div className='report_form_radioGroup'>
                                                    <Popover
                                                        placement="bottomRight"
                                                        title={this.props.popoverTitle}
                                                        trigger="click"
                                                        content={popoverContent}
                                                    >
                                                        <Button type="primary">报表字段定义</Button>
                                                    </Popover>
                                                </div>
                                                :
                                                null
                                        }
                                        {!!this.state.exportPath ?
                                            <div>

                                                <Button className={styles.btn} style={{ background: '#88c702', border: '1px solid #88c702', color: '#fff' }} onClick={() => this.export()}><Icon type="export" />按查询结果导出</Button>
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                    :
                                    null
                                }
                            </div>
                        )
                    }
                </Media>
            </Form>
        );
    }
}
export default Form.create()(SheetTop);
