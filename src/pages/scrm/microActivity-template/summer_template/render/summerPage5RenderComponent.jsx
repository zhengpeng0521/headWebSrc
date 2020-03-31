import React from 'react';
import style from '../summer_template.less';

let SummerPage5RenderComponent = React.createClass({

	render(){

		let { detailData } = this.props;

		return (
			<div className="page-render-design summer-page5-render">
				<div className = 'summer_wrap'>

				</div>
				<div className="summer_title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="summer_content">
					{
						detailData.img_intro.map( function(value , index){
							return (
								<li className="summer_content_item">
									<div>
										<img src={ ( detailData && detailData.img_intro ) ? detailData.img_intro[index].imgurl : ""} />
									</div>
								</li>
							)
						})
					}
				</ul>
				<div className = { style.page5_person } ></div>
			</div>
		)
	}
});

export default SummerPage5RenderComponent;
