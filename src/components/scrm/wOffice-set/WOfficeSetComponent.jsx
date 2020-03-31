import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { Button, Modal, Form, Icon } from 'antd';
import WOfficeSetRenderComponent      from './WOfficeSetRenderComponent';
import WOfficeSetDisplayItemComponent from './WOfficeSetDisplayItemComponent';
import style from './WOfficeSetComponent.less';

function WOfficeSetComponent({

    dataSource,
	selectedRows,
	selectedRowKeys,

    jumpToOrgManage,

	rowSelectChange,
	showItem,
	hideItem,
	editItem,

}){

	//表单布局
	let formItemLayout = {
		labelCol   : { span : 20 },
		wrapperCol : { span : 4 }
	};

    let wOfficeRenderParams = {
		dataSource
    }

	let wOfficeSetDisplayItemComponentProps = {
		dataSource,
		selectedRows,
		selectedRowKeys,

		rowSelectChange,
		showItem,
		hideItem,
		editItem,

	};
//	<div style = {{ display : 'inline-block', fontSize : '14px'}}>
//		如果需要修改主页显示项内容,
//		<a onClick = { jumpToOrgManage } > 请点击这里</a>
//	</div>
	return (
        <div className = { style.wOffice_page }>
			<div className = { style.wOffice_page_title }>
				<div className = { style.wOffice_page_title_left }>
					<span></span>
					预览
				</div>
				<div className = { style.wOffice_page_title_right }>
					<span></span>
					<div style = {{ display : 'inline-block' }}>
						显示项设置
					</div>
				</div>
			</div>
            <WOfficeSetRenderComponent      { ...wOfficeRenderParams } />
			<WOfficeSetDisplayItemComponent { ...wOfficeSetDisplayItemComponentProps } />
        </div>
	)
}

export default WOfficeSetComponent;
