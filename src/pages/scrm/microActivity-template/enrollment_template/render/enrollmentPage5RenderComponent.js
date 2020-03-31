import React from 'react';

let EnrollmentPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design enrollment-page5-render-design">
				<div className="enrollment-page5-title">{ detailData ? detailData.title : ""}</div>
				<p className="enrollment-page5-name">学员姓名</p>
				<p className="enrollment-page5-phone">联系电话</p>
				<div className="enrollment-page5-submit-button">提交</div>
			</div>
		)
	}
});

export default EnrollmentPage5RenderComponent;
