import React from 'react';

//引入渲染页面模板
let LegoOneMainRenderComponent = require('../../general_template/generalMainRenderComponent');
let LegoOnePage1RenderComponent = require('./LegoOnePage1RenderComponent');
let LegoOnePage2RenderComponent = require('./LegoOnePage2RenderComponent');
let LegoOnePage3RenderComponent = require('./LegoOnePage3RenderComponent');
let LegoOnePage4RenderComponent = require('./LegoOnePage4RenderComponent');
let LegoOnePage5RenderComponent = require('./LegoOnePage5RenderComponent');

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
					currentPageType == '' ? <LegoOneMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <LegoOnePage1RenderComponent detailData = { detailData } />

					: currentPageType == 'Page2Component' ? <LegoOnePage2RenderComponent detailData = { detailData } />

					: currentPageType == 'Page3Component' ? <LegoOnePage3RenderComponent detailData = { detailData } />

					: currentPageType == 'Page4Component' ? <LegoOnePage4RenderComponent detailData = { detailData } />

					: currentPageType == 'Page5Component' ? <LegoOnePage5RenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default ChildrenDayRenderComponent;
