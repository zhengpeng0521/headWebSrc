import React from 'react';

let ChristmasPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design page5-render-design">
				<div className="page5-title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="page5-content">
					{
						detailData.img_intro.map(function(value , index){
							return (
								<li className="page5-content-item">
									<img className="page5-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[index].imgurl : ""} />
								</li>
							)
						})
					}
				</ul>
				<div className="page5-content-value">
					{ detailData ? detailData.intro : "" }
				</div>
			</div>
		)
	}
});

export default ChristmasPage5RenderComponent;
