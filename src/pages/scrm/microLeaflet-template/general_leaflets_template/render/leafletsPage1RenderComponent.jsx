import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className = "page-render-design leaflets_page1_render">
				<img className={styles.page1_header} src={detailData.head_imgUrl || ''} />
				<div className={styles.page1_image_deng_l}></div>
				<div className={styles.page1_image_deng_r}></div>
				<div className={styles.page1_image_student_table_l}></div>
				<div className={styles.page1_image_student_table_r}></div>
				<div className={styles.page1_image_teacher_table}></div>
				<div className={styles.page1_image_teacher}></div>
				<div className={styles.page1_image_pencil}></div>
				<div className={styles.page1_image_kuang}>
					<div className={styles.page1_title}>
						{detailData.sub_title || ''}
					</div>
					<div className={styles.page1_sub_title}>
						{detailData.title || ''}
					</div>
				</div>

			</div>
		)
	}
});

export default LeafletsPage1RenderComponent;
