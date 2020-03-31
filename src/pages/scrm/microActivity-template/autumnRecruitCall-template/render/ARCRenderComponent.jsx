import React from 'react';
import style from '../ARC_template.less';

//引入渲染页面模板
let ARCMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let ARCPage1RenderComponent = require('./ARCPage1RenderComponent');
let ARCPage2RenderComponent = require('./ARCPage2RenderComponent');
let ARCPage3RenderComponent = require('./ARCPage3RenderComponent');
let ARCPage4RenderComponent = require('./ARCPage4RenderComponent');
let ARCPage5RenderComponent = require('./ARCPage5RenderComponent');
let ARCPage6RenderComponent = require('./ARCPage6RenderComponent');
let ARCPage7RenderComponent = require('./ARCPage7RenderComponent');
let ARCPage8RenderComponent = require('./ARCPage8RenderComponent');
let CommonFallingComponent = require('../../../common/CommonFallingComponent/CommonFallingComponent');


let ChildrenDayRenderComponent = React.createClass({
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

		let { detailData, currentPage, mainData } = this.state;

		detailData = detailData[currentPage-1] || "";

		let currentPageType = detailData ? detailData.type : "";

		let fallingProps = {
			number : 3,
			imageArr : [
				"//img.ishanshan.com/gimg/ori/c0148c85443fc312c685e06cfc42713e",
				"//img.ishanshan.com/gimg/ori/89ed4731e52ede48aeaca35ecd40e33f",
				"//img.ishanshan.com/gimg/ori/de41d51ea36c2b67fbabbcf0f6162991",
				"//img.ishanshan.com/gimg/ori/a20557926beb8d56be15fb9d8f9530a2",
				"//img.ishanshan.com/gimg/ori/8a688778b9ec822b0de9242b0a39502b",
			],
			isCustomNumber : false,
		}

		return (
			<div>
				{/*<CommonFallingComponent {...fallingProps} />*/}
				{
					currentPageType == '' ? <ARCMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <ARCPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <ARCPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <ARCPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <ARCPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <ARCPage5RenderComponent detailData = { detailData } />

					: currentPageType == 'Page6Component' ? <ARCPage6RenderComponent detailData = { detailData } />

					: currentPageType == 'Page7Component' ? <ARCPage7RenderComponent detailData = { detailData } />

					: currentPageType == 'Page8Component' ? <ARCPage8RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
