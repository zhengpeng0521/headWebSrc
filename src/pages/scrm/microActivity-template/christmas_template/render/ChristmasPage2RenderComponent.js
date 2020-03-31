import React from 'react';

let ChristmasPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design page2-render-design">
				<div className="page2-title">{ detailData ? detailData.title : ""}</div>
				<div className="page2-content">
					<div className="page2-sub-title">
						{detailData ? detailData.sub_title : ""}
					</div>
					<div className="page2-content-total">
						{
							detailData.intro.map(function(value , index){
								return (
									<div className="page2-content-item">
										<div className="page2-content-item-label">
											{detailData ? detailData.intro[index].label : ""}
										</div>
										<div className="page2-content-item-value">
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

export default ChristmasPage2RenderComponent;
