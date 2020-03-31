import React from 'react';

let YuanxiaoPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design yuanxiao-page1-render-design">
				<div className = "yuanxiao-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
			</div>
		)
	}
});

export default YuanxiaoPage1RenderComponent;
