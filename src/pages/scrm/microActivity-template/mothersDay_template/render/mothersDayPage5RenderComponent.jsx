import React from 'react';

let MothersDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design mothersDay-page5-render-design">
				<div className = "mothersDay-page5-title">{ detailData ? detailData.title : ""}</div>
				<p className = "mothersDay-page5-name">学员姓名</p>
				<p className = "mothersDay-page5-phone">手机号码</p>
				<p className = "mothersDay-page5-birthday">学员生日</p>
				<p className = 'mothersDay-page5-btn' >提交</p>
			</div>
		)
	}
});

export default MothersDayPage5RenderComponent;
