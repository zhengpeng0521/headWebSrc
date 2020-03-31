import React from 'react';
import style from '../englishTwo_template.less';

let EnglishTwoPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className = "page-render-design english_two_page1_render">
				<div className = 'english_two_page1_wrap'>
					<div className = 'origin_content'>
						<div className = "english_two_head_img_wrap">
							<div className = { style.english_two_head_border1 } ></div>
							<div className = { style.english_two_head_border2 } ></div>
							<div className = { style.english_two_head_img } >
								<img src = { detailData ? detailData.head_imgUrl : "" } />
							</div>
						</div>
						<svg className = 'english_two_svg' height = "90px" width = "170px" version = "1.1" xmlns = "http://www.w3.org/2000/svg">
							<polygon points="0, 0 170, 90 0, 90" style={{ fill : '#a80909', fillOpacity : '0.8' }} />
						</svg>
						<div className = 'english_two_content'>
							<div className = "english_two_title">
								<p>
									{ detailData ? detailData.title : "" }
								</p>
							</div>
							<div className = "english_two_subTitle">
								<p>
									{ detailData ? detailData.sub_title : "" }
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

export default EnglishTwoPage1RenderComponent;
