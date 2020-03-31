import React from 'react';
import { Form, Button, Input, Select, Icon } from 'antd';
import TreeSelectOrgDept from '../../common/new-component/tree-select-org-dept/TreeSelectOrgDept';
import styles from './FollowRecordSearch.less';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

function FollowRecordSearch({
	searchVisible,
	source,

	/*方法*/
	clickToLeaders,
	clickToStudent,
	createFollowRecord,
	showSuperSearch,

	exportFollowRecord,       //导出

	onSearch,
	onClear,

	form : {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}){
	function onSearchClick(){
		let values = getFieldsValue();
		onSearch( values );
	}

	function onClearClick(){
		resetFields();
		onClear();
	}
	function clickToLeadersClick(){
		resetFields();
		clickToLeaders();
	}

	function clickToStudentClick(){
		resetFields();
		clickToStudent();
	}

	return (
		<div className = 'card_search_wrap' >
			<Form layout = 'inline' className = { styles.follow_up_search }>
				<FormItem>
					{ getFieldDecorator( 'dept_org', {

					})(
						<TreeSelectOrgDept />
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator( 'name', {

					})(
						<Input
							style = {{ width : '140px' }}
							placeholder = '输入姓名'
							size = 'default'
							/>
					)}
				</FormItem>
				<div className = 'btn_group' style = {{ margin : '0' }}>
					<Button size = 'default' type = 'primary' className = 'btn_group_search' onClick = { onSearchClick } >
						<div className = 'search_icon'></div>
					</Button>
					<Button size = 'default' className = 'btn_group_clear' onClick = { onClearClick } >
						<div className = 'reset_icon' ></div>
					</Button>
				</div>
			</Form>
			<div className = 'card_right_operation'>
				{/* <ButtonGroup>
					<Button type = { source == '2' ? 'primary' : '' } onClick = { clickToLeadersClick } style = {{ padding : '0 12px' }} >名单记录</Button>
				    <Button type = { source == '1' ? 'primary' : '' } onClick = { clickToStudentClick } style = {{ padding : '0 12px' }} >学员记录</Button>
    			</ButtonGroup> */}
                {/*<Button
					className = { styles.right_btn_item }
					style = {{ marginLeft : '20px' }}
					onClick = { exportFollowRecord } >
					导出
				</Button>*/}
				<Button
					type = 'primary'
					style = {{ marginLeft : '20px' }}
					onClick = { showSuperSearch }
				>
					{ !!searchVisible ? '关闭' : '高级搜索' }
				</Button>
			</div>
		</div>
	)
}

export default Form.create({})(FollowRecordSearch);
