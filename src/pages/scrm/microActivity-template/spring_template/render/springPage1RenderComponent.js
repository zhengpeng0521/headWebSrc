import React from 'react';

let SpringPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design spring-page1-render-design">
				<div className = "spring-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "spring-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
			</div>
		)
	}
});

export default SpringPage1RenderComponent;
