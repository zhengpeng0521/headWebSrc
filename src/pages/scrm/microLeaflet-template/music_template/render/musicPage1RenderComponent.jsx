import React from 'react';
import style from '../music_template.less';

let MusicPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = "page-render-design music_page1_render">
				<div className = { style.music_page1_wrap } >
					<div className = { style.page1_border }>
						<div className = { style.page1_person1 }></div>
						<div className = { style.page1_person2 }></div>
						<div className = { style.page1_person3 }></div>
						<div className = { style.page1_person4 }></div>
						<div className = { style.total_content } >
							<p>
								<div className = { style.org_name } >
									{ !!detailData && detailData.title || '' }
								</div>
								<div className = { style.page1_title1 } >
									{ !!detailData && detailData.sub_title || '' }
								</div>
								<div className = { style.page1_content } >
									{ !!detailData && detailData.content.length > 0 &&
										detailData.content.map( (item, index) => {
											return (
													<div className = { style.content_item } >
														{ item || '' }
													</div>)
										})
									}
								</div>
							</p>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage1RenderComponent;
