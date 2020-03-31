import React from 'react';

let YuanxiaoPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design yuanxiao-page2-render-design">
				<div className="yuanxiao-page2-title">{ detailData ? detailData.title : ""}</div>
				<div className="yuanxiao-page2-content">
					<div className="yuanxiao-page2-sub-title">
						{detailData ? detailData.sub_title : ""}
					</div>
					<div className="yuanxiao-page2-content-total">
						{
							detailData.intro.map(function(value , index){
								return (
									<div className="yuanxiao-page2-content-item">
										<div className="yuanxiao-page2-content-item-label">
											{detailData ? detailData.intro[index].label : ""}
										</div>
										<div className="yuanxiao-page2-content-item-value">
											{detailData ? detailData.intro[index].value : ""}
										</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
});

export default YuanxiaoPage2RenderComponent;
