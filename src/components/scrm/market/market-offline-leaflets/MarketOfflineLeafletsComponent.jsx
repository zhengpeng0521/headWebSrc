import React from 'react';
import styles from './MarketOfflineLeafletsComponent.less';
import {Button, Modal, Select, Form, Pagination, Popconfirm, Spin } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import TenantOrgSelect from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';
import ContentComponent from './MarketOfflineLeafletsContent';
import CountDownMsPage from '../../../../pages/common/count-down-ms/CountDownMsPage';

function MarketOfflineLeafletsComponent ({
	
	funcUpdateParam,
	funcChangePageIndex,
	funcCreateModelIns,
	funcUploadImage,
	funcSave,
	funcGetMarketList,
	funcRequestUserList,
	attrOrgId,
	attrVisible,
	attrInsId,
	attrPageSize,
	attrPageIndex,
	attrLeafletsListSource,
	arrrLeafletsListPage,
	attrDefaultTitle,
	attrDefaultContent,
	attrPageModal,
	attrPageMode,
	attrConfigData,
	attrSelectElement,
	attrRadioValue,
	attrActivityList,
	attrUserList,
	attrQrCodeStatus,
	attrDomain,
	attrShowDownLoad,
	attrDefId,
	attrDownload,
	attrDownloadString,
	attrOriginConfigData,
	attrSource,
	attrInstData,
	attrLoding,
	attrAligntext,
	attrHiddenEdit,
	funcCloseCountDown,
	funcOfflineLeafletsList,
	funcCallUpdateFunction,
	attrQrInputString,
	attrQrImages,
	attrReturnQrurl,
	attrStyleText,
	attrStyleLetterSpacing,
	attrEditElementText,
	attrLoadNextPage,
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
	}

}) {

	let formItemLayout = {
		labelCol : { span : 2 },
		wrapperCol : { span : 7 }
	};
	
	//校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 300,
        onChange     : tenantSelectOnSelect,            
    };
	
	//更新校区
	function tenantSelectOnSelect(value) {
		funcUpdateParam({attrOrgId : value, attrLeafletsListSource : [], attrPageIndex : 0});
		funcOfflineLeafletsList({attrOrgId : value});
		funcGetMarketList({attrOrgId : value});
	}
	
	//创建开通
	function funcTouchCreateOrOpen(item) {
		if(item.isOpen == 1 || item.isOpen == '1') {
			funcCreateModelIns({attrPageModal : !attrPageModal, defId : item.id});
		} else {
			funcUpdateParam({attrVisible : !attrVisible, attrDefaultTitle : '传单开通', attrDefaultContent : '您可以拨打400-660-5733在线升级。'});
		}
	}
	
	//分页改变
	function onChange(page) {
		funcChangePageIndex({attrPageIndex : page - 1, attrOrgId : attrOrgId});
	}
	
	function handleOk() {
		funcUpdateParam({attrVisible : !attrVisible, attrDefaultTitle : '个性定制', attrDefaultContent : '您可以拨打400-660-5733进行个性化定制。'});
	}
	
	//关闭弹框
	function handleConfrim() {
		funcUpdateParam({attrVisible : !attrVisible});
	}
	
	let props = {
		attrOrgId,
		attrPageMode,
		attrPageModal,
		attrConfigData,
		attrSelectElement,
		attrRadioValue,
		attrActivityList,
		attrUserList,
		funcUpdateParam,
		funcUploadImage,
		funcSave,
		funcRequestUserList,
		funcGetMarketList,
		attrQrCodeStatus,
		attrDomain,
		attrShowDownLoad,
		attrDefId,
		attrDownload,
		attrDownloadString,
		attrInstData,
		attrSource,
		attrLoding,
		attrAligntext,
		funcCloseCountDown,
		funcCallUpdateFunction,
		attrHiddenEdit,
		attrQrInputString,
		attrOriginConfigData,
		attrQrImages,
		attrInsId,
		attrStyleText,
		attrStyleLetterSpacing,
		attrReturnQrurl,
		attrEditElementText,
		attrLoadNextPage,
	}
		
	function mouseover(index) {
		let element = document.getElementById(`cardStyle${index}`);
		element.style.animationDuration = '0.8s';
	}
	
	function mouseout(index) {
		let element = document.getElementById(`cardStyle${index}`);
		element.style.animationDelay = '0s';
		element.style.animationDuration = '0s';		
		element.style.webkitAnimationDelay = '0s';
		element.style.webkitAnimationDuration = '0s';
		element.style.opacity = '1';
	}
	
	//加载数据
	function onScrollChange(e) {
		let content = document.getElementById('cardContent');
		if(content) {
			if(content.scrollHeight - (content.scrollTop + content.clientHeight) < 100) {				
				if(attrLoadNextPage == false && attrLeafletsListSource.length < arrrLeafletsListPage.resultCount) {
					funcUpdateParam({attrLoadNextPage : true});
					funcChangePageIndex({attrPageIndex : attrPageIndex + 1, attrOrgId : attrOrgId});
				} 
			}   
		}				
	}
		
	return (
		
		<div className={attrSource ? '' : "marketOfflineLeaflets"}>
			{
				attrLoding 
					?
				 	<div>
						<div className={styles.offline_mask}></div>
						<p className={styles.promptString}>正在生成中，大约需要30秒...</p>
						<div className={styles.turn_dot}></div>
					</div> 
					: ''
			}
			{
				attrSource ? '' :
					<div style={{height : '100%'}}>
						<div className={styles.orgSelect}>
							<Form>
								<FormItem {...formItemLayout}>
									{ getFieldDecorator('orgId',{
										initialValue : attrOrgId || '',
										rules : [
											{ required : true, message : '请选择校区' }
										]
									})(
										<TenantOrgSelect { ...tenantOrgSelectProps } />
									)}
								</FormItem>
							</Form>
						</div>
						<div className={styles.cardContent} id="cardContent" onScroll={onScrollChange}>
							<Spin spinning={attrLoadNextPage} tip="加载中...">
								{
									attrLeafletsListSource&&attrLeafletsListSource.map((item, index) => {	
										return  <div key={index} id={`cardStyle${index}`} className={styles.modelBaseDiv} onMouseOver={() => mouseover(index)} onMouseOut={() => mouseout(index)} style={{animationDelay : index * 0.05 + 's'}}>
													<div className={styles.modelCover}  style={{backgroundImage : 'url(' + item.icon + ')'}}>
														<div className={styles.useBaseDiv}>
															<div className={styles.useCount}>{item.amount || 0}<div className={styles.useString}>家机构已经创建</div></div>

														</div>
													</div>
													<div className={styles.modelTitle}>{item.title}</div>
													<div className={styles.modelIntro}>{item.intro}</div>
													{/*<div className={styles.modelIsOpen}>{parseInt(item.isOpen) ? "已开通" : '未开通'}</div>*/}
													<Button className={styles.modelIsOpenButton} type="primary" onClick={() => funcTouchCreateOrOpen(item)}>{parseInt(item.isOpen) ? "创建" : '开通'}</Button>
												</div>
									})
								}
									<div className={styles.nextLoadString}>{attrLoadNextPage ? '加载中...' : attrLoadNextPage==false&&(attrLeafletsListSource.length == arrrLeafletsListPage.resultCount) ? '已经加载完啦' : '加载中...' }</div>
								{
									/*
										<div className={styles.leafletsCustom}>没有找到合适的模板？试试<a onClick={() => handleOk()}>个性化定制</a>吧~</div>
										<div className={styles.pagePagination}>
											<Pagination
												total={arrrLeafletsListPage.resultCount}
												showTotal={total => `共${arrrLeafletsListPage.resultCount || 0}条`}
												pageSize={attrPageSize * 2}
												defaultCurrent={1}
												current={attrPageIndex + 1}
												onChange={onChange} 
											/>
										</div>
									*/
								}
							</Spin>
						</div>
						<Modal title={attrDefaultTitle} width="600px" visible={attrVisible} onOk={() => handleConfrim()} onCancel={() => handleConfrim()} footer={<Button type="primary" onClick={() => handleConfrim()}>确定</Button>}>
							<div className={styles.customText}>{attrDefaultContent}</div>
						</Modal>
					</div>
			}
			<ContentComponent {...props} />	
			<CountDownMsPage />
		</div>
	);
}

export default Form.create()(MarketOfflineLeafletsComponent);
