import React from 'react';

let NewYearPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design newYear-page1-render-design">
				<div className = "newYear-page1-image">
					<img src={ detailData  ? detailData.imgUrl : ""} />
				</div>
				<div className = "newYear-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "newYear-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
			</div>
		)
	}
});

export default NewYearPage1RenderComponent;
