import React from 'react';
import styles from './MarketActivityComponent.less';
import {Button, Form, Popconfirm, Modal, Input, DatePicker, Select,
		Checkbox, InputNumber, Popover, Upload, message, Icon, Radio} from 'antd';
import TableComponent from '../../../common/manager-list/ManagerListMgr';
import QRCodeComponent from '../../../common/qr-code/QRCodeComponent';
import AnalysisComponent from './MarketActivityAnalysisComponent';
import TenantOrgSelect from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
// import TenantOrgSelectComponent from '../../../../pages/common/tenant-org-select/TenantOrgSelect';

import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

function MicroModuleFormComponent ({
 
	dp,						//更新属性方法
	orgId,
	mode,					//
	domain,
	itemId,
	subMode,
	showSearch,				//点击筛选
	showAddActivityModal,	//显示添加活动modal
	showCreateQRModal,		//显示二维码modal
	dataSource,				//数据源
	paginationSource,		//分页数据
	pageIndex,
	pageSize,
	editStatus,				//编辑状态
	itemDataSource,			//单条信息数据
	selectedRowKeys,		//选中的行
	showAnalysisModal,		//显示数据分析modal
	dayValue,				//选中的天数
	analysisPageData,		//分析页面分页数据
	analysisDataSource,		//分析页面数据源
	drawingData,			//绘图数据
	salesStaffDataSource,//采单人员信息
	gatheringPlaceDataSource,//收集地点数据
	collectInformationDataSource,//收集信息数据
	analysisPageTopData,
	qrData,	//获取二维码数据
	draw_members,
	saveButtonDsiabled,
	drawingDataCount,
	analysisPageSize,
	analysisPageIndex,
	disabledCreateQrBtn,
	currentActCreateTime,
	dayValueSelect,
	showSelectModal,
	orgIdsArr,
	fromOfflineLeafletsControl,//因为是共用了同一个界面,不想从新写就用了此属性来判断是不是来自线下传单，如果是线下传单那么就隐藏掉搜索框和表单
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
	//默认采单人员
	const defaultChildren = [];
	//采单地点数据
	const didianChildren = [];
	//收集信息数据
	const options = [];
	//默认收集信息数据
	let defaultOptions = [];
	//校区列表
	const campusChildren = [];

	//校区选择
	if (window._init_data && window._init_data.orgIdList && window._init_data.orgIdList.length > 0) {
		window._init_data.orgIdList.map((item, index) => {
			campusChildren.push(<Option key={item.orgId} value={item.orgId}>{item.orgName}</Option>);
		})
	}

	//_('orgIdList', window._init_data.orgIdList);
	//_('campusChildren', campusChildren);

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
	if(collectInformationDataSource&&collectInformationDataSource.length>0) {
	   	collectInformationDataSource.map((item, index) => {
		   	item.key = item.key;
			item.value = item.name;
			item.disabled = item.name == 'babyName' || item.name == 'tel' || item.name == 'babyBirthday' ? true : false,			
		   	options.push(item);
		    if(item.hide == 0 || item.hide == '0') {
				defaultOptions.push(item.value);
			} 
		})
	}

	//处理单条信息
	if(itemDataSource != undefined && Object.keys(itemDataSource).length > 0)  {
		defaultOptions = [];
		let tempArr = JSON.parse(itemDataSource.baseForm);
		tempArr.map((item, index) => {
		   	item.key = item.key;
			item.value = item.name;
			item.disabled = item.name == 'babyName' || item.name == 'tel' || item.name == 'babyBirthday' ? true : false;
		    if(item.hide == 0 || item.hide == '0') {
				defaultOptions.push(item.value);
			}
		})
	}

	//处理回填釆单人员
	if(Object.keys(itemDataSource).length > 0) {
		if(salesStaffDataSource&&salesStaffDataSource.length>0) {
		   salesStaffDataSource.map((item, index) => {
			   itemDataSource.members&&itemDataSource.members.map((ii, idx) => {
				   	if(item.userId == ii.source_id) {
						defaultChildren.push(String(item.userId));
					}
			   })
		   })
		}
	}
		
	//数据源处理
	dataSource&&dataSource.length>0&&dataSource.map((item, index) => {
		dataSource[index].key = String(index);
	})
	
	//获取表单所有数据
	let getData = getFieldsValue();

	//更新添加活动modal方法
	function toucAddActivity() {
		resetFields();
		dp('updateState', { showAddActivityModal: !showAddActivityModal, editStatus: false, orgIdsArr : '' } );
		// dp('summaryQuery', {} );
	}
	
	//点击活动取消按钮
	function addActivityHandleCancel() {
		resetFields();
		dp('updateState', { 
			showAddActivityModal: !showAddActivityModal,
			itemDataSource: {}, 
			editStatus: !editStatus, 
			orgIdsArr : '' 
		} );
	}
			
	//创建model完全关闭后状态
	function closeAddModal() {
		resetFields();
		dp('updateState', { 
			saveButtonDsiabled: false, 
			disabledCreateQrBtn: false, 
			itemDataSource: {},
			orgIdsArr : '',
			salesStaffDataSource: [],
			gatheringPlaceDataSource: [],
		});
	}
	
	//点击生成二维码或者编辑活动
	function touchCreateQRModal() {

		if (orgIdsArr && orgIdsArr.length) {
			
		} else {
			return message.error('请选择校区');
		}

		if(editStatus) {
			dp('updateState', {saveButtonDsiabled : !saveButtonDsiabled} );
		} 
		
		var obj = getFieldsValue();		
		let date = obj.activityTime || undefined;
		let startDate = undefined;
		let endDate = undefined;

		if(date != undefined && date != 'undefined' && date.length > 0) {
			startDate = date&&date[0].format('YYYY-MM-DD');
			endDate = date&&date[1].format('YYYY-MM-DD');
		}
		
		let tempArr = [];
		let activitySalesStaffArray = [];

		function editFunction (arr) {	
			arr&&arr.map((item, index) => {
				let mark = false;
				obj.activityCollect&&obj.activityCollect.map((ii, idx) => {					
					if(item.name == ii) {
						item.hide = 0;
						mark = true;
						return item;
					}
				})

				if(mark == false) {
					item.hide = 1;
				}

				if(item.name == 'babyName' || item.name == 'tel' || item.name == 'babyBirthday') {
					item.hide = 0;
				}

				tempArr.push(item);
			})
		}
		
		if(editStatus) {

			let arr = JSON.parse(itemDataSource.baseForm);

			//获取原始数据key
			let newKey = [], oldKey = [];
			collectInformationDataSource && collectInformationDataSource.map((item, index) => {
				newKey.push(item.name);
			})

			//获取老数据的key
			arr && arr.map((item, index) => {
				oldKey.push(item.name);
			})

			Array.prototype.diff = function (a) {
				return this.filter(function (i) { return a.indexOf(i) < 0; });
			};
			
			//数组比对取差值
			let keys = newKey.diff(oldKey); 

			//存储差值元素
			let newElements = [];

			if (keys.length) {
				keys.map((item, index) => {
					collectInformationDataSource.map((i, idx) => {
						if (item === i.name) {
							newElements.push(i);
						}
					})					
				}) 
			}

			//合并数组
			arr = arr.concat(newElements);

			editFunction(arr);

		} else {
			editFunction(collectInformationDataSource);
		}

		obj.activitySalesStaff&&obj.activitySalesStaff.map((item, index) => {
			let dict  = {};
			dict.sourceId = item;
			dict.sourceType = "1";
			activitySalesStaffArray.push(dict);
		});
		
		let pageLogoStr = '';
		if(obj.pageLogo && obj.pageLogo.length > 0) {
			if(obj.pageLogo[0] && obj.pageLogo[0].status == 'done' && obj.pageLogo[0].response && obj.pageLogo[0].response.errorCode == 9000) {
				pageLogoStr = obj.pageLogo[0].response.data.url;
			}
		}

		let param = {
			orgIds		: orgIdsArr,
			startDate 	: startDate || '',
			endDate 	: endDate || '',
			name 		: obj.activityName,
			place 		: obj.activitySecondSource,
			price 		: obj.activityCost, 
			remark 		: obj.activityNote,
			baseForm 	: JSON.stringify(tempArr),
			members 	: JSON.stringify(activitySalesStaffArray),
			pageTitle   : obj.pageTitle,
			topicCode   : obj.topicCode,
			pageLogo    : pageLogoStr,
		}
		
		if((obj.activityName&&obj.activityName.length > 0) && (activitySalesStaffArray.length > 0)) {
		   	dp('updateState', {disabledCreateQrBtn : !disabledCreateQrBtn} );
		}
			
		if(editStatus) {
			param.id = itemDataSource.id || undefined;
		   	dp('createOrUpdate', {showAddActivityModal : !showAddActivityModal, param : param, editStatus : !editStatus, orgId : itemDataSource.orgId});
		} else {
			dp('createOrUpdate', {showAddActivityModal : !showAddActivityModal, showCreateQRModal : !showCreateQRModal, param : param});
		}
	}
	
	//清除数据
	function resetForm() {
		resetFields();
		dp('updateState', {
			itemDataSource: {}, 
		});
	}

	//点击取消二维码
	function calcelQrModal() {
		resetFields();
		dp('updateState', {showCreateQRModal : !showCreateQRModal} );
	}
	
	//搜索清除事件
	function searchClear() {
		dp('updateState', {
			salesStaffDataSource: [],
			gatheringPlaceDataSource : [],
		});
		dp('getMarketList', {});	
	}
	
	//搜索
	function onSearch(value) {
		
		let startDate = undefined;
		let endDate = undefined;
		let param = {};


		if(value.avtivityDate != undefined) {
			startDate = value.avtivityDate[0].format("YYYY-MM-DD");
			endDate = value.avtivityDate[1].format("YYYY-MM-DD");
			param.startDate = startDate;
			param.endDate = endDate;
		} 

		if(value.sourceId) {
			param.sourceType = '1',
			param.sourceId = value.sourceId;
		}
		
		if(value.name&&value.name.length > 0) {
			param.name = value.name || undefined;
		}
		
		if(value.place&&value.place.length > 0) {
			param.place = value.place || undefined;
		}

		if (value.orgId != undefined) {
			param.orgId = value.orgId || undefined;
		}
		
		dp('getMarketList', {param : param})
	}

	//点击筛选
	function onFilterClick() {
		// dp('summaryQuery', { showSearch: !showSearch} );
		dp('updateState', { showSearch: !showSearch });
	}
	
	//删除活动
	function delectActivity(record) {
		dp('delectItem', {activityId : record.id});		
	}
	
	//选中的行变化
	function selectRowChange(row) {
		dp('updateState', {selectedRowKeys : row});
	}
	
	//分页改变
	function pageChange(page, pageSize) {
		dp('getPageIndexData', {pageIndex : page-1});
	}
	
	//改变分页触发
	function showSizeChange(page, pageSize) {
		dp('getPageIndexData', {pageIndex : page-1, pageSize : pageSize});
	}
	
	//查看详情
	function reviewDetail(record) {
		//dp('getQrCodeData', {showCreateQRModal : false, activityId : record.id || undefined});
		dp('getAnalysisData', { showAnalysisModal: !showAnalysisModal, orgId: record.orgId, tenantId: record.tenantId, actId : record.id, createTime :  record.createTime});
		dp('summaryQuery', {} );
	}
	
	//点击采集人员
	function touchMemberCount(record) {		
		dp('getQrCodeData', { showCreateQRModal: !showCreateQRModal, activityId: record.id} );
	}
	
	//编辑单条数据
	function editItemData(record){
				
		dp('selectItemData', {showAddActivityModal : !showAddActivityModal, record : record, editStatus : true} );
		dp('summaryQuery', { orgId: record.orgIds });
		dp('getCollectAddress', { orgId: record.orgIds });
	}
	
	//更新机构id
	// function TenantSelectOnSelect(id) {
	// 	dp('updateState', {orgId : id} );
	// 	dp('summaryQuery', {} );
	// 	dp('getMarketList', {});
	// }
	
	//删除操作
	function delectSelcetItem() {
		let idArr = [];		
		selectedRowKeys.map((item, index) => {
			idArr.push(dataSource[item].id);
		})

		dp('batchDelect', {ids : idArr.join(',')});		
	}

	// //校区下拉列表属性
    // let tenantOrgSelectProps = {
    //     width        : 420,
    //     onChange     : TenantSelectOnSelect,            //改变机构触发事件
	// };
	
	// let tenantOrgSelectProps1 = {
	// 	width        : 420,
	// }
	
	let tempPerson = [];
	let tempPlace = [];
	
	salesStaffDataSource&&salesStaffDataSource.map((item, index) => {
		let dict = {};
		dict.key = item.userId;
		dict.label = item.userName;
		tempPerson.push(dict);
	})
	
	gatheringPlaceDataSource&&gatheringPlaceDataSource.map((item, index) => {
		let dict = {};
		dict.key = item.key;
		dict.label = item.value;
		tempPlace.push(dict);
	})

	//搜索校区选择回调
	function onSearchOrgId(vue) {
		selectOrgId(vue);
	}

	//列表属性
	let tableProps = {
		search : {
			searchAble : true,
			showSearch : showSearch,
			onFilterClick : onFilterClick,
			onSearch : onSearch,
			onClear : searchClear,
			onSearchOrgId: onSearchOrgId,
			wetherClear: false,
			fields : [
				{
					key: 'orgId',
					type: 'orgSelect',
					placeholder: '所属校区',
					options: {
						width: 300,
					},
				},
				{
					key : 'avtivityDate',
					type : 'rangePicker',
				},
				{
					key : 'name',
					type : 'text',
					placeholder : '活动名称',
				},
				{
					key : 'place',
					type : 'select',
					placeholder : '采集地点',
					options : tempPlace || [],
				},
				{
					key : 'sourceId',
					type : 'select',
					placeholder : '采集员',
					options : tempPerson || [],
				}
			]
		},
		
		table : {
			dataSource : dataSource,
            columns : [
                {
					dataIndex : 'name',
					key       : 'name',
					width 	  : '160px',
					title     : '活动名称',
					render    : ( text, record ) => (
						<a onClick={() => editItemData(record)}>{ record.name }</a>
					)
				},{
					dataIndex : 'placeStr',
					key       : 'placeStr',
					width 	  : '180px',
					title     : '采集地点(二级来源)',
					render    : ( text, record ) => (
						<span>{ record.placeStr }</span>
					)
				},{
					dataIndex : 'memberCount',
					key       : 'memberCount',
					width 	  : '160px',
					title     : '采单员二维码',
					render    : ( text, record ) => (
						<a onClick={() => touchMemberCount(record)}>{record.memberCount}</a>
					)
				},{
					dataIndex : 'count',
					key       : 'count',
					width 	  : '120px',
					title     : '数据分析',
					render    : ( text, record ) => (
						<div>
							<div>有效用户:{ record.count > 0 ? record.count : 0 }</div>
							<a onClick={() => reviewDetail(record)}>查看详情</a>
						</div>
					)
				},{
					dataIndex : 'price',
					key       : 'price',
					width 	  : '120px',
					title     : '活动成本（元）',
					render    : ( text, record ) => (
						<span>{ record.price }</span>
					)
				},{
					dataIndex : 'remark',
					key       : 'remark',
					title     : '备注',
					width 	  : '150px',
					render    : ( text, record ) => (
						<Popover content={text} >
							<span>{ record.remark&&record.remark.length > 10 ? (record.remark).substring(0, 10) + '...' : record.remark }</span>
    					</Popover>
					)
				},{
					dataIndex : 'startDate',
					key       : 'startDate',
					title     : '活动时间',
					width 	  : '120px',
					render : ( text, record ) => (
						<span>{record.startDate || ''} ~ {record.endDate || ''}</span>
					)
				},{
					dataIndex : 'createTime',
					key       : 'createTime',
					title     : '创建时间',
					width 	  : '160px',
					render    : ( text, record ) => (
						<span>{ record.createTime }</span>
					)
				},{
					dataIndex : 'tryNum',
					key       : 'tryNum',
					title     : '操作',
					width 	  : '120px',
					render    : ( text, record ) => (
						<div>
							<a onClick={() => editItemData(record)} disabled={(record.isHq === 0 || record.isHq === false)}>编辑&nbsp;</a>
							<Popconfirm title="确定删除?" okText="是" cancelText="否" onConfirm={() => delectActivity(record)}>
								<a href="#" disabled={(record.isHq === 0 || record.isHq === false)}>删除</a>
							</Popconfirm>
						</div>
					)
				},
            ],
            emptyText : '暂时没有数据',
			rowSelection : {
				type : 'checkbox',
				onChange : selectRowChange,
				selectedRowKeys : selectedRowKeys,
				getCheckboxProps: record => ({
					disabled: (record.isHq === 0 || record.isHq === false),
				}),
			},
			pagination : {
				total : paginationSource&&paginationSource.resultCount,
				pageIndex : pageIndex || 0,
				pageSize : pageSize || 10,
				showSizeChanger : true,
				showQuickJumper : true,
				onChange : pageChange,
				onShowSizeChange : showSizeChange,
			},
		},
		/*
		leftBars : {
			label : '操作',
       		btns:    [
				{
					type : 'text',
					label :  '删除',
					confirm : true,
					disabled : selectedRowKeys.length !== 1,
					handle : delectSelcetItem,
				}
			],   
		},
		*/
		rightBars: {
			btns : [
				{
					type : 'btn',
					label :  '新增市场活动',
					icon :  '',
					disabled :  false,
					handle :  toucAddActivity,
					confirm	 : false,
				}
			]
		},
	}
			
	let formItemLayout = {
		labelCol : { span : 4 },
		wrapperCol : { span : 18 }
	};

	//校检
	let noteProps = getFieldProps('activityNote',{
		initialValue : itemDataSource.remark || undefined,
		validate : [{
			rules : [
				{ required : false , message : '不能超过100字', min : 0, max : 100 },
			],
			trigger : [ 'onBlur' , 'onChange' ]
		}]
	});
	
	let activityProps = getFieldProps('activityName', {
		initialValue : itemDataSource.name || undefined,
		validate : [{
			rules : [
				{ required : true , message : '不能超过30字', min : 0, max : 30 },
			],
			trigger : [ 'onBlur' , 'onChange' ]
		}]
	});

	//二维码链接	
	let qrCodeArr = [];

	qrData && qrData.map((content, contentIdx) => {
		let arr = [];
		content.map((item, index) => {
			let qrLink = `${domain}html/market/activity?tenantId=${item.tenant_id}&orgId=${item.org_id}&activityId=${item.activity_id}&memberId=${item.id}`;
			arr.push({ name: item.member_name, link: qrLink, orgName:item.orgName })
		})
		qrCodeArr.push(arr)
	})

	// qrData&&qrData.map((item, index) => {
	// 	let qrLink = `${domain}html/market/activity?tenantId=${item.tenant_id}&orgId=${item.org_id}&activityId=${item.activity_id}&memberId=${item.id}`;
	// 	qrCodeArr.push({name : item.member_name, link : qrLink});
	// })

	let qrProps = {
		linkArr : qrCodeArr,
		showModal : showCreateQRModal,
		calcelQrModal : calcelQrModal,
		orgId : orgId || undefined,
		activityId : qrData&&qrData.length > 0 ? qrData[0][0].activity_id : undefined,
	};

	let analysisProps = {
		dp,
		mode,
		subMode,
		dayValue,
		analysisPageData,
		analysisDataSource,
		showAnalysisModal,
		drawingData,
		itemDataSource,
		itemId,
		qrData,
		salesStaffDataSource,
		gatheringPlaceDataSource,
		collectInformationDataSource,
		analysisPageTopData,
		draw_members,
		drawingDataCount,
		analysisPageSize,
		analysisPageIndex,
		currentActCreateTime,
		dayValueSelect,
	}

	let judgeTime = false;

	let currentTime = moment().format('YYYY-MM-DD');

	let betweenTime = moment(currentTime).isBetween(itemDataSource.startDate, itemDataSource.endDate);
	
	let sameTime = moment(currentTime).isSame(itemDataSource.startDate);

	judgeTime = sameTime ? sameTime : betweenTime;


	function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
	
	let pageLogoUploadProps = {
        name: 'file',
        action: `/thinknode/upload/image`,
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                info.file.url = info.file.response.data.url;
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            let imgurl_list = getFieldValue('imgUrl');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张logo图');
                return false;
            }
            let isLt1M = file.size / 1024 / 1024 < 1;
            if (!isLt1M) {
                message.error('图片大小不大于1M!');
                return false;
            }
            return true;
        },
    };
    
    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div>选择LOGO</div>
    	</div>
    );
	function onSelectOrgModalClose() {
		onOpenSelectOrgModal();
	}

	//选中校区
	// function afterSelectOrgModalSubmit(value) {
	// 	dp('updateState', { orgIdsArr: value });
	// }
	// let tenantOrgSelectProps2 = {
	// 	visible: showSelectModal,
	// 	onClose: onSelectOrgModalClose,
	// 	afterSubmit: afterSelectOrgModalSubmit,
	// 	init_org_select: orgIdsArr || [],
	// 	disabled: editStatus,
	// 	no_select_campus: editStatus,
	// };

	function onOpenSelectOrgModal() {
		dp('updateState', { showSelectModal: !showSelectModal});
	}

	function selectOrgId(e) {
		setFieldsValue({ activitySalesStaff : []})
		setFieldsValue({ activitySecondSource : [] })

		dp('summaryQuery', { orgId: e});
		dp('getCollectAddress', { orgId: e });
	}

	return (
		<div className="marketActivity">
 			{/*
				fromOfflineLeafletsControl
					? 	''
					: 	<div className={styles.orgSelect}>
							<Form>
								<FormItem {...formItemLayout} >
									{ getFieldDecorator('orgId',{
										initialValue : orgId || '',
										rules : [
											{ required : true, message : '请选择校区' }
										]
									})(
										<TenantOrgSelect { ...tenantOrgSelectProps } />
									)}
								</FormItem>
							</Form>
						</div>
			*/}
			{
				fromOfflineLeafletsControl
					? 	''
					:	<TableComponent {...tableProps} />
			}
			<Modal
			  title={editStatus ? "修改市场活动" : "新增市场活动"}
			  visible={showAddActivityModal}
			  onCancel={addActivityHandleCancel}
			  afterClose={resetForm}
			  maskClosable={false}
			  footer={null}
			  width="700px"
			  wrapClassName="marketModal"
			  afterClose={closeAddModal}
			>
		  		<Form>
					<FormItem
						{ ...formItemLayout }
						label="活动校区"
					>
						{getFieldDecorator('orgIds', {
							initialValue: orgIdsArr || undefined,
							rules: [{ required: true, message: '请选择校区' }],
						})(
                            <Select
                                placeholder = "请选择校区"
                                notFoundContent = "请选择校区"
                                disabled = { editStatus }
                                onChange = { selectOrgId }>
                                { campusChildren || [] }
                            </Select>
						)}
					{/*
                        <Select disabled={editStatus} mode="combobox" placeholder="请选择校区" notFoundContent="请选择校区" onChange={selectOrgId}>
								{campusChildren}
				        </Select>
						<span style={{ 'color': '#5D9CEC', 'marginRight': '10px' }}>{orgIdsArr && orgIdsArr.length}个校区</span>
						{getFieldDecorator('orgIds', {
							// initialValue: courseInfo.orgIds || '',
							rules: [
								{ required: true, message: '请选择校区' }
							]
						})(
							<Button type="primary" size="small" onClick={onOpenSelectOrgModal} >{editStatus ? '查看校区' : '选择校区'}</Button>
						)}
					*/}
					</FormItem>

		  			<FormItem {...formItemLayout} label="活动名称">
						<Input size = 'default' placeholder="请输入活动名称，限30字" {...activityProps} />
					</FormItem>
					
					<FormItem {...formItemLayout} label="活动时间" help="若不填写则默认活动时间不限">
					  	{getFieldDecorator('activityTime', {
							initialValue : (editStatus&&itemDataSource.startDate != undefined && itemDataSource.startDate != '') ? [moment(itemDataSource.startDate || undefined, 'YYYY-MM-DD'), moment(itemDataSource.endDate || undefined, 'YYYY-MM-DD')] : undefined,
							rules: [{
					  			required: false,
							}],
						})(
							<RangePicker  />
					  	)}
					</FormItem>
					
					<FormItem {...formItemLayout} label="采单人员">
						{getFieldDecorator('activitySalesStaff', {
							initialValue : defaultChildren || undefined,
							rules: [{ required: true, message: '请选择采单人员' }],
						})(
							<Select placeholder="请选择采单人员" multiple={true} tokenSeparators={[',']}
							 	notFoundContent="请在设置-系统设置-员工管理-添加员工">
								{children}
							</Select>
						)}
					</FormItem>
					
					<FormItem {...formItemLayout} label="采集地点">
				  		{getFieldDecorator('activitySecondSource', {
							initialValue : itemDataSource.place || undefined,
							rules: [{ 
								required: false, 
								message: '' 
							}],
						})(
							<Select placeholder="请选择采集地点" 
								notFoundContent="请在设置-系统设置-业务参数-二级来源中添加采集地点" >
								{didianChildren}
							</Select>
						)}
					</FormItem>
					
					<FormItem {...formItemLayout} label="活动成本">
				  		{getFieldDecorator('activityCost', {
							initialValue : itemDataSource.price || 0,
							rules: [{
					  			required: false,
					  			message: '',
							}],
						})(
							<InputNumber min={0} />
						)}
					</FormItem>
					
					<p className={styles.inputValueUnit}>元</p>
					
					<FormItem {...formItemLayout} label="收集信息">
					  	{getFieldDecorator('activityCollect', {
							initialValue : defaultOptions,
							rules: [{
					  			required: true,
					  			message: '请勾选收集信息',
							}],
						})(
						    <CheckboxGroup options={options} />
					  	)}
					</FormItem>
					
					<FormItem {...formItemLayout} label="表单标题">
						{getFieldDecorator('pageTitle', {
							initialValue : itemDataSource.pageTitle,
							rules: [
								{ required: true, message: '请输入表单标题', },
								{ max: 20, message: '限20字以内', },
							],
						})(
							<Input size = 'default' placeholder="请输入表单标题，限20字"  />
						)}
					</FormItem>
					
					<FormItem {...formItemLayout} label="表单Logo">
						{getFieldDecorator('pageLogo', {
	                        initialValue: itemDataSource.pageLogo,
	                        valuePropName: 'fileList',
	                        normalize: normFile,
	                        rules: [
								{ required: true, message: '请选择表单Logo', type: 'array'},
							],
	                    })(
	                        <Upload {...pageLogoUploadProps} >
	                             { getFieldValue('pageLogo') && getFieldValue('pageLogo').length >= 1 ?  null : uploadButton }
	                        </Upload>
	                    )}
					</FormItem>
					
					<FormItem {...formItemLayout} label="表单主题">
						{getFieldDecorator('topicCode', {
							initialValue : itemDataSource.topicCode || 'default',
							rules: [
								{ required: true, message: '请选择表单主题', },
							],
						})(
							<RadioGroup  >
						        <Radio value={'default'}><TopicPrevComponent text="默认" imgUrl="https://img.ishanshan.com/gimg/img/28d3dec2ed11f6604b0de03e83dbab2b" /></Radio>
						        <Radio value={'cartoon'}><TopicPrevComponent text="卡通" imgUrl="https://img.ishanshan.com/gimg/img/8e8dfa142218d32e811fd8eb01606cee" /></Radio>
						        <Radio value={'limpid'}><TopicPrevComponent text="清晰" imgUrl="https://img.ishanshan.com/gimg/img/7e5b621ea6d3152b817c15f2b1094f3a" /></Radio>
					      	</RadioGroup>
						)}
					</FormItem>
        
					<FormItem {...formItemLayout} label="备注">
						<Input size = 'default' type="textarea" placeholder="请输入备注(最多100字)"  { ...noteProps } />
					</FormItem>
				</Form>
			  
			  	<div className={styles.modalButtonDivStyle}>
					<Button className={styles.modalButtonStyle} onClick={() => addActivityHandleCancel()}>取消</Button>
				  	<Button className={styles.modalButtonStyle} 
				  		type="primary" 
				  		onClick={() => touchCreateQRModal()}
						// disabled={itemDataSource && String(itemDataSource.isHq) === '1' ? (editStatus ? saveButtonDsiabled : disabledCreateQrBtn) : true }
						disabled={editStatus ? (itemDataSource && String(itemDataSource.isHq) !== '0' ? saveButtonDsiabled : true) : disabledCreateQrBtn}
				  	>{editStatus ? '保存'  : '生成二维码'}</Button>
				</div>

			</Modal>
			
			<QRCodeComponent {...qrProps} />
			
			<AnalysisComponent {...analysisProps} />

			{/*<TenantOrgSelectComponent { ...tenantOrgSelectProps2 } />*/}
		</div>
    );
}

class TopicPrevComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            prevVisible: false,
        }
        this.changePrevVisible = this.changePrevVisible.bind(this);
    }
	
	changePrevVisible() {
		this.setState({
			prevVisible: !this.state.prevVisible
		});
	}
	
	render(){
		
		let {text, imgUrl} = this.props;
		
		return (
			<div className={styles.topic_prev_item}>
				<div className={styles.topic_prev_text}>{text}</div>
				<img className={styles.topic_prev_img} src={imgUrl} onClick={this.changePrevVisible} />
				
				<Modal
		          title={null}
		          visible={this.state.prevVisible}
		          onOk={this.changePrevVisible}
		          onCancel={this.changePrevVisible}
		          maskClosable={true}
		          footer={null}
		          closable={true}
		        >
					<div className={styles.topic_img_prev_cont}>
						<img className={styles.topic_modal_prev_img} src={imgUrl} />
					</div>
				</Modal>
			</div>
		)
	}
}
export default Form.create()(MicroModuleFormComponent);
