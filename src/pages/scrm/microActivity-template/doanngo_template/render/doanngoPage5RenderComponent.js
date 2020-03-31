import React from 'react';

let DoanngoPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design doanngo-page5-render-design">
				<div className="doanngo-page5-title">{ detailData ? detailData.title : ""}</div>
			</div>
		)
	}
});

export default DoanngoPage5RenderComponent;
