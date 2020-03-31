import React from 'react';
import styles from './MarketOfflineLeafletsContent.less';
import {Button, Modal, Select, Form, Popconfirm, Radio, Tabs, Popover, Icon, Switch, Input, Upload, Row, Col, message, Spin} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
import QRCode from 'qrcode.react';
import PageModal from '../../micro-module/page-modal/PageModal';
import TenantOrgSelect from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import ColorSelect from '../../../common/color-select/ColorSelect';

function MarketOfflineLeafletsContentComponent ({
	
	attrDefId,
	attrInsId,
	attrDomain,
	attrOrgId,
	attrPageMode,
	attrPageModal,
	attrConfigData,
	attrRadioValue,
	attrSelectElement,
	attrActivityList,
	attrQrCodeStatus,
	attrDownloadString,
	attrUserList,
	attrShowDownLoad,
	funcUpdateParam,
	funcChangePageMode,
	funcGetMarketList,
	funcUploadImage,
	funcRequestUserList,
	funcCloseCountDown,
	funcCallUpdateFunction,
	attrOriginConfigData,
	funcSave,
	attrInstData,
	attrDownload,
	attrSource,
	attrLoding,
	attrAligntext,
	attrHiddenEdit,
	attrQrInputString,
	attrQrImages,
	attrReturnQrurl,
	attrStyleText,
	attrStyleLetterSpacing,
	attrEditElementText,
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
	
	
	//预览图片	
	let selectTextAlginArr = attrSelectElement&&attrSelectElement.item.selectTextAlign&&attrSelectElement.item.selectTextAlign.split(',') || ["false", "false", "false", "false", "false", "false", "false", "false", "false"];

	let qrList = [];
		
	let qrListJSON = attrInstData&&attrInstData.pageImgs ? JSON.parse(attrInstData.pageImgs || '') : {};
	
	if(attrReturnQrurl != undefined && Object.keys(attrReturnQrurl).length > 0) {
		qrList.push(attrReturnQrurl&&attrReturnQrurl.index1);
		qrList.push(attrReturnQrurl&&attrReturnQrurl.index2);
	} else {
		
		if(attrConfigData&&attrConfigData.qrCodeList != undefined) {
		   qrList = attrConfigData.qrCodeList;
		} else {

			if(Object.keys(qrListJSON).length > 0) {
				qrList.push(qrListJSON.index1);
				qrList.push(qrListJSON.index2);
			} else {
				qrList.push(attrConfigData&&attrConfigData.index1);
				qrList.push(attrConfigData&&attrConfigData.index2);
			}
		}
	}
		
	let fromData = getFieldsValue();
	
	//自定义二维码链接是否为空
	let buttonStatus = fromData.qr_input&&fromData.qr_input.length > 0 || (attrSelectElement&&attrSelectElement.item.type==='qrImage'&&attrSelectElement.item.qrInputValue.length > 0) ? false : true;
				
	//界面基础㤚（背景图片和背景颜色）
	let config = attrConfigData&&attrConfigData.mainConfig;
	
	//获取正反面
	let behindOrFront = config&&config.attrFrontAndBehind;

	//获取主界面配置
	let mainStyle = behindOrFront === 'front' ? attrConfigData&&attrConfigData.frontPageConfig.pageConfig : attrConfigData&&attrConfigData.behindPageConfig.pageConfig;
		
	//页面反面主配置颜色
	let mainBackgroundColor = attrConfigData&&attrConfigData.behindPageConfig.pageConfig;
	
	//页面正面主配置颜色
	let mainFrontgroundColor = attrConfigData&&attrConfigData.frontPageConfig.pageConfig;
			
	//获取元素正面数据
	let itemArr1 = attrConfigData&&attrConfigData.frontPageConfig.itemConfig;
	
	//获取元素反面数据
	let itemArr2 = attrConfigData&&attrConfigData.behindPageConfig.itemConfig;
		
	//采单人员数据
	const children = [];
	if(attrUserList&&attrUserList.length>0) {
	   attrUserList.map((item, index) => {
		   children.push(<Option key={item.id}>{item.member_name}</Option>);
	   })
	}

	//默认采单人员
	const defaultChildren = [];
	const defaultUserList = [];
	
	if(attrSelectElement&&attrSelectElement.item.type === 'qrImage') {
		if(attrSelectElement.item.activityId&&attrSelectElement.item.activityId.length) {
	   		defaultUserList.push(attrSelectElement.item.activityId);
		}
		
		attrSelectElement.item.memberId&&attrSelectElement.item.memberId.map((item, index) => {
			defaultChildren.push(item);
		})
	}
			
	//modal确定
	function handleOk() {
		funcUpdateParam({attrVisible : !attrVisible, attrDefaultTitle : '个性定制', attrDefaultContent : '您可以拨打400-660-5733进行个性化定制。'});
	}
	
	//关闭页面
	function handleClose() {
		resetFields();
		funcUpdateParam({attrPageModal : false, attrSelectElement : undefined});
		funcCloseCountDown();
	}
	
	//提交数据
	function handleOnSubmit(e) {
		
		funcUpdateParam({attrSelectElement : undefined});
					
   		validateFieldsAndScroll((err, values) => {
			if (!!err) {
				let keys = Object.keys(err);			
				keys.map((item, index) => {
					if(err[item].errors[0].message === '请输入传单名称') {
						funcUpdateParam({attrPageMode : 'baseSet'});
					}
					return message.error(err[item].errors[0].message);
				})				
		  	} else {
				
				let data = getFieldsValue();
								
				let arr1 = attrConfigData&&attrConfigData.frontPageConfig.itemConfig;
				let arr2 = attrConfigData&&attrConfigData.behindPageConfig.itemConfig;
				let activityParam = {};
				
				let isReturn = false;
				
				arr1.map((item, index) => {
					if(item.item.type === 'qrImage' && item.item.orgSet) {
						if(item.item.attrRadioValue&&item.item.attrRadioValue != "custom") {
						    if(item.item.activityId&&item.item.activityId.length > 0 && item.item.memberId&&item.item.memberId.length > 0) {
						   		activityParam.activityId = item.item.activityId;
								activityParam.memberId = item.item.memberId;
								activityParam.attrRadioValue = item.item.attrRadioValue;
						   } else {
							  isReturn = true;
							  return message.error('正面二维码未关联活动');
						   }
						} else {
							if(item.item.qrInputValue&&item.item.qrInputValue.length > 0) {

							} else {
								
								isReturn = true;
						   		return message.error('请完善设置二维码')
							}
						}   
					}
				})
				
				arr2.map((item, index) => {
					if(item.item.type === 'qrImage' && item.item.orgSet) {
						if(item.item.attrRadioValue&&item.item.attrRadioValue != "custom") {
						    if(item.item.activityId&&item.item.activityId.length > 0 && item.item.memberId&&item.item.memberId.length > 0) {
								activityParam.activityId = item.item.activityId;
								activityParam.memberId = item.item.memberId;
								activityParam.attrRadioValue = item.item.attrRadioValue;
						   } else {
							   isReturn = true;
							  return message.error('反面二维码未关联活动');
						   }
						} else {
							if(item.item.qrInputValue&&item.item.qrInputValue.length > 0) {
								
							} else {

								isReturn = true;
						   		return message.error('请完善设置二维码')
							}
						}   
					}
				})
						
				if(isReturn) {return}
				
				let tempCanvasList = [];
							
				var element1 = document.getElementById("createCanvas_qian0");  
				var element2 = document.getElementById("createCanvas_hou0");  

				if(element1 && element2) {

					funcUpdateParam({attrLoding : true});
					
					//第四步
					function myRenderFunction2(canvas) {
						attrQrImages.index2 = canvas.toDataURL();
						funcUpdateParam({attrConfigData : attrConfigData, attrQrImages : attrQrImages});
						save(attrQrImages);
					}

					//第二步 这里是异步调用
					function myRenderFunction1(canvas) {
						attrQrImages.index1 = canvas.toDataURL();

						//第三步
						html2canvas(element2, {
							useCORS : true,
							scale : 2,
							background : element2.style.backgroundColor,
							onrendered: myRenderFunction2
						});
					}

					//第一步
					html2canvas(element1, {
						useCORS : true,
						scale : 2,
						background : element1.style.backgroundColor,
						onrendered: myRenderFunction1
					});
					
				} else {
					message.error('生成图片失败');
					funcUpdateParam({attrLoding : false});
				} 		
								
				function save(value) {						
					funcSave({
						type 		: activityParam.attrRadioValue === 'select' ? '1' : '2',
						marketId 	: activityParam.attrRadioValue === 'select' ? activityParam.activityId : undefined,
						defId 		: attrDefId,
						id 			: attrInstData.id,
						orgId 		: attrOrgId,
						allConfig 	: JSON.stringify(attrConfigData), 
						index1		: JSON.stringify(attrQrImages.index1 || ''),
						index2		: JSON.stringify(attrQrImages.index2 || ''),
						fromData 	: getFieldsValue(),
					});
				}
								
			}
		});
		
		//funcUpdateParam({attrPageModal : !attrPageModal});
	}
		
	//更改右侧选中tabs
	function changePageMode(e) {
		funcUpdateParam({attrPageMode : e})
	}
	
	//更改左侧选中tabs
	function changeMode(value) {
		attrConfigData.mainConfig.attrFrontAndBehind = value.target.value;
		funcUpdateParam({attrConfigData : attrConfigData, attrPageMode : 'baseSet', attrSelectElement : undefined})
	}

	//更改switch状态
	function swicthStatus(value) {
		attrConfigData.mainConfig.attrShowBleedingLine = value;
		funcUpdateParam({attrConfigData : attrConfigData})
	}
	
	//选择二维码生成方式
	function onChangeRadio(e) {
		if(e.target.value === 'select') {
			attrSelectElement.item.qrInputValue = '';	
		} else {
			attrSelectElement.item.memberId = '';
			attrSelectElement.item.activityId = '';
		}
		attrSelectElement.item.attrRadioValue = e.target.value;	
		generalValue(attrSelectElement);
		funcUpdateParam({attrRadioValue : e.target.value, attrQrInputString : undefined})
	}
	
	function generalValue(value) {
					
		if(behindOrFront === 'front') {
			attrConfigData.frontPageConfig.itemConfig[attrSelectElement.index] = value;
		} else {
			attrConfigData.behindPageConfig.itemConfig[attrSelectElement.index] = value;
		}		
		funcUpdateParam({attrConfigData : attrConfigData, attrSelectElement : value});
	}
	
	//处理横竖排班样式
	let pageLaoyoutStyle = config&&config.attrDirection === 'vertical' ? { minWidth : '583px', minHeight : '786px', maxWidth : '583px', maxHeight : '786px' } : { minWidth : '786px', minHeight : '583px', maxWidth : '786px', maxHeight : '583px' }
		
	let bleedingLaoyoutStyle = config&&config.attrDirection === 'vertical' ? { minWidth : '567px', minHeight : '770px', maxWidth : '567px', maxHeight : '770px' } : { minWidth : '770px', minHeight	: '567px', maxWidth : '770px', maxHeight : '567px' }
	
	//处理横竖顶部距离
	let leftStyle = config&&config.attrDirection === 'vertical' ? { left : '8px' } : { left : '-90px' }

	const content = (
	  <div className={styles.bleedingLineExplainDiv}>
		<div className={styles.bleedingLineExplainDivString}>出血位是指印刷时为保留画面有效内容预留出的方便裁剪的部分。是一个常用的印刷术语，印刷中的出血是指加大产品外尺寸的图案，在裁剪位加一些图案的延伸，专门给各生产工序在其工艺公差范围内使用，已避免裁剪后的成品露白或裁剪到内容。</div>
		<div className={styles.bleedingLineExplainDivImage}>
			<div className={styles.bleedingLineExplainDivLine}></div>
		</div>
	  </div>
	);
	
	let formItemLayout = {
		labelCol : { span : 3 },
		wrapperCol : { span : 7 }
	};
		
	//校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 320,
        onChange     : tenantSelectOnSelect,            
    };
	
	//更新校区
	function tenantSelectOnSelect(value) {		
		funcUpdateParam({attrOrgId : value});
		funcGetMarketList({attrOrgId : value});
	}

	//选中元素
	function selectElement(item) {
				
		let _attrStyleText = [];
		let _attrStyleLetterSpacing = [];
		if(item.item.type == 'text') {
			let _fontSize 	   = item.item.fontSize;
			let _letterSpacing = item.item.letterSpacing;
			
				_attrStyleText = [{key : '默认', value : _fontSize}, 
								 {key : '最小', value : _fontSize == '13px' ? '13.01px' : '13px'},
								 {key : '较小', value : _fontSize == '15px' ? '15.01px' : '15px'},
								 {key : '适中', value : _fontSize == '27px' ? '27.01px' : '27px'},
								 {key : '较大', value : _fontSize == '50px' ? '50.01px' : '50px'},
								 {key : '超大', value : _fontSize == '75px' ? '75.01px' : '75px'}];
		
				_attrStyleLetterSpacing = [{key : '默认', value : _letterSpacing}, 
										  {key : '紧凑', value : _letterSpacing == 0 ? 0.01 : 0},
										  {key : '正常', value : _letterSpacing == 5 ? 5.01 : 5},
										  {key : '加宽', value : _letterSpacing == 10 ? 10.01 : 10},
										  {key : '超宽', value : _letterSpacing == 30 ? 30.01 : 30}];
			
		} else {
			_attrStyleText = attrStyleText;
			_attrStyleLetterSpacing = attrStyleLetterSpacing;
		}

		if(item.item.orgSet) {
			funcUpdateParam({
				attrSelectElement : item, 
				attrPageMode : 'pageSet',
				attrStyleText	: _attrStyleText,
				attrStyleLetterSpacing : _attrStyleLetterSpacing,
			});
		} 
	}
	
	//图片添加操作
	function onChangeFunction(e) {	
		if(e.file && e.file.size > 2048000) {
		   return message.error('图片不能大于2M')
		}
		funcUploadImage({file : e.file});
	}
	
	//图片删除操作
	function onChangeRemoveFunction(e) {
		itemArr1&&itemArr1.map((item, index) => {
			if(e.uid === item.key) {
				itemArr1[index].item.backgroundImage = null;
			}
		})
			
		itemArr2&&itemArr2.map((item, index) => {
			if(e.uid === item.key) {
				itemArr2[index].item.backgroundImage = null;
			}
		})
				
		if(behindOrFront === 'front') {
			attrConfigData.frontPageConfig.itemConfig = itemArr1;
		} else {
			attrConfigData.behindPageConfig.itemConfig = itemArr2;
		}
		funcUpdateParam({attrConfigData : attrConfigData});
	}
	
	let fileList = [];
	
	if(attrSelectElement != undefined) {
		
		if(attrSelectElement.item.backgroundImage === null) {
			fileList = [];
		} else {
			fileList.push({
				uid 	: attrSelectElement.key,
				status	: 'done',
				url		: attrSelectElement.item.backgroundImage,
			});
		}
	}

	const props = {
        name : "file",
		action: `${BASE_URL}/systemController/upload`,
		className : "avatar-uploader", 
		listType :"picture-card",
		fileList : fileList,
		customRequest : onChangeFunction,
		onRemove : onChangeRemoveFunction,
	};
	
	function baseTextParamonChange(e) {
		attrSelectElement.item.value = e.target.value;
		funcUpdateParam({attrEditElementText : true});
		generalValue(attrSelectElement);
	}
	
	function baseTextParamonBlurChange(e) {
		// if(e.target.value.length > attrSelectElement.item.textMaxLength) {
		// 	let vue = e.target.value.substring(0, attrSelectElement.item.textMaxLength);
		// 	attrSelectElement.item.value = vue;
		// 	generalValue(attrSelectElement);
		// 	funcUpdateParam({attrEditElementText : false});
		// 	return message.error(`最多${attrSelectElement.item.textMaxLength}个字`);
		// }
	}

	function changeTextSize(value) {
		attrSelectElement.item.fontSize = value;
		generalValue(attrSelectElement);
	}
	
	function changeTextSpacing(value) {
		attrSelectElement.item.letterSpacing = parseInt(value);
		generalValue(attrSelectElement);
	}
	
	function changeTextColor(value) {
		attrSelectElement.item.color = value;
		generalValue(attrSelectElement);
	}
		
	function alignParmaChange(value) {

		var elementH = parseInt(attrSelectElement.item.h&&attrSelectElement.item.h.replace("px", ""));
		var elementW = parseInt(attrSelectElement.item.w&&attrSelectElement.item.w.replace("px", ""));
		
		function delectParam() {
			delete attrSelectElement.item.display;
			delete attrSelectElement.item.justifyContent;
			delete attrSelectElement.item.alignItems;	
		}
		
		function changeStatus(indexArr, value) {		
			indexArr.map((item, index) => {
				if(value == item) {
					if(value >= 6 && value <= 8) {
						selectTextAlginArr[value] = selectTextAlginArr[value] == 'true' ? 'false' : 'true';
					} else {
						selectTextAlginArr[value] = 'true';
					}
				} else {
					if(value >= 6 && value <= 8) {
						selectTextAlginArr[item] = selectTextAlginArr[item];
					} else {
						selectTextAlginArr[item] = 'false';
					}
				}
			})
		}
		
		if(value <= 2) {
		   	changeStatus([0,1,2], value);
		} else if(value <= 5 && value >= 3) {
			changeStatus([3,4,5], value);
		} else if(value <= 8 && value >= 6) {	
			changeStatus([6,7,8], value);
		}	
		
		switch(value) {
			case 0 :
				delectParam();
				break;
			case 1 :
				attrSelectElement.item.display = 'flex';
				attrSelectElement.item.justifyContent = attrSelectElement.item.textAlign === 'left' ? 'start' : attrSelectElement.item.textAlign === 'right' ? 'flex-end' : 'center';
				attrSelectElement.item.alignItems = 'center';
				break;
			case 2 :
				attrSelectElement.item.display = 'table-cell';
				attrSelectElement.item.verticalAlign = 'bottom';
				break;
			case 3 :
				attrSelectElement.item.textAlign = 'left';
				attrSelectElement.item.justifyContent = attrSelectElement.item.textAlign === 'left' ? 'start' : attrSelectElement.item.textAlign === 'right' ? 'flex-end' : 'center';
				break;
			case 4 :
				attrSelectElement.item.textAlign = 'center';
				attrSelectElement.item.justifyContent = attrSelectElement.item.textAlign === 'left' ? 'start' : attrSelectElement.item.textAlign === 'right' ? 'flex-end' : 'center';
				break;
			case 5 :
				attrSelectElement.item.textAlign = 'right';
				attrSelectElement.item.justifyContent = attrSelectElement.item.textAlign === 'left' ? 'start' : attrSelectElement.item.textAlign === 'right' ? 'flex-end' : 'center';
				break;
			case 6 :
				attrSelectElement.item.fontWeight = attrSelectElement.item.fontWeight == 'bold' ? '' : 'bold';
				break;
			case 7 :
				attrSelectElement.item.fontStyle = attrSelectElement.item.fontStyle == 'oblique' ? '' : 'oblique';
				break;
			case 8 :
				attrSelectElement.item.textDecoration = attrSelectElement.item.textDecoration == 'underline' ? '' : 'underline';
				break;
			default :
				break;
		}

		attrSelectElement.item.selectTextAlign = selectTextAlginArr.join(',');
		generalValue(attrSelectElement);
	}
	
	//修改当前的选中釆单人员
	function changeCurrentMarketId(value) {
		//清空旧值
		setFields({market_activity_person : ''});
		//保存活动id
		attrSelectElement.item.activityId = value;		
		attrSelectElement.item.memberId = '';
		generalValue(attrSelectElement);
		funcRequestUserList(value);
	}
	
	//选择惨釆单人员
	function changeCurrentMarketUser(value) {	
		attrSelectElement.item.memberId = value;
		let qrLink = null;
		if(value.length > 0) {
			qrLink = `${attrDomain}html/market/activity?tenantId=${attrUserList[0].tenant_id}&orgId=${attrUserList[0].org_id}&activityId=${attrUserList[0].activity_id}&memberId=${value[0]}`;
		}

		funcUpdateParam({attrQrInputString : qrLink});
//		attrSelectElement.item.value = qrLink || '';
		generalValue(attrSelectElement);
	}
	
	//生成二维码
	function createQrCode() {
//		attrSelectElement.item.value = fromData.qr_input || '';
//		generalValue(attrSelectElement);

		funcUpdateParam({attrQrCodeStatus : true});
	}
	
	function changeQrCode() {
		funcUpdateParam({attrQrCodeStatus : false});
	}
	
	function changeOnBlurs(e) {	
		funcUpdateParam({attrQrInputString : e.target.value});
		attrSelectElement.item.qrInputValue = e.target.value;	
		generalValue(attrSelectElement);
	}
	
	//显示下载modal
	function showDownloadHandleOk() {
		funcUpdateParam({attrShowDownLoad : !attrShowDownLoad});
	}
	
	//关闭下载modal
	function showDownloadHandleCancel() {
		resetFields();
		funcUpdateParam({attrShowDownLoad : !attrShowDownLoad, attrPageModal : false, attrSelectElement : undefined, attrPageMode : 'baseSet'});
	}

	//选择下载方式
	function onChangeSelectImageFormat(e) {
		funcUpdateParam({attrDownload : e.target.value});
	}
		
	//从新编辑
	function onChangeToEdit () {
		attrConfigData.qrCodeList = [];
		funcUpdateParam({attrShowDownLoad : !attrShowDownLoad, attrConfigData: attrConfigData, attrSelectElement : undefined, attrPageMode : 'baseSet'});
		funcCallUpdateFunction({ id: attrInsId, attrPageModal : true });
	}
	
	//打包下载
	function onChangeLibDownload() {

		let baseArray = [];
		
		let num = 0;
		
		//添加生成canvas
		function showCanvas(element1, element2, userName) {
						
			let frontObj = {};
			let reverseObj = {};

			function uploadData() {
				let form = document.createElement('form');
					form.style = "display:none";
					form.method = 'POST';
					form.enctype= 'multipart/form-data';
					form.action = attrDownload === 1 ? `${BASE_URL}/offlineLeaflet/downLoadPNG` : `${BASE_URL}/offlineLeaflet/downLoadZip`;	
					document.body.appendChild(form);

					let input = document.createElement('input');
					input.type = "hidden";
					input.name = "downMsg";
					input.value = JSON.stringify(baseArray);

					form.appendChild(input);
					form.submit();
					document.body.removeChild(form); 
			}
			
			if(element1 && element2) {
				function myRenderFunction1(canvas) {
					frontObj.pageName = 'front'; 
					frontObj.pageCode = canvas.toDataURL();					
										
					function myRenderFunction2(canvas) {
						num++;
						reverseObj.pageName = 'reverse'; 
						reverseObj.pageCode = canvas.toDataURL();	

						if(num === qrImage&&qrImage.item.memberId&&qrImage.item.memberId.length) {
							uploadData();
						} else {
							uploadData();
						}
					} 

					html2canvas(element2, {
						useCORS : true,
						scale : 2,
						background : element2.style.backgroundColor,
						onrendered: myRenderFunction2
					});				
				}

				html2canvas(element1, {
					useCORS : true,
					scale : 2,
					background : element1.style.backgroundColor,
					onrendered: myRenderFunction1
				});

			}
			
			let newArr = [];

			newArr.push(frontObj, reverseObj);	

			let data = {
				'userPage' : newArr,
				'userName' : userName || '',
			}
				
			baseArray.push(data);		
		}
		
		//遍历获取二维码元素
		let arr1 = attrConfigData&&attrConfigData.frontPageConfig.itemConfig;
		
		let arr2 = attrConfigData&&attrConfigData.behindPageConfig.itemConfig;
		
		let qrImage = undefined;
		
		arr1.map((item, index) => {
			if(item.item.type === 'qrImage') {
				qrImage = item;
			}
		})

		arr2.map((item, index) => {
			if(item.item.type === 'qrImage') {
				qrImage = item;
			}
		})
						
		//获取所有绑定的釆单人员id并生成二维码
		qrImage&&qrImage.item.memberId&&qrImage.item.memberId.length>0&&qrImage.item.memberId.map((item, index) => {	
			attrUserList&&attrUserList.map((userIten, userIndex) => {				
				if(userIten.id === item) {
					var element1 = document.getElementById("createCanvas_qian" + (index + 1));  
					var element2 = document.getElementById("createCanvas_hou" + (index + 1)) ;  
					showCanvas(element1, element2, userIten.member_name);
				} 
			})
		})

		if(qrImage == undefined || qrImage.item.memberId == '' || qrImage.item.memberId == undefined) {
			var element1 = document.getElementById("createCanvas_qian0");  
			var element2 = document.getElementById("createCanvas_hou0") ;  
			showCanvas(element1, element2);
		}
	}
			
	//选中元素的可编辑区域
	function elementComponent() {

		switch(attrSelectElement&&attrSelectElement.item.type) {
				
			case 'text' :		
				return 	<div style={{width : '100%'}}>
							<div className={styles.editElementParamLabel}>文本内容</div>
							<div className={styles.editElementParamContent1}>
								<Input
									type="textarea"
									placeholder="请输入文本内容"
									defaultValue={attrSelectElement.item.value}
									value={attrSelectElement.item.value}
									onChange={baseTextParamonChange}
									onBlur={baseTextParamonBlurChange}
								 />
							</div>
                       	
                        	<div className={styles.inputBox}>                   
                           		<div className={styles.editElementParamLabel}>文本字号</div>
                           		<div className={styles.editElementParamContent}>
									<Select onChange={changeTextSize} style={{width : '100%'}} defaultValue='默认'>
										{
											attrStyleText&&attrStyleText.map((item, index) => {
												return <Option key={item.key} value={item.value}>{item.key}</Option>	
											})
										}
									</Select>	
								</div>
                          	</div>
                       
                           	<div className={styles.inputBox}>
                            	<div className={styles.editElementParamLabel}>文本间距</div>
                            	<div className={styles.editElementParamContent}>
									<Select onChange={changeTextSpacing} style={{width : '100%'}} defaultValue='默认'>
										{
											attrStyleLetterSpacing&&attrStyleLetterSpacing.map((item, index) => {
												return <Option key={item.key} value={String(item.value)}>{item.key}</Option>
											})
										}
									</Select>
								</div>
 							</div>
						
 							<div className={styles.inputBox}>
								<div className={styles.editElementParamLabel}>文本颜色</div>
								<div className={styles.editElementParamContent}>
									<ColorSelect  width='70px' height='24px' onChange={changeTextColor} value={attrSelectElement.item.color} />
								</div>
							</div>
							
							<div className={styles.inputBox}>
								<div className={styles.editElementParamLabel}>文本样式</div>
								<div className={styles.editElementParamContent}>
								{
									attrAligntext&&attrAligntext.map((item, index) => {
										
										let selectStyle = selectTextAlginArr[index] == 'true' ? styles.selectAlginText : styles.alignText;
										return <div key={index} 
													className={selectStyle} 
													style={index % 3 ? {} : {clear : 'both'}} onClick={() => alignParmaChange(index)}
												>
													<Icon type={item.value} title={item.title} />
												</div>
										}) 
								}
								</div>
							</div>
						</div>
				break;
			case 'image' :
				return 	<Upload {...props}>
								{
									fileList.length == 1
									? 	null 
									: 	<div>
											<div>
												<Icon type="plus" />
												<div className="ant-upload-text">Upload</div>
											</div>
										</div>
								}
						</Upload>	
				break;
			case 'qrImage' :
				return  <div className={styles.qrBox}>
							<div  className={styles.qrTitle}>生成方式：</div>
							<div className={styles.qrLeftBox}>
								<RadioGroup onChange={onChangeRadio} value={attrSelectElement&&attrSelectElement.item.attrRadioValue || attrRadioValue}>
									<Radio value="select">选择市场活动生成二维码</Radio>
								</RadioGroup>
							</div>
							<div className={styles.selectBox}>
								{
									attrRadioValue == 'select' ? 
										<div className={styles.qrCenterBox}>								
											<Form>
												<Col span={20}>
													<FormItem style={{marginLeft : '80px', marginTop : '-0px'}}>
														{getFieldDecorator('market_activity', {
															initialValue : defaultUserList.length > 0 ? defaultUserList : undefined,
															rules: [{ required: true, message: '请选择市场活动' }],
														})(
															<Select placeholder="请选择市场活动生成二维码" notFoundContent="请先在市场管理-市场活动中添加活动" onChange={changeCurrentMarketId}>
																{
																	attrActivityList&&attrActivityList.map((item, index) => {
																		return <Option key={item.id} value={String(item.id)}>{item.name}</Option>
																	})
																}
															</Select>
														)}
													</FormItem>
												</Col>
											</Form>
										</div> : ''
								}
							</div>
							<div className={styles.selectBox}>
							{
								attrRadioValue == 'select' && attrSelectElement && attrSelectElement.item.activityId&&attrSelectElement.item.activityId.length > 0 ? 
									<div className={styles.qrRightBox}>
										<Form>
											<Col span={20}>
												<FormItem style={{marginLeft : '80px', marginTop : '-0px'}}>
													{getFieldDecorator('market_activity_person', {
														initialValue : defaultChildren.length > 0 ? defaultChildren : undefined,
														rules: [{ required: true, message: '请选择采单人员' }],
													})(
														<Select 
															multiple={true} 
															tokenSeparators={[',']}
															placeholder="请选择采单人员" 
															notFoundContent="请在设置-系统设置-员工管理-添加员工" 
															onChange={changeCurrentMarketUser}
														>
															{children}
														</Select>
													)}
												</FormItem>
											</Col>
										</Form>
									</div> : ''
							}
							</div>
							<div className={styles.qrLeftBoxCustom}>
								<RadioGroup onChange={onChangeRadio} value={attrSelectElement&&attrSelectElement.item.attrRadioValue || attrRadioValue}>
									<Radio value="custom">自定义二维码</Radio>
								</RadioGroup>
							</div>
							{
								attrRadioValue == 'custom' ? 
									<div className={styles.qrInputCenterBox}>	
										<Form>
											<Col span={20}>
												<FormItem style={{marginLeft : '20px', marginTop : '-10px'}}>
													{getFieldDecorator('qr_input', {
														initialValue : attrSelectElement&&attrSelectElement.item.qrInputValue || undefined,
														rules: [{ required: true, message: '请输入二维码链接' }],
													})(
														<Input placeholder="请输入二维码链接" onFocus={() => changeQrCode()} onBlur={changeOnBlurs}/>
													)}
												</FormItem>
											</Col>
											<Button style={{marginLeft: '20px', float: 'left', clear: 'both'}} disabled={buttonStatus} onClick={() => createQrCode()} type="primary">生成二维码</Button>
										</Form>
									</div> : ''
							}
							{
								attrRadioValue == 'select' ? <div className={styles.qrNote}>备注：传单中的二维码默认为市场活动中第一个被选中的釆单员二维码</div>  : ''
							}
														
							
						</div>
				break;
			default :
				break;
		}
	}
	
	//监听点击元素之外区域
	window.onmousedown = function(e) {
				
		let isThrough = false;
		
		//判断元素是不是在编辑状态
		if(attrEditElementText) {
			// if(attrSelectElement.item.value.length > attrSelectElement.item.textMaxLength) {
			// 	let vue = attrSelectElement.item.value.substring(0, attrSelectElement.item.textMaxLength);
			// 	attrSelectElement.item.value = vue;
			// 	funcUpdateParam({attrEditElementText : false});
			// 	generalValue(attrSelectElement);
			// 	isThrough = true;
			// 	return message.error(`最多${attrSelectElement.item.textMaxLength}个字`);
			// }
		} 
		
		if(isThrough) { return }
		
		if(e.target.className.indexOf('leftContent') != -1 || e.target.className.indexOf('bleedingLine') != -1 ||  e.target.className.indexOf('contentBox') != -1) {
		   	funcUpdateParam({attrSelectElement : undefined});
		} 
    }

	let tabStyleLeft = attrPageMode === 'baseSet' ? styles.defaultDivLeft : styles.fromDivLeft;
	let tabStyleRight = attrPageMode === 'pageSet' ? styles.fromDivRight : styles.defaultDivLeft;	
	
	let setTitle = (
		<div className={styles.blueTitle}>{attrPageMode === 'baseSet' ? 
			'基础设置' : attrSelectElement&&attrSelectElement.item.type == 'text' ? 
			'文本设置' : attrSelectElement&&attrSelectElement.item.type == 'image' ? 
			'图片设置' : attrSelectElement&&attrSelectElement.item.type == 'qrImage' ?
			'二维码设置' : '页面设置'}
		</div>
	)
	
	let isNone = behindOrFront === 'front' ? true : false;
	
	let downloadProps = {
		attrDownloadString,
	}

	let mainProps = {
		attrSelectElement,
		isNone,
		generalParam : {
			...pageLaoyoutStyle,
			...leftStyle,
			backgroundPosition : mainStyle&&mainStyle.backgroundPosition,
			backgroundRepeat : mainStyle&&mainStyle.backgroundRepeat,
			backgroundSize : mainStyle&&mainStyle.backgroundSize,
			overflow: 'hidden',
		},
		frontParam : {
			backgroundColor: mainFrontgroundColor&&mainFrontgroundColor.backgroundColor,//正面主背景颜色
			zIndex : isNone ? 100 : 99,
			backgroundImage : `url(${attrConfigData&&attrConfigData.frontPageConfig.pageConfig.backgroundImage})`,
			// backgroundImage: `url(${BASE_URL}/uploadController/getByImgUrl?imgUrl=${attrConfigData && attrConfigData.frontPageConfig.pageConfig.backgroundImage})`,

		},
		backParam : {
			backgroundColor : mainBackgroundColor&&mainBackgroundColor.backgroundColor,//反面主背景颜色
			zIndex : isNone ? 99 : 100,
			backgroundImage : `url(${attrConfigData&&attrConfigData.behindPageConfig.pageConfig.backgroundImage})`,
			// backgroundImage: `url(${BASE_URL}/uploadController/getByImgUrl?imgUrl=${attrConfigData && attrConfigData.behindPageConfig.pageConfig.backgroundImage})`,
		},
		bleedingLaoyoutStyle,
		attrQrCodeStatus,
		fromData,
		attrUserList,
		config,
		itemArr1,
		itemArr2,
		selectElement,
		attrDomain,
		attrQrInputString,
	}
		
	let qrImage = undefined;
	
	let memPage = [];	
	
	itemArr1&&itemArr1.map((item, index) => {
		if(item.item.type === 'qrImage') {
			qrImage = item;
		}
	})

	itemArr2&&itemArr2.map((item, index) => {
		if(item.item.type === 'qrImage') {
			qrImage = item;
		}
	})
		
	//循环创建人员视图
	qrImage&&qrImage.item.memberId&&qrImage.item.memberId.length>0&&qrImage.item.memberId.map((item, index) => {
		let qrLink = `${attrDomain}html/market/activity?tenantId=${attrUserList[0].tenant_id}&orgId=${attrUserList[0].org_id}&activityId=${attrUserList[0].activity_id}&memberId=${item}`;
		memPage.push(<DataSourceComponent {...mainProps} codeValue={qrLink} indexValue={index + 1} key={index} />)
	})

	//正反面数据
	return (
		<div className="marketOfflineLeafletsContent">
			{/*<div className={styles.blurBox}>加载中...</div>*/}
			<PageModal
			   visible={attrPageModal}
			   maskClosable={false}
			   title={attrInstData&&attrInstData.name || (fromData.form_leaflets_name&&fromData.form_leaflets_name.length > 0 ? fromData.form_leaflets_name : '创建线下传单')}
			   width="calc(100vw - 150px)"
			   onClose={handleClose}
			   footer={[
					<Popconfirm title="确定要保存吗?" onConfirm={handleOnSubmit} placement="bottomRight" >
						<Button type="primary" disabled={attrLoding} loading={false} >{attrLoding ? '生成中' : '提交'}</Button>
					</Popconfirm>,
					<Popconfirm title="确定要关闭窗口吗?" onConfirm={handleClose} placement="bottomRight" >
						<Button type="ghost">关闭</Button>
					</Popconfirm>
				]}
			>			
				<div className={styles.leftContent}>
					<div className={styles.leafletsSize}>传单大小：210mm*285mm</div>
					<div className={styles.leafletsBleedingLineExplain}>
						<Popover content={content} title="">
							<Icon type="question-circle-o" className={styles.popoverContentIconDiv} />
						</Popover>
						<div className={styles.leafletsBleedingLineExplainSwith}>
							<Switch checkedChildren="开" unCheckedChildren="关" checked={config&&config.attrShowBleedingLine} onChange={swicthStatus}/>
						</div>
						<div className={styles.leafletsBleedingLineExplainText}>出血位</div>
					</div>
					<div className={styles.leftTabsBase}>
						<Radio.Group onChange={changeMode}
							checked={true} 
							defaultChecked={true} 
							value={config&&config.attrFrontAndBehind} 
							defaultValue={config&&config.attrFrontAndBehind} 
							style={{ marginBottom: 8 }}
						>
							<Radio.Button value="front">正面</Radio.Button>
							<Radio.Button value="Behind">反面</Radio.Button>
						</Radio.Group>
					</div>

					<DataSourceComponent {...mainProps} codeValue={attrQrInputString&&attrQrInputString.length > 0 ? attrQrInputString : 'http://www.ishanshan.com'} indexValue='0' />

					{
						memPage&&memPage.map((item, index) => {
							return item;
						})
					}
				</div>
				<div className={styles.rightContent}>
					<div className={styles.module_bar_cont}>
						<Tabs onChange={changePageMode} activeKey={attrPageMode}>
							<TabPane tab="基础设置" key="baseSet">
								<div className={styles.blueDivBox}>
									<div className={styles.blueDiv}></div>
									{setTitle}
								</div>	
								<div className={styles.tabContentDiv}>
									<Form style={{textAlign: 'left'}}>
										<FormItem {...formItemLayout} label="选择校区">
											{ getFieldDecorator('form_org_id', {
												initialValue : attrOrgId || '',
												rules : [
													{ required : true, message : '请选择校区' }
												]
											})(
												<TenantOrgSelect { ...tenantOrgSelectProps } disabled />
											)}
										</FormItem>
										<FormItem {...formItemLayout} label="传单名称" style={{textAlign: 'left'}}>
											{ getFieldDecorator('form_leaflets_name', {
												initialValue : attrInstData.name || '',
												rules : [
													{ required : true, message : '请输入传单名称' }
												]
											})(
												 <Input style={{width : 320}} />
											)}
										</FormItem>
									</Form>
								</div>
							</TabPane>
							<TabPane tab="页面设置" key="pageSet">
								<div className={styles.blueDivBox}>
									<div className={styles.blueDiv}></div>
									{setTitle}
								</div>	
								<div className={styles.tabContentDiv}>
									{elementComponent()}
									{attrSelectElement&&attrSelectElement.item.type == 'image' ? <div>图片大小≤2M，支持png,jpeg.gif格式</div> : ''}
								</div>
							</TabPane>
						</Tabs>
					</div>
				</div>
				<Modal
					title={attrDownloadString}
					visible={attrShowDownLoad}
					onOk={() => showDownloadHandleOk()}
					maskClosable={false}
					onCancel={() => showDownloadHandleCancel()}
					wrapClassName="canvas_modals"
					height='600px'
					width='500px'
					footer={
						<div>
							{attrHiddenEdit ? '' : <Button onClick={() => onChangeToEdit()}>再次编辑</Button>}
							<Button type="primary" onClick={() => onChangeLibDownload()}>打包下载</Button>
						</div>
					}
				>
					<div>
						{
							qrList&&qrList.map((item, index) => {
								let idx = `canvasContainer${index + 1}`;
								return 	<div key={index} id={idx} 
											 style={{
												marginRight: index == 0 ? '20px' : '0px',
												width : "223px",
												height : "318px",
												float : 'left',
											 }}>
											<div style={{
													width : "223px",
													height : "298px",
													backgroundSize : "100% 100%",
													backgroundPosition : 'center',
													backgroundImage : `url(${item&&item.value || item})`,
												}}
											>
											</div>
											<div className={styles.bothAndfrontString}>{index === 0 ? '正面' : '反面'}</div>
										</div>
							})	
						}
						<div className={styles.downloadString}>下载格式：</div>
						<div className={styles.downloadValue}>
							<RadioGroup onChange={onChangeSelectImageFormat} value={attrDownload}>
								<Radio value={1}>png</Radio>
								<Radio value={2}>pdf</Radio>
							</RadioGroup>
						</div>
						<div className={styles.downloadExplain}>备注：&nbsp; 点击"打包下载"按钮，则自动下载所有对应釆单员的传单</div>
					</div>
				</Modal>
			</PageModal>
		</div>
	);
}

function DataSourceComponent ({
	
	generalParam,
	frontParam,
	backParam,
	attrQrCodeStatus,
	fromData,
	attrUserList,
	config,
	itemArr1,
	itemArr2,
	selectElement,
	bleedingLaoyoutStyle,
	attrDomain,
	codeValue,
	indexValue,
	attrSelectElement,
	isNone,
	attrQrInputString,
	
}) {
			
	//元素默认样式
	function styleDeal(item) {
		
		// let newLink = `${BASE_URL}/uploadController/getByImgUrl?imgUrl=${item.backgroundImage}`;
		let newLink = item.backgroundImage;
		
		var f = parseInt(item.fontSize&&item.fontSize.replace("px", ""));
		
		4.28739496

		let newStyle = {};
			newStyle = {
				backgroundColor 	: item.backgroundColor,
				color 				: item.color,
				fontSize 			: f / 4.28739496 < 12 ? '12px' : f / 4.28739496 + 'px',
				opacity 			: item.opacity,
				textAlign 			: item.textAlign,
				boxShadow			: `rgb(0, 0, 0) 0px 0px ${item.boxShadow}px`,
				transform			: `rotate(${item.rotate}deg)`,
				borderWidth 		: `${item.borderWidth}px`,
				borderRadius 		: `${item.borderRadius}${item.type === 'text' ? 'px' : '%'}`,
				borderColor			: item.borderColor,
				borderStyle 		: item.borderStyle,
				paddingTop			: item.paddingTop,
				paddingLeft			: item.paddingLeft,
				paddingRight		: item.paddingRight,
				paddingBottom		: item.paddingBottom,
				letterSpacing		: `${item.letterSpacing}px`,
				backgroundImage 	: item.backgroundImage&&item.backgroundImage.length > 0 ? `url(${newLink})` : '',
				backgroundSize 		: item.backgroundSize,
				backgroundRepeat	: item.backgroundRepeat,
				backgroundPosition	: item.backgroundPosition,
				justifyContent		: item.justifyContent,
				alignItems			: item.alignItems,
				verticalAlign		: item.verticalAlign,
				height 				: item.h,
				width 				: item.w,	
				display				: item.display,
				wordWrap			: item.wordWrap,	
				fontStyle			: item.fontStyle,
				textDecoration		: item.textDecoration,
				fontFamily			: item.fontFamily,
				lineHeight			: item.lineHeight / 4.28739496 < 12 ? '12px' : item.lineHeight / 4.28739496 + 'px',
				fontWeight			: item.fontWeight,
				whiteSpace			: item.whiteSpace,
				textShadow			: item.textShadow,
			};
		
		return newStyle;
	}
	
	let newStyleFront = isNone ? styles.contentBox : styles.contentBoxNoSelect;
	
	let newStyleBehind = isNone ? styles.contentBoxNoSelect : styles.contentBox;
			
	let id_qian = 'createCanvas_qian' + indexValue;
	
	let id_hou = 'createCanvas_hou' + indexValue;
	
	return 	<div style={{opacity : indexValue == 0 ? 1 : 0 }}>
				{/*正面*/}
				<div id={id_qian} className={newStyleFront} style={{
						...generalParam,
						...frontParam,
					}}>
					{config&&config.attrShowBleedingLine ? <div className={styles.bleedingLine} style={{...bleedingLaoyoutStyle}} ></div> : ''}
					{
						itemArr1&&itemArr1.map((item, index) => {
							
							let w = parseInt(item.item.w.replace("px", ""));
							let h = parseInt(item.item.h.replace("px", ""));
							
							let newStyles = styleDeal(item.item);							

							return <div key={index} style={{
											...newStyles,
											position: 'absolute',
											left : item.item.x + 'px',
											top : item.item.y + 'px',
											width : w + 2 + 'px' || undefined, 
											height : h + 2 + 'px' || undefined,
											display : item.item.display == 'none' ? item.item.display : 'inline-block',
											zIndex: 1000 + index,
										}} onMouseDown={() => selectElement(item)}>
										{/*
										<div style={{
												width : item.item.w,
												height : '20px',
												position: 'absolute',
												top: '-20px',
												textAlign: 'left',
												color: '#5d9cec',
												fontSize : '12px',
										}}>{item === (attrSelectElement&&attrSelectElement) ? `${item.item.type === 'text' ? '文本' : item.item.type === 'image' ? '图片' : '二维码'}设置` : ''}</div>
										*/}
										{
											item.item.type == 'image' || item.item.type == 'text' ? 
											<div className={item.item.orgSet ?  styles.contentDivNoSelectBoxBorder : {}} style={{
														width 	: newStyles.width, 
														height	: newStyles.height,
														display	: newStyles.display,
														verticalAlign : newStyles.verticalAlign,
														justifyContent : newStyles.justifyContent,
														alignItems 	: newStyles.alignItems,
														backgroundColor : item === (attrSelectElement&&attrSelectElement) ? 'rgba(93, 155, 236, 0.3)' : '',														
													}}>
												<pre style={{whiteSpace : item.item.whiteSpace || 'normal', fontFamily : item.item.fontFamily || '', display: 'contents'}}>{item.item.value || ''}</pre>
											</div> : 
											<div className={item.item.orgSet ?  styles.contentDivNoSelectBoxBorder : {}} 
												style={item === (attrSelectElement&&attrSelectElement) ? {background: 'rgba(93, 155, 236, 0.3)', borderRadius : newStyles.borderRadius} : {borderRadius : newStyles.borderRadius}}
												id="qrBaseBox">
												<QRCode value = { codeValue != undefined ? codeValue : attrQrCodeStatus ? attrQrInputString || 'http://www.ishanshan.com' : item.item.value || 'http://www.ishanshan.com' } size = { w || 150 } />
											</div>
										}
									</div>
						})
					}
				</div>
				
				{/*反面*/}
				<div id={id_hou} className={newStyleBehind} style={{
						...generalParam,
						...backParam,

					}}>
					{config&&config.attrShowBleedingLine ? <div className={styles.bleedingLine} style={{...bleedingLaoyoutStyle}} ></div> : ''}
					{
						itemArr2&&itemArr2.map((item, index) => {
							
							let w = parseInt(item.item.w.replace("px", ""));

							let newStyles = styleDeal(item.item);

							return <div key={index} style={{
											...newStyles,
											position: 'absolute',
											left : item.item.x + 'px',
											top : item.item.y + 'px',
											width : item.item.w || undefined, 
											height : item.item.h || undefined,
											display : item.item.display == 'none' ? item.item.display : 'inline-block',
											zIndex: 1000 + index,
										}} onMouseDown={() => selectElement(item)}>
										{/*
										<div style={{
												width : item.item.w,
												height : '20px',
												position: 'absolute',
												top: '-20px',
												textAlign: 'left',
												color: '#5d9cec',
												fontSize : '12px',
										}}>{item === (attrSelectElement&&attrSelectElement) ? `${item.item.type === 'text' ? '文本' : item.item.type === 'image' ? '图片' : '二维码'}设置` : ''}</div>
										*/} 
										{
											item.item.type == 'image' || item.item.type == 'text' ? 
											<div className={item.item.orgSet ? styles.contentDivNoSelectBoxBorder : {}} 
												style={{
														width 	: newStyles.width, 
														height	: newStyles.height,
														display	: newStyles.display,
														verticalAlign : newStyles.verticalAlign,
														justifyContent : newStyles.justifyContent,
														alignItems 	: newStyles.alignItems,
														backgroundColor : item === (attrSelectElement&&attrSelectElement) ? 'rgba(93, 155, 236, 0.3)' : '',

													}}>
												<pre style={{whiteSpace : item.item.whiteSpace || 'normal', fontFamily : item.item.fontFamily || '', display: 'contents'}}>{item.item.value || ''}</pre>
											</div> : 
											<div className={item.item.orgSet ? styles.contentDivNoSelectBoxBorder : {}} 
												 style={ item === (attrSelectElement&&attrSelectElement) ? {backgroundColor: 'rgba(93, 156, 236, 1)', borderRadius : newStyles.borderRadius} : {borderRadius : newStyles.borderRadius}}
												 id="qrBaseBox">
												<QRCode value = { codeValue != undefined ? codeValue : attrQrCodeStatus ? attrQrInputString || 'http://www.ishanshan.com' : item.item.value || 'http://www.ishanshan.com' } size = { w || 150 } />
											</div>
										}
									</div>
						})
					}
				</div>
			</div>
}

export default Form.create()(MarketOfflineLeafletsContentComponent);
