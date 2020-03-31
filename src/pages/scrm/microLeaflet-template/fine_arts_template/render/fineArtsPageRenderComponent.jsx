import React from 'react';
import styles from '../fine_arts_template.less';

let FineArtsPageRenderComponent = React.createClass({

	render(){
		let { detailData } = this.props;

		function segmentationText(text) {
			let tempArr = [];
			for(let i = 0; i < Object(text).length; i++) {
				tempArr.push(Object(text)[i]);
			}
			return tempArr;
		}

		let page2TitleArr = segmentationText(detailData.p2Title || '');
		let page3TitleArr = segmentationText(detailData.p3Title || '');
		let page4TitleArr = segmentationText(detailData.p4Title || '');
		let page5TitleArr = segmentationText(detailData.p5Title || '');
		let page6TitleArr = segmentationText(detailData.p6Title || '');
		let page7TitleArr = segmentationText(detailData.p7Title || '');

		let p2Content = detailData.p2Content&&detailData.p2Content.length > 0 ? detailData.p2Content.split('\n') : '';
		let p4Content = detailData.p4Content&&detailData.p4Content.length > 0 ? detailData.p4Content.split('\n') : '';
		let p7Content = detailData.p7Content&&detailData.p7Content.length > 0 ? detailData.p7Content.split('\n') : '';

		let hudie = (
			<animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
				<mpath xlinkHref="#path1"/>
			</animateMotion>
		)

		return (
			<div className = 'fine_arts'>
				<div className={styles.page1_bg}>
					<div className={styles.page1_caihong}></div>
					<div className={styles.page1_yunduo}></div>
					<div className={styles.page1_gril1}></div>
					<div className={styles.page1_title_kuang}></div>
					<div className={styles.page1_title}>{detailData.p1Title || ''}</div>
					<div className={styles.page1_sub_title}>{detailData.p1SubTitle || ''}</div>

					<div className={styles.page1_header_kuang}>
						<img src={detailData.p1HeadImgUrl} className={styles.page1_header_image}/>
					</div>
					<div className={styles.page1_org_name}>{detailData.p1OrgName || ''}</div>
					<div className={styles.page1_huaban}></div>
					<div className={styles.page1_huaban_content}></div>
					<div className={styles.page1_gril2}></div>
					<div className={styles.page1_bi}></div>
					<div className={styles.page1_svg_huaban}>
						<svg
							width="100%"
							height="100%"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
						>
							<path id="path1" d="M-0.000,191.000 C-0.000,191.000 175.820,-23.664 328.000,13.000 C480.180,49.664 437.336,85.047 590.000,35.000 C742.664,-15.047 772.320,-4.281 826.000,28.000" fill="none" stroke="none" strokeWidth="0"  />

							<path fill="#5EC8EF" d="M99.3,99.8c0,0,13.3-15.6,1.8-21c-16.7,4.3-21.3,9.4-22.8,15.7c-2-1.8-10.6,5.7,2.5,10.8
						C95.5,101.9,94.9,103.1,99.3,99.8z" style={{transform: 'scale(0.5)'}}>
								{hudie}
							</path>
							<path fill="#5EC8EF" d="M102.2,104.3c0,0,20.6,6.1,15.3,15.8c-7.3,3.7-23.3,1.1-28.7-4.4c-3.9,2.4-11.3,2.7-7.2-8.4
								C88.8,108.1,97,106.9,102.2,104.3z" style={{transform: 'scale(0.5)'}}>
								{hudie}
							</path>
							<path fill="#41237A" d="M100.6,100.9c0,0,8.3-3.5,4.9,0c-3.4,3.5-18.9,8.4-23,5.4C83,106.2,100.6,100.9,100.6,100.9z" style={{transform: 'scale(0.5)'}}>
								{hudie}
							</path>
							<path fill="none" stroke="#41237A" strokeMiterlimit="10" d="M108,99.9c0,0,12.4-5.5,14.7-14" style={{transform: 'scale(0.5)'}}>
								{hudie}
							</path>
							<path fill="none" stroke="#41237A" strokeMiterlimit="10" d="M106.3,102.4c0,0,11.9-0.4,20-11.2" style={{transform: 'scale(0.5)'}}>
								{hudie}
							</path>
						</svg>
					</div>
					<div className={styles.page1_flower}></div>
					<div className={styles.general_kongbai}></div>
				</div>
				<div className={styles.page2_title_base_div}>
					{
						page2TitleArr&&page2TitleArr.map((item, index) => {
							return  <div key={index} className={styles.page2_title_div}>
										{item}
									</div>
						})
					}
				</div>

				<div className={styles.paag2_white_bg}></div>
				<div className={styles.page2_bg}>
					<div className={styles.page2_content}>
						{
							p2Content&&p2Content.map((item, index) => {
								return <p className={styles.text}>{item}</p>
							})
						}
					</div>
					<div className={styles.page2_image1}></div>
					<div className={styles.page2_image2}></div>
				</div>

				<div className={styles.page3_bg}>
					<div className={styles.page3_title_base_div}>
						{
							page3TitleArr&&page3TitleArr.map((item, index) => {
								return  <div key={index} className={styles.page3_title_div}>
											{item}
										</div>
							})
						}
					</div>
					{
						detailData.p3Content&&detailData.p3Content.map((item, index) => {
							let sty = (index == 2 || index == 3 || index == 6 || index == 7) ? styles.page3_cover_div2 : styles.page3_cover_div1;
							let url = `url(${item.imgurl})`;
							if(item.imgurl != undefined && item.imgurl.length > 0) {
								return  <div key={index}>
											{index == 4 ? <div className={styles.page3_image}></div> : ''}
											<div className={styles.page3_row}>
												<div className={sty}>
													<div className={styles.page3_cover} key={index} style={{backgroundImage : url}}></div>
												</div>
											</div>
										</div>
							}
						})
					}
				</div>

				<div className={styles.page4_bg}>
					<div className={styles.page4_title_base_div}>
						{
							page4TitleArr&&page4TitleArr.map((item, index) => {
								return  <div key={index} className={styles.page4_title_div}>
											{item}
										</div>
							})
						}
					</div>

					<div className={styles.page4_content}>
						{
							p4Content&&p4Content.map((item, index) => {
								return <p className={styles.text}>{item}</p>
							})
						}
					</div>
					<div className={styles.page4_image}></div>
				</div>

				<div className={styles.page5_bg}>
					<div className={styles.page5_title_base_div}>
						{
							page5TitleArr&&page5TitleArr.map((item, index) => {
								return  <div key={index} className={styles.page5_title_div}>
											{item}
										</div>
							})
						}
					</div>
					{
						detailData.p5Content&&detailData.p5Content.map((item, index) => {
							let url = `url(${item.imgurl})`;
							return <div key={index}>
										<div className={styles.page5_cover_div}>
											<div className={styles.page5_cover} key={index}
												style={{backgroundImage : url}}
											>
											</div>
										</div>
									</div>
						})
					}
				<div className={styles.page5_image1}></div>
				<div className={styles.page5_image2}></div>
				</div>


				<div className={styles.page6_bg}>
					<div className={styles.page6_title_base_div}>
						{
							page6TitleArr&&page6TitleArr.map((item, index) => {
								return  <div key={index} className={styles.page6_title_div}>
											{item}
										</div>
							})
						}
					</div>

					<div className={styles.input}>学员姓名</div>
					<div className={styles.input}>学员生日</div>
					<div className={styles.input}>联系方式</div>
					<div className={styles.input_submit}><p className={styles.submit}>提 交</p></div>
					<div className={styles.page6_image1}></div>
					<div className={styles.page6_image2}></div>
					<div className={styles.page6_image3}></div>
				</div>


				<div className={styles.page7_bg}>
					<div className={styles.page7_title_base_div}>
						{
							page7TitleArr&&page7TitleArr.map((item, index) => {
								return  <div key={index} className={styles.page7_title_div}>
											{item}
										</div>
							})
						}
					</div>
					<div className={styles.page7_image1}></div>
					<div className={styles.page7_image2}>
						<img src={detailData.p7CodeImgUrl} className={styles.qr_code} />
						<div className={styles.remack}>{detailData.p7Remark || '扫码关注我们'}</div>
					</div>
					<div className={styles.page7_image3}></div>
					<div className={styles.page7_content_text_item_div}>
						{
							p7Content&&p7Content.map((item, index) => {
								return <p className={styles.page7_content_text_item}>{item}</p>
							})
						}
					</div>
				</div>
			</div>
		)
	}
});

export default FineArtsPageRenderComponent;
