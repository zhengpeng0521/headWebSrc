import React from 'react';
import styles from './MarketActivityAnalysisComponent.less';
import { Button, Modal, Input, Select, Tabs, Radio, Form, Table, Col, DatePicker} from 'antd';
import createG2 from 'g2-react';
import moment from 'moment';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {DateDiffByDay} from '../../../../utils/dateFormat';
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
import TenantOrgSelect from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';

function MarketActivityAnalysisComponent ({

	dp,
	mode,
	itemId,
	subMode,
	dayValue,
	drawingData,
	analysisPageData,
	analysisDataSource,
	analysisPageTopData,
	showAnalysisModal,
	salesStaffDataSource,
	itemDataSource,
	gatheringPlaceDataSource,
	collectInformationDataSource,
	draw_members,
	qrData,
	drawingDataCount,
	analysisPageSize,
	analysisPageIndex,
	currentActCreateTime,
	dayValueSelect,

	form: {
		resetFields,
	}

}) {


	//更新mdoal
	function analysisActivityHandleCancel() {
		resetFields();
		dp('updateState', {showAnalysisModal : !showAnalysisModal, dayValue : 7, subMode : '1', mode : 'top'});
	}

	function handleModeChange(e) {
		dp('updateState', { mode: e.target.value, gatheringPlaceDataSource : [], salesStaffDataSource : []});
		dp('getFormDataQuery', {activityId : itemId});
	}

	let baseProps = {
		dp,
		itemId,
		subMode,
		dayValue,
		drawingData,
		analysisPageTopData,
		salesStaffDataSource,
		qrData,
		drawingDataCount,
		draw_members,
		itemDataSource,
		currentActCreateTime,
		dayValueSelect,
	}

	let userProps = {
		dp,
		itemId,
		analysisPageData,
		analysisDataSource,
		salesStaffDataSource,
		gatheringPlaceDataSource,
		collectInformationDataSource,
		qrData,
		drawingDataCount,
		draw_members,
		analysisPageSize,
		analysisPageIndex,
	}

	return (
		<div className="marketActivityAnalysis">
			<Modal
				title="数据分析"
				visible={showAnalysisModal}
				onCancel={analysisActivityHandleCancel}
				maskClosable={false}
				footer={
					null
				}
				width="1080px"
				wrapClassName="marketActivityAnalysisModal"
			>
				<Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
					<Radio.Button value="top">基本数据</Radio.Button>
					<Radio.Button value="left">用户数据</Radio.Button>
				</Radio.Group>

				{mode == 'top' ? <BaseComponent {...baseProps} /> : <UserComponent {...userProps} />}

			</Modal>
		</div>
	);
}


function BaseComponent ({

	dp,
	itemId,
	subMode,
	dayValue,
	drawingData,
	analysisPageTopData,
	salesStaffDataSource,
	draw_members,
	itemDataSource,
	drawingDataCount,
	qrData,
	currentActCreateTime,
	dayValueSelect,

	}) {

	/*创建top浏览数据*/
	function createTopDataComponent(title, data=undefined) {
		return (
			<div className={styles.topDataComponent}>
				<div className={styles.topDataComponentTitle}>{title}</div>
				<div className={styles.topDataComponentDataNumber}>{data.allCount}</div>
				<div className={styles.topDataComponentBottomText}>今天：{data.todayCount}</div>
				<div className={styles.topDataComponentBottomText}>昨天：{data.yesterdayCount}</div>
			</div>
		)
	}

	//总扫描
	let leftDate  = {
		allCount : analysisPageTopData&&analysisPageTopData.allViews || 0,
		todayCount : analysisPageTopData&&analysisPageTopData.todayViews || 0,
		yesterdayCount : analysisPageTopData&&analysisPageTopData.yesterdayViews || 0,
	}

	//总有效
	let rightDate = {
		allCount : analysisPageTopData&&analysisPageTopData.allCount || 0,
		todayCount : analysisPageTopData&&analysisPageTopData.todayCount || 0,
		yesterdayCount : analysisPageTopData&&analysisPageTopData.yesterdayCount || 0,
	}

	//点击方法
	function modeChange(e) {

		if(e.target.value == 1) {
			dp('viewDataByDayQuery', {subMode : e.target.value, activityId : itemId, dayValue : dayValue, dayValueSelect : dayValueSelect});
		} else if(e.target.value == 2) {
			dp('countDataByDayQuery', {subMode : e.target.value, activityId : itemId, dayValue : dayValue, dayValueSelect : dayValueSelect});
		} else {
			dp('countDataByDaysOnMemberQuery', {subMode : e.target.value, activityId : itemId, dayValue : dayValue, dayValueSelect : dayValueSelect});
		}
	}

	//选择天数
	function onChange(e) {
		let selectDay = e.target.value;

		var newDay;
		if(selectDay == 30000) {
			//当点击全部时候获取当前这条数据的额创建日期和今天之间的间距
			var createTime = moment(currentActCreateTime).format('YYYY-MM-DD');
			var toDay = moment(moment()).format('YYYY-MM-DD');
			newDay = DateDiffByDay(toDay, createTime);
		}

		let day = selectDay == 10000 ? 7 : selectDay == 20000 ? 30 : newDay+1;

		if(subMode == 1) {
			dp('viewDataByDayQuery', { activityId : itemId, dayValue : day, dayValueSelect : selectDay});
		} else if(subMode == 2) {
			dp('countDataByDayQuery', { activityId : itemId, dayValue : day, dayValueSelect : selectDay});
		} else {
			dp('countDataByDaysOnMemberQuery', { activityId : itemId, dayValue : day, dayValueSelect : selectDay});
		}
	}

	//数据源处理
	let newDrawingData = [];
	let draw_data_list = [];
	let endDate = moment().format('YYYY-MM-DD');

	if(subMode == 1) {
		for(var i = 0; i < dayValue; i++) {
			let date = moment().subtract(i, 'days').format('YYYY-MM-DD');

			let obj = drawingData[date];

			if(obj == undefined) {
				obj = {
					view_date: date,
					value : 0,
				}
			} else {
				obj = obj;
			}
			newDrawingData.push(obj);
		}

	} else if(subMode == 2) {

		for(var i = 0; i < dayValue; i++) {
			let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
			let obj = drawingData[date];

			if(obj == undefined) {
				obj = {
					view_date: date,
					value : 0,
				}
			} else {
				obj = obj;
			}
			newDrawingData.push(obj);
		}

	} else {

		for(var i = 0; i < dayValue; i++) {
			let date = moment().subtract(i, 'days').format('YYYY-MM-DD');
			let obj = drawingData[date];
			if(obj == undefined) {
				obj = {
					view_date: date,
					view_date1: 100,
					//其他釆单人员数据
					...draw_members
				}
			} else {
				let keys = Object.keys(draw_members);
				keys&&keys.map((item, index) => {
					if(obj[item] == undefined) {
						obj[item] = 0;
					}
				})
			}
			newDrawingData.push(obj);
		}
	}

	newDrawingData&&newDrawingData.reverse();

	let draw_lines = [];

	let line_colors = ['#5D9CEC', '#8175C7', '#FBB323', '#A9D86E', '#FF6C60', '#CF5DEC', '#6CCDD3',
		'#FB7423', '#6E7AD8', '#37B52D', '#5D9CEC', '#8175C7', '#FBB323', '#A9D86E',
		'#FF6C60', '#CF5DEC', '#6CCDD3', '#FB7423', '#6E7AD8', '#37B52D', '#5D9CEC',
		'#8175C7', '#FBB323', '#A9D86E', '#FF6C60', '#CF5DEC', '#6CCDD3', '#FB7423',
		'#6E7AD8', '#37B52D'];

	let personKeys = Object.keys(draw_members);

	let contNumbers = [];

	newDrawingData&&newDrawingData.map((item, index) => {
		personKeys&&personKeys.map((nameItem, nameIndex) => {
			if(newDrawingData[index][nameItem] != 0) {
				contNumbers.push({[nameItem] : newDrawingData[index][nameItem]});
			} else {
				contNumbers.push({[nameItem] : 0});
			}
		})
	})

	
	let personValueCountArr = [];
	personKeys&&personKeys.map((nameItem, nameIndex) => {
		let num = 0;
		let obj = {};
		contNumbers&&contNumbers.map((item, index) => {
			if(Object.keys(item)[0] == nameItem) {
				num += item[nameItem];
				obj = {
					name : nameItem,
					value : num,
				}
			}
		})
		personValueCountArr.push(obj);
	})

	let nameYAxis = undefined;

	let tempNameYAxis = 0;

	personValueCountArr&&personValueCountArr.map((item, index) => {
		nameYAxis = Math.max(tempNameYAxis, item.value),
			tempNameYAxis = nameYAxis;
	})

	personValueCountArr&&personValueCountArr.map((item, index) => {
		nameYAxis = item.value == nameYAxis ? item.name : nameYAxis;
	})

	let draw_members_keys = Object.keys(draw_members);
	draw_members_keys && draw_members_keys.map(function(keyItem, keyIndex) {
		draw_lines.push(
			<Line key={'draw_line_' + keyIndex} type="monotone" dataKey={keyItem} strokeWidth={2} stroke={line_colors[keyIndex]} yAxisId={0} />
		);
	});

	return (
		<div className="analysisTopComponent">
			<div className={styles.topLeftlabel}>数据总览</div>
			<div className={styles.topDataComponentBox}>
				{createTopDataComponent('总扫描次数', leftDate)}
				{createTopDataComponent('总有效用户', rightDate)}
			</div>
			<div className={styles.line}></div>

			<div className={styles.topLeftlabel}>数据趋势</div>
			<div className={styles.buttomRadioLocation}>
				<Radio.Group onChange={modeChange} value={subMode} style={{ marginBottom: 8 }}>
					<Radio.Button value="1">扫描次数</Radio.Button>
					<Radio.Button value="2">有效用户</Radio.Button>
					<Radio.Button value="3">采单人员</Radio.Button>
				</Radio.Group>
				<div className={styles.radioDay}>
					<RadioGroup onChange={onChange} value={dayValueSelect}>
						<Radio value={10000}>7天</Radio>
						<Radio value={20000}>30天</Radio>
						<Radio value={30000}>全部</Radio>
					</RadioGroup>
				</div>
				{
					subMode != '3' ?
						<div className={styles.dataTitleCountBox}>
							<div className={styles.dataTitleCount}>{drawingDataCount || 0}</div>
							<span>{subMode == '1' ? '次' : '人'}</span>
						</div>
						:
						<div className={styles.submode3dataTitleCountBox}>
							{
								personValueCountArr&&personValueCountArr.length > 0
									? personValueCountArr.map((item, index) => {
									return <div className={styles.submodeBox} key={index}>
										<div className={styles.personNumber} style={{color : line_colors[index]}}>{item.value || 0}</div>
										<div className={styles.personNumberText}>人</div>
										<div className={styles.personName}>{item.name || ''}</div>
									</div>
								})
									: <div className={styles.submodeBox}>
									<div className={styles.personNumber}>0</div>
									<div className={styles.personNumberText}>人</div>
								</div>
							}
						</div>
				}
			</div>

			{
				subMode != '3' ?
					<ResponsiveContainer width="100%" height={420} >
						<LineChart
							width={750}
							height={450}
							data={newDrawingData}
							margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
						>
							<XAxis dataKey="view_date" />
							<YAxis dataKey="value" />
							<Tooltip />
							<CartesianGrid stroke='#EEE' vertical={false} />
							<Line key="view_date" type="monotone" dataKey="value" stroke='rgb(129, 117, 199)' strokeWidth={2} yAxisId={0} />
						</LineChart>
					</ResponsiveContainer>
					:
					<ResponsiveContainer width="100%" height={420} >
						<LineChart
							width={750}
							height={450}
							data={newDrawingData}
							margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
						>
							<XAxis dataKey="view_date" />
							{nameYAxis != undefined ? <YAxis dataKey={nameYAxis} /> : <YAxis dataKey="view_date1" />}
							<Tooltip />
							<CartesianGrid stroke='#EEE' vertical={false}/>
							{draw_lines}
						</LineChart>
					</ResponsiveContainer>
			}
		</div>
	)
}

function UserComponent1 ({

	dp,
	itemId,
	analysisPageData,
	analysisDataSource,
	salesStaffDataSource,
	gatheringPlaceDataSource,
	collectInformationDataSource,
	analysisPageSize,
	analysisPageIndex,
	form: {
		getFieldDecorator,
		getFieldValue,
		getFieldsValue,
		setFieldsValue,
		getFieldProps,
		validateFields,
		resetFields,
		setFields,
		getFieldError,
		validateFieldsAndScroll,
		}

	}) {
	//采单人员数据
	const children = [];
	//采单地点数据
	const didianChildren = [];
	//采集人员
	if(salesStaffDataSource&&salesStaffDataSource.length>0) {
		salesStaffDataSource.map((item, index) => {
			children.push(<Option key={item.userId}>{item.userName}</Option>);
		})
	}
	//采集地点
	if(gatheringPlaceDataSource&&gatheringPlaceDataSource.length>0) {
		gatheringPlaceDataSource.map((item, index) => {
			didianChildren.push(<Option key={item.key}>{item.value}</Option>);
		})
	}
	//采集信息
	let newFomrData = [];
	let data = [];
	let fromValue = [];

	if(analysisDataSource != undefined) {
		analysisDataSource&&analysisDataSource.map((item, index) => {
			let form = JSON.parse(item.formData);
			let dataItem = {};
			let valueForm = {};
			let fromValueArr = [];
			form&&form.map((formItem, formindex) => {
				valueForm[formItem.name] = formItem.value || undefined;
				valueForm.key = `key${index}`;
			})

			valueForm.place =  item.placeStr || undefined;
			valueForm.memberName =  item.memberName || undefined;
			valueForm.createTime =  item.createTime || undefined;
			fromValue.push(valueForm);
		})

		newFomrData.push({title : '采集地点', key : 'place', dataIndex : 'place'});
		newFomrData.push({title : '采集人员', key : 'memberName', dataIndex : 'memberName'})
		newFomrData.push({title : '报名时间', key : 'createTime', dataIndex : 'createTime'})
	}


	newFomrData = [{
		title : '学员姓名',
		key : 'babyName',
		width : '120px',
		dataIndex : 'babyName'
	},{
		title : '学员生日',
		key : 'babyBirthday',
		width : '160px',
		dataIndex : 'babyBirthday'
	},{
		title : '联系方式',
		key : 'tel',
		width : '160px',
		dataIndex : 'tel'
	},{
		title : '学员性别',
		key : 'babySex',
		width : '120px',
		dataIndex : 'babySex'
	},{
		title : '家长关系',
		width : '120px',
		key : 'parentRelate',
		dataIndex : 'parentRelate'
	},{
		title : '家长姓名',
		width : '120px',
		key : 'parentName',
		dataIndex : 'parentName'
	},{
		title : '小区',
		width : '80px',
		key : 'neighbourhood',
		dataIndex : 'neighbourhood'
	},{
		title : '学校',
		width : '80px',
		key : 'school',
		dataIndex : 'school'
	},{
		title : '地址',
		width : '80px',
		key : 'address',
		dataIndex : 'address'
	},{
		title : '是否会员',
		width : '120px',
		key : 'isVip',
		dataIndex : 'isVip'
	}, {
		title : '采集地点',
		width : '120px',
		key : 'place',
		dataIndex : 'place'
	},{
		title : '采集人员',
		width : '120px',
		key : 'memberName',
		dataIndex : 'memberName'
	},{
		title : '报名时间',
		width : '140px',
		key : 'createTime',
		dataIndex : 'createTime'
	},]

	//导出按钮
	function touchExport() {

		let data = getFieldsValue();
		let param = {};
		if(data.activitySecondSource != undefined) {
			param.place = data.activitySecondSource || undefined;;
		}

		if (data.activitySignTime != undefined) {
			param.firstCreateTime = data.activitySignTime[0].format('YYYY-MM-DD 00:00:00') || undefined;
			param.endCreateTime = data.activitySignTime[1].format('YYYY-MM-DD 23:59:59') || undefined;
		}

		if(data.activitySalesStaff != undefined) {
			param.sourceType = '1';
			param.sourceId = data.activitySalesStaff || undefined;
		}

		param.activityId = itemId;

		dp('exportUserFormData', {param});
	}

	//搜索数据
	function search() {

		let data = getFieldsValue();

		let param = {};
		
		if (data.activitySignTime != undefined) {
			param.firstCreateTime = data.activitySignTime[0].format('YYYY-MM-DD 00:00:00') || undefined;
			param.endCreateTime = data.activitySignTime[1].format('YYYY-MM-DD 23:59:59') || undefined;
		}
		
		if(data.activitySecondSource != undefined) {
			param.place = data.activitySecondSource || undefined;;
		}

		if(data.activitySalesStaff != undefined) {
			param.sourceType = '1';
			param.sourceId = data.activitySalesStaff || undefined;
		}

		if (data.activityOrgId != undefined) {
			param.orgId = data.activityOrgId || undefined;
		}

		param.activityId = itemId;

		dp('getFormDataQuery', {param : param});
	}

	function clear() {
		resetFields();
		dp('getFormDataQuery', {activityId : itemId});
	}

	//分页变化
	function handleTableChange(page, pageSize) {

		let data = getFieldsValue();
		let param = {};
		if(data.activitySecondSource != undefined) {
			param.place = data.activitySecondSource || undefined;;
		}

		if(data.activitySalesStaff != undefined) {
			param.sourceType = '1';
			param.sourceId = data.activitySalesStaff || undefined;
		}
		
		if (data.activitySignTime != undefined) {
			param.firstCreateTime = data.activitySignTime[0].format('YYYY-MM-DD 00:00:00') || undefined;
			param.endCreateTime = data.activitySignTime[1].format('YYYY-MM-DD 23:59:59') || undefined;
		}

		param.activityId = itemId;

		dp('getMoreFormDataQuery', {param : param, analysisPageIndex : page.current - 1});
	}

	let tempPageIndex = analysisPageIndex || 0;
	
	//校区选择（获取对应校区的釆单人员和地址）
	function functionTenantSelectOnSelect(orgId) {
		// functionGetInterface(orgId);
		dp('summaryQuery', { orgId: orgId });
		dp('getCollectAddress', { orgId: orgId });
	}

	let tenantOrgSelectProps = {
		width		: 193,
		onChange    : functionTenantSelectOnSelect,           
	};

	return (
		<div className={styles.tableBox}>
			<Form>

				<Col span={5}>
					<FormItem >
						{getFieldDecorator('activityOrgId', {
							rules: [{ required: true, message: '请选择校区' }],
						})(
							<TenantOrgSelect { ...tenantOrgSelectProps } />
						)}
					</FormItem>
				</Col>

				<Col span={5}>
					<FormItem >
						{getFieldDecorator('activitySecondSource', {
							rules: [{ required: true, message: '请选择采单地点' }],
						})(
							<Select placeholder="请选择采单地点" notFoundContent="请在设置-系统设置-业务参数-二级来源中添加采集地点">
								{didianChildren}
							</Select>
						)}
					</FormItem>
				</Col>

				<Col span={5}>
					<FormItem style={{marginLeft : '20px'}}>
						{getFieldDecorator('activitySalesStaff', {
							rules: [{ required: true, message: '请选择采单人员' }],
						})(
							<Select placeholder="请选择采单人员" notFoundContent="请在设置-系统设置-员工管理-添加员工">
								{children}
							</Select>
						)}
					</FormItem>
				</Col>

				<Col span={4}>
					<FormItem style={{ marginLeft: '20px' }}>
						{getFieldDecorator('activitySignTime', {
							rules: [{ required: true, message: '请选择时间' }],
						})(
							<RangePicker
								showTime={{ format: 'HH:mm' }}
								format="YYYY-MM-DD"
								placeholder={['报名开始时间', '报名结束时间']}
							/>
						)}
					</FormItem>
				</Col>
			</Form>

			<div className={styles.exportBtn}>
				<div className={styles.searchBox}>
					<Button type="primary" style={{ marginRight: '10px', marginLeft: '10px'}} onClick={() => search()}>搜索</Button>
					<Button onClick={() => clear()} style={{ marginRight: '10px' }}>清除条件</Button>
					<Button type="primary" disabled={!analysisDataSource.length} onClick={() => touchExport()}>导出</Button>
				</div>
			</div>
			<div onClick={clear}></div>
			<Table  columns={newFomrData}
					dataSource={fromValue}
					onChange={handleTableChange}
					pagination={{
						total : analysisPageData&&analysisPageData.resultCount,
						pageSize : analysisPageSize || 10,
						pageIndex : analysisPageIndex || 0,
						current : ++tempPageIndex,
					}}
			/>

		</div>
	)

}

var UserComponent = Form.create()(UserComponent1);

export default Form.create()(MarketActivityAnalysisComponent);
