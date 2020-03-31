import React from 'react';

let ChristmasPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="page-render-design page1-render-design">
				<div className="page1-title">
					{ detailData ? detailData.title : "" }
				</div>
			</div>
		)
	}
});

export default ChristmasPage1RenderComponent;
