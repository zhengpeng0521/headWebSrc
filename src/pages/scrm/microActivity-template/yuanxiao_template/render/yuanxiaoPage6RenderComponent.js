import React from 'react';

let YuanxiaoPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design yuanxiao-page6-render-design">
				<div className="yuanxiao-page6-title">{ detailData ? detailData.title : ""}</div>
				<p className="yuanxiao-page6-name">学员姓名</p>
				<p className="yuanxiao-page6-phone">联系电话</p>
			</div>
		)
	}
});

export default YuanxiaoPage6RenderComponent;
