import React from 'react';
import { Form, Button, Input, Select, Icon ,Popconfirm} from 'antd';
import styles from './CoursewareRightTableSearch.less';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;
import ManagerList from '../../../common/new-component/manager-list/ManagerList';

function CoursewareRightTableSearch({
	RightOnSearch,
    onClear,
    RightTableReleaseCourseware, //发布课件
    expandSpace,//扩容
    rightTableSelectedRowKeys,
    RightTableOnDelete,
    RightTableOnEdit, //编辑
    useStorage ,  //已用空间
    totalStorage , //总容量
	search,
	courseGroup,		//课件分组
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
		RightOnSearch( values );
	}

	function onClearClick(){
		resetFields();
		onClear();
	}
    function cancel(){};

	return (
		<div className = 'search_wrap' >
            <ManagerList
                search = { search }
            />
			<Form layout = 'inline'>

                {/*
				<FormItem>
					{ getFieldDecorator( 'name', {
					})(
						<Input
							style = {{ width : '140px' }}
							placeholder = '课件名称'
							size = 'default'
							/>
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator( 'author', {
					})(
						<Input
							style = {{ width : '140px' }}
							placeholder = '作者'
							size = 'default'
							/>
					)}
				</FormItem>
				<FormItem>
					{ getFieldDecorator('type',{
					})(
						<Select
							style = {{ width : '140px' }}
							placeholder = '类型'
							size = 'default'
							showSearch = { true }
							optionFilterProp = 'children'
						>
							<Option key = '1' value = '1' >文档</Option>
						</Select>
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
                */}
                <div className = 'btn_group_mention'>
                    <span>已用/总容量：</span><span>{ useStorage +'G' }/{ totalStorage +'G' }</span>
                    <a onClick = { expandSpace } style={{paddingLeft:'15px'}}>扩容</a>
                </div>
			</Form>
            <div className = 'btn_group_public'>
                <p>
                    <span>已选：{ rightTableSelectedRowKeys.length }</span>

                    <Popconfirm placement = "top" title = '确认删除？' onConfirm = {RightTableOnDelete} okText = "是" cancelText = "否">
                        <a style={{paddingLeft:'5px'}}>删除</a>
                    </Popconfirm>
                    <a style={{paddingLeft:'5px'}} onClick = { ()=>RightTableOnEdit() }>编辑</a>
                </p>
                <Button size = 'default' type = 'primary' className = 'btn_group_courseware' onClick = { RightTableReleaseCourseware } >发布课件</Button>
				<Button size = 'default' type = 'primary' className = 'btn_group_courseware' style={{ marginRight: 20 }}
				onClick = { courseGroup } >课件分组</Button>
			</div>
		</div>
	)
}

export default Form.create({})(CoursewareRightTableSearch);
