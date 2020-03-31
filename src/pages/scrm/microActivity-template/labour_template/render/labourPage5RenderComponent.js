import React from 'react';

let LabourPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design labour-page5-render-design">
				<div className="labour-page5-title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="labour-page5-content">
					{
						detailData.img_intro.map(function(value , index){
							return (
								<li className="labour-page5-content-item">
									<img className="labour-page5-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[index].imgurl : ""} />
								</li>
							)
						})
					}
				</ul>
				<div className="labour-page5-content-value">
					{ detailData ? detailData.intro : "" }
				</div>
			</div>
		)
	}
});

export default LabourPage5RenderComponent;
