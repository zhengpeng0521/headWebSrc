import React from 'react';

let YuanxiaoPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design yuanxiao-page5-render-design">
				<div className="yuanxiao-page5-title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="yuanxiao-page5-content">
					{
						detailData.img_intro.map(function(value , index){
							return (
								<li className="yuanxiao-page5-content-item">
									<img className="yuanxiao-page5-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[index].imgurl : ""} />
								</li>
							)
						})
					}
				</ul>
				<div className="yuanxiao-page5-content-value">
					{ detailData ? detailData.intro : "" }
				</div>
			</div>
		)
	}
});

export default YuanxiaoPage5RenderComponent;
