import React from 'react';

let FathersDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design fathersDay-page5-render-design">
				<div className = "fathersDay-title">{ detailData ? detailData.title : ""}</div>
				<p className = "name">学员姓名</p>
				<p className = "phone">手机号码</p>
				<p className = "birthday">学员生日</p>
				<p className = 'btn' >提交</p>
			</div>
		)
	}
});

export default FathersDayPage5RenderComponent;
