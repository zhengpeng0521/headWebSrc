/**
 * 模板配置项主控制器
 * @author yhwu
 */
import React from 'react';
import '../fine_arts_template.less';

//引入渲染页面模板
let FineArtsMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let FineArtsPageRenderComponent = require('./fineArtsPageRenderComponent');

let FineArtsRenderComponent = React.createClass({
	getInitialState() {
		return {
			detailData      : this.props.detailData  || "",
			mainData        : this.props.mainData    || "",
			currentPage     : this.props.currentPage || "",
			currentPageType : '',
		}
	},
	componentWillReceiveProps(nextProps) {
		if( this.props.currentPage !== nextProps.currentPage ){
			this.setState({
				currentPage : nextProps.currentPage || "",
			})
		}
		this.setState({
			detailData : nextProps.detailData || "",
			mainData   : nextProps.mainData   || "",
		})
	},
	render(){

		let { detailData ,currentPage ,mainData } = this.state;

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <FineArtsMainRenderComponent mainData={ mainData } />

					: currentPageType == 'Page1Component' ? <FineArtsPageRenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default FineArtsRenderComponent;
