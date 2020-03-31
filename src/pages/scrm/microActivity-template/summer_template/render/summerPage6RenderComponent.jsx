import React from 'react';
import style from '../summer_template.less';

let SummerPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},

	render(){
		let { detailData } = this.props;
		let contentArr1 = detailData && detailData.intro.split('\n');
		return (
			<div className = "page-render-design summer-page6-render">
				<div className = "summer_title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "summer_content" >
					<div className = 'content'>
						{
							contentArr1.map( function( item, index){
								return (
									<div className = "item">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
									</div>
								)
							})
						}
					</div>
				</div>
				<div className = 'summer_title title2'>
					{ detailData ? detailData.title2 : '' }
				</div>
				<div className = "summer_content_item2 summer_content_item">
					<img src={ ( detailData && detailData.img_intro ) ? detailData.img_intro[1].imgurl : ""} />
				</div>
				<div className = "summer_content_item1 summer_content_item">
					<img src={ ( detailData && detailData.img_intro ) ? detailData.img_intro[0].imgurl : ""} />
				</div>
				<div className = { style.qianshui } ></div>
			</div>
		)
	}
});

export default SummerPage5RenderComponent;
