import React from 'react';

let OrganGeneralPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design organGeneral-page3-render-design">
				<div className="organGeneral-page3-title">{ detailData ? detailData.title : ""}</div>
				<p className="organGeneral-page3-name">学员姓名</p>
				<p className="organGeneral-page3-phone">联系电话</p>
			</div>
		)
	}
});

export default OrganGeneralPage3RenderComponent;
