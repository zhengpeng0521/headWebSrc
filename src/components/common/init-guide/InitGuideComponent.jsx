import React from 'react';
import styles from './InitGuideComponent.less';
import { Modal, Button, Popover } from 'antd';

function InitGuideComponent({
	stepNum,
	visible,

	clickToNextStep,      //点击到下一步

}){
	let arr = Array.from({ length : 4 });

    return (
		<div>
			{ visible ?
				<div className = { styles.guide_wrap } >
					{ stepNum == 1 ?
						<div className = { styles.guide_one } >
							<div className = { styles.guide_one_btn } onClick = { clickToNextStep } >
								下一步
							</div>
						</div>
						: stepNum == 2 ?
						<div className = { styles.guide_two } >
							<div className = { styles.guide_two_btn } onClick = { clickToNextStep } >
								下一步
							</div>
						</div>
						: stepNum == 3 ?
						<div className = { styles.guide_three } >
							<div className = { styles.guide_three_btn } onClick = { clickToNextStep } >
								下一步
							</div>
						</div>
						: stepNum == 4 ?
						<div className = { styles.guide_four } >
							<div className = { styles.guide_four_btn } onClick = { clickToNextStep } >
								立即体验
							</div>
						</div> : null
					}
					<ul className = { styles.guide_tip } >
						{
							arr.map(function( item, index ){
								if( index + 1 == stepNum ){
									return ( <li key = { 'guide_tip_item_' + index } className = { styles.guide_tip_item_select } >{ index + 1 }</li> )
								}else{
									return ( <li key = { 'guide_tip_item_' + index } className = { styles.guide_tip_item } >{ index + 1 }</li> )
								}
							})
						}
					</ul>
				</div> : null
			}
		</div>
    );
}


export default InitGuideComponent;
