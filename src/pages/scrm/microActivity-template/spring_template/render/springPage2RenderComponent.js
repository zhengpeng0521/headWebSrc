import React from 'react';

let SpringPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design spring-page2-render-design">
				<div className="spring-page2-title">{ detailData ? detailData.title : ""}</div>
				<div className="spring-page2-content">
						{
							detailData.intro.map(function(value , index){
								return (
									<div className="spring-page2-content-item">
										<div className="spring-page2-content-item-label">
											{detailData ? detailData.intro[index].label : ""}
										</div>
										<div className="spring-page2-content-item-value">
											{detailData ? detailData.intro[index].value : ""}
										</div>
									</div>
								)
							})
						}
				</div>
			</div>
		)
	}
});

export default SpringPage2RenderComponent;
