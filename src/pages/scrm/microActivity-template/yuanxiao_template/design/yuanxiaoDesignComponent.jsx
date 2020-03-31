/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';

//引入页面模板
let YuanxiaoMainDesignComponent = require('../../general_template/generalMainDesignComponent');
let YuanxiaoPage1DesignComponent = require('../../general_template/Page1DesignComponent2');
let YuanxiaoPage2DesignComponent = require('../../general_template/Page2DesignComponent1');
let YuanxiaoPage3DesignComponent = require('../../general_template/Page3DesignComponent');
let YuanxiaoPage4DesignComponent = require('../../general_template/Page4DesignComponent1');
let YuanxiaoPage5DesignComponent = require('../../general_template/Page5DesignComponent');
let YuanxiaoPage6DesignComponent = require('../../general_template/Page6DesignComponent');


let YuanxiaoDesignComponent = React.createClass({
	getInitialState() {
		return {

			mainData          : this.props.mainData || "",         //分享页面配置项
			detailData        : this.props.detailData || "" ,      //模板页面配置项
			initFlag          : this.props.initFlag,
			currentPage       : '' ,                               //当前页
			currentPageType   : '' ,							   //当前模板名称
			hasDelete         : false,                             //删除当前页是否可用

		}
	},

	componentWillReceiveProps(nextProps) {
		this.setState({
			initFlag : nextProps.initFlag,
			mainData          : nextProps.mainData || "",         //分享页面配置项
			detailData        : nextProps.detailData || "" ,      //模板页面配置项
		})
		if ( (nextProps.formVisible && this.props.formVisible !== nextProps.formVisible) ){
			this.setState({
				currentPage : '',
				hasDelete   : false,
			})
		}
	},
	//预览功能
	onPreview(mainData){
		this.props.onPreview(mainData);
	},
	//子页面预览功能
	onChildPreview(detailData , seqNo){
		this.props.onChildPreview(detailData , seqNo);
	},
	//保存实例
	saveInstance(){
		this.props.saveInstance()
	},
	//删除当前页
	onRemove(seqNo){
		clearInterval(window.timer);
		this.state.detailData.splice( seqNo - 1 , 1 );
		let newDetailData = this.state.detailData;
		if ( newDetailData.length == 1 ){
			this.setState({
				hasDelete : true,
				initFlag  : true
			})
		}
		for ( let i = seqNo -1 ; i < newDetailData.length; i++ ){
			newDetailData[i].seqNo = i+1;
		}
		if ( newDetailData.length == seqNo - 1 ){
			this.setState({
				detailData : newDetailData,
				currentPage : seqNo -1 ,
				initFlag : true
			})
		} else {
			this.setState({
				detailData : newDetailData,
				currentPage : seqNo,
				initFlag : true
			})
		}

	},
	//上一页
	onPrev(seqNo){
		//清除实时预览定时器
		clearInterval(window.timer);
		this.setState({
			currentPage : seqNo - 1,
			initFlag : true
		})
	},
	//下一页
	onNext(seqNo){
		//清除实时预览定时器
		clearInterval(window.timer);
		this.setState({
			currentPage : seqNo + 1,
			initFlag : true
		})
	},
	//主页面到分页面 , 继续按钮
	onContinue(){
		this.setState({
			currentPage : 1,
			initFlag : true,
		})
	},
	render(){
		let { detailData , mainData ,formVisible ,currentSelectCampus, activityId } = this.props;

		let { hasDelete ,initFlag ,currentPage  } = this.state;
		//实时刷新
		this.props.refreshData(  detailData ,currentPage , initFlag );

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		let hasPrev = currentPage == 1;

		let hasNext = currentPage == this.state.detailData.length;

		let pageTotal = this.state.detailData.length;

		return (

			<div>
				{
					currentPageType == '' ? < YuanxiaoMainDesignComponent mainData = { mainData }
																		  detailData = { detailData }
																		  onContinue = {this.onContinue}
																		  onMainRender={this.onMainRender}
																		  formVisible = { formVisible }
																		  onPreview = {this.onPreview}
																		  currentSelectCampus = { currentSelectCampus }
																		  activityId = { activityId } />

					: currentPageType == 'Page1Component' ? <YuanxiaoPage1DesignComponent detailData = { detailData }
																						   onRemove = {this.onRemove}
																						   onRender={this.onRender}
																						   onPrev = {this.onPrev}
																						   onNext = {this.onNext}
																						   hasPrev = {hasPrev}
																						   hasNext = {hasNext}
																						   pageTotal = {pageTotal}
																						   hasDelete = {hasDelete}
																						   formVisible = { formVisible }
																						   onChildPreview = {this.onChildPreview} />

					: currentPageType == 'Page2Component' ? <YuanxiaoPage2DesignComponent detailData = { detailData }
																						   onRemove = {this.onRemove}
																						   onRender={this.onRender}
																						   onPrev = {this.onPrev}
																						   onNext = {this.onNext}
																						   hasPrev = {hasPrev}
																						   hasNext = {hasNext}
																						   pageTotal = {pageTotal}
																						   hasDelete = {hasDelete}
																						   formVisible = { formVisible }
																						   onChildPreview = {this.onChildPreview} />

					: currentPageType == 'Page3Component' ? <YuanxiaoPage3DesignComponent detailData = { detailData }
																						   onRemove = {this.onRemove}
																						   onRender={this.onRender}
																						   onPrev = {this.onPrev}
																						   onNext = {this.onNext}
																						   hasPrev = {hasPrev}
																						   hasNext = {hasNext}
																						   pageTotal = {pageTotal}
																						   hasDelete = {hasDelete}
																						   formVisible = { formVisible }
																						   onChildPreview = {this.onChildPreview} />

					: currentPageType == 'Page4Component' ? <YuanxiaoPage4DesignComponent detailData = { detailData }
																						   onRemove = {this.onRemove}
																						   onRender={this.onRender}
																						   onPrev = {this.onPrev}
																						   onNext = {this.onNext}
																						   hasPrev = {hasPrev}
																						   hasNext = {hasNext}
																						   pageTotal = {pageTotal}
																						   hasDelete = {hasDelete}
																						   formVisible = { formVisible }
																						   onChildPreview = {this.onChildPreview} />

					: currentPageType == 'Page5Component' ? <YuanxiaoPage5DesignComponent detailData = { detailData }
																						   onRemove = {this.onRemove}
																						   onRender={this.onRender}
																						   onPrev = {this.onPrev}
																						   onNext = {this.onNext}
																						   hasPrev = {hasPrev}
																						   hasNext = {hasNext}
																						   pageTotal = {pageTotal}
																						   hasDelete = {hasDelete}
																						   formVisible = { formVisible }
																						   onChildPreview = {this.onChildPreview} />

					: currentPageType == 'Page6Component' ? <YuanxiaoPage6DesignComponent detailData = { detailData }
																						   onRemove = {this.onRemove}
																						   onRender={this.onRender}
																						   onPrev = {this.onPrev}
																						   onNext = {this.onNext}
																						   hasPrev = {hasPrev}
																						   hasNext = {hasNext}
																						   pageTotal = {pageTotal}
																						   hasDelete = {hasDelete}
																						   formVisible = { formVisible }
																						   onChildPreview = {this.onChildPreview}
																						   saveInstance = {this.saveInstance} />

					: null
				}
			</div>
		)
	}
});

export default YuanxiaoDesignComponent;
