import React from 'react';

let FathersDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design fathersDay-page1-render-design">
				<div className = "image">
					<img src={ detailData ? detailData.imgUrl : ""} />
				</div>
				<div className = "fathersDay_title" >
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "fathersDay_subTitle" >
					<div>
						{ detailData ? detailData.sub_title : "" }
					</div>
				</div>
			</div>
		)
	}
});

export default FathersDayPage1RenderComponent;
