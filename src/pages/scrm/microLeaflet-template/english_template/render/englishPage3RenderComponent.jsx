import React from 'react';

let EnglishPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design english-page3-render-design">
				<div className="english-page3-title">{ detailData ? detailData.title : ""}</div>
				<p className="english-page3-name">学员姓名</p>
				<p className="english-page3-phone">联系电话</p>
			</div>
		)
	}
});

export default EnglishPage3RenderComponent;
