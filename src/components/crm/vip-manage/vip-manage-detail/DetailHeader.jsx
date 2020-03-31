import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon , Popover , Button } from 'antd';
import styles from './DetailHeader.less';

function DetailHeader({
	closeDetail,
    OpenTransCourseModal,       //打开转课modal
}){

    return (
        <div className = { styles.header_wrap }>
            <div className = { styles.header_left }>
                <img src = 'https://img.ishanshan.com/gimg/img/1b07ee66ebedfbc138fdcb135c9559a0'/>
                <div className = { styles.detail_title }>会员卡</div>
            </div>
			<div className = { styles.header_right }>
                <Button type = 'primary' onClick = { OpenTransCourseModal } style = {{ width : 60 }}>转课</Button>
				<Icon onClick = { closeDetail } style = {{ fontSize : '16px' , cursor : 'pointer' }} type = { 'close' } />
			</div>
		</div>
    )
};

export default DetailHeader;
