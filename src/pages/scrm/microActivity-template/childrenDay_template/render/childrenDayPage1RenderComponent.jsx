import React from 'react';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design childrenDay-page1-render-design">
				<div className = "childrenDay-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
