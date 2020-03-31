import React from 'react';

let DoanngoPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design doanngo-page1-render-design">
				<div className = "doanngo-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "doanngo-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
			</div>
		)
	}
});

export default DoanngoPage1RenderComponent;
