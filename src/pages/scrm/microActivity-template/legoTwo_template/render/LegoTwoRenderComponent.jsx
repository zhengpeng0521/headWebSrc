import React from 'react';

//引入渲染页面模板
let LegoTwoMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let LegoTwoPage1RenderComponent = require('./LegoTwoPage1RenderComponent');
let LegoTwoPage2RenderComponent = require('./LegoTwoPage2RenderComponent');
let LegoTwoPage3RenderComponent = require('./LegoTwoPage3RenderComponent');
let LegoTwoPage4RenderComponent = require('./LegoTwoPage4RenderComponent');
let LegoTwoPage5RenderComponent = require('./LegoTwoPage5RenderComponent');

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

		return (
			<div>
				{
					currentPageType == '' ? <LegoTwoMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <LegoTwoPage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <LegoTwoPage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <LegoTwoPage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <LegoTwoPage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <LegoTwoPage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
