import React from 'react';

let LabourPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design labour-page4-render-design">
				<div className="labour-page4-title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="labour-page4-content">
					{
						detailData.img_intro.map(function(value , index){
							return (
								<li className="labour-page4-content-item">
									<img className="labour-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[index].imgurl : ""} />
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
});

export default LabourPage4RenderComponent;
