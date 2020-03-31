import React from 'react';
import Media from 'react-media';
import { Table, Icon, Form, Input, Select, DatePicker, Button, message, Pagination, Popconfirm ,Radio} from 'antd';
import TreeSelectCourseware from '../tree-select-courseware/TreeSelectCourseware';
import TreeSelectStructure from '../tree-select-structure/TreeSelectStructure';
import TreeSelectOrgDept from '../tree-select-org-dept/TreeSelectOrgDept';
import TreeSelectDeptName from '../tree-select-dept/TreeSelectDeptName';
import SubordinateFilter from '../../../../pages/common/subordinate-filter/SubordinateFilter';
import styles from './ManagerListSearch.less';
import UploadStudent from '../../../../pages/common/uploadStudent/UploadStudentPage';
import { debounce } from '../../../../utils/debounce'

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input

const { keys, values, entries } = Object;

function ManagerListSearch({
	search,
	leftBars,
	rightBars,
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
	let { onSearch, onClear, fields, wetherChear, noSearchBtn } = search || [];
	let { superSearch, isSuperSearch, isleftSuperSearch } = rightBars || [];

	let leftBarComponents = [];
	let rightBarComponents = [];
	//let groups=[];
	let searchComponents = [];

	function onSearchClick(){
		let values = getFieldsValue();
		let query = {};
		for( let [ key, value ] of entries( values ) ){
			if( value != undefined && value != '' ){
				query[ key ] = value;
			}
		}
		onSearch && onSearch( query, reset );
	}

	// change时查询列表
	function onSearchChange(current){
		let values = getFieldsValue();
		let query = {};
		for( let [ key, value ] of entries( values ) ){
			if( value != undefined && value != '' ){
				query[ key ] = value;
			}
		}
		query = {
			...query,
			...current
		}
		onSearch && onSearch( query, reset );
	}

    if(wetherChear){
        resetFields();
    }

	function reset(){
		resetFields();
	}

	function onClearClick(){
		resetFields();
		onClear && onClear({});
	}

	function superSearchClick(){
		superSearch && superSearch();
	}

	/** 针对input进行防抖动 */
	function inputChange(e, key) {
		onSearchChange({ [key]: e.target.value })
	}

	!!fields && fields.map((item,index) => {
		let type = item.type;
		let key = item.key;
		let placeholder = item.placeholder || '';
		let startPlaceholder = item.startPlaceholder || '';
		let endPlaceholder = item.endPlaceholder || '';
		let options = item.options;
		let opt_key = item.opt_key || 'key';
		let opt_label = item.opt_label || 'label';
		let initialValue = item.initialValue || undefined;
		let disabled = item.disabled || false;

		if( type == 'inputSearch' ){
			searchComponents.push(
				<FormItem
					key = { 'form_item_' + key }
				>
					{ getFieldDecorator( key, {
            initialValue : initialValue
					})(
						<Search
							size="default"
							placeholder={placeholder}
							onSearch={value => onSearchChange({[key]: value})}
							style={{ width: 150 }}
						/>
					)}
				</FormItem>
			)
		}else if( type == 'input' ){
			searchComponents.push(
				<FormItem
					key = { 'form_item_' + key }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<Input placeholder = { placeholder } size = 'default' style = {{ width : '140px' }} onChange={noSearchBtn && debounce((e) => inputChange(e, key), 1000)}/>
					)}
				</FormItem>
			)
		}else if( type == 'select' ){
			searchComponents.push(
				<FormItem
					key = { 'form_item_' + key }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<Select
							allowClear = { true }
							showSearch = { true }
							optionFilterProp = 'children'
							placeholder = { placeholder }
							style = {{ width : item.width || '140px' }}
							size = 'default'
							onSelect={(value, option) => item.onSelect && item.onSelect(value, option)}
							onChange={(value) => {onSearchChange({ [key]: value });item.changeHandle && item.changeHandle(value)}}
						>
							{ !!options && options.map( function( item, index ){
								return (
									<Option key = { 'select_opt_' + index } value = { item[ opt_key ] + '' } item={item} >{ item[ opt_label ] + '' }</Option>
								)
							})}
						</Select>
					)}
				</FormItem>
			)
		}else if( type == 'rangePicker' ){
			searchComponents.push(
				<FormItem
					key = { 'form_item' + key }
				>
					{ getFieldDecorator( key, {
                        initialValue : initialValue
					})(
						<RangePicker
							size = 'default'
							style = {{ width : item.width || 140 }}
							showTime = { item.showTime == false ? false : true }
							format = { item.format || 'YYYY-MM-DD HH:mm' }
							placeholder = {[ startPlaceholder, endPlaceholder ]}
							disabled={item.disabledKey ? (!!getFieldValue(item.disabledKey) && getFieldValue(item.disabledKey) != '') : false}
							onChange={(value) => onSearchChange({ [key]: value })}
						/>
					)}
				</FormItem>
			)
		}else if(type == 'courseware'){
            searchComponents.push(
                <FormItem key = { 'form_item_' + key }>
                    { getFieldDecorator(key, {
                        initialValue : initialValue
                    })(
                        <TreeSelectCourseware />
                    )}
                </FormItem>
			)
        }else if(type == 'structure'){
            searchComponents.push(
                <FormItem key = { 'form_item_' + key }>
                    { getFieldDecorator(key, {
                        initialValue : initialValue
                    })(
                        <TreeSelectStructure/>
                    )}
                </FormItem>
			)
        }else if(type == 'dept_org'){
            searchComponents.push(
                <FormItem key = { 'form_item_' + key }>
                    { getFieldDecorator(key, {
                        initialValue : initialValue
                    })(
                        <TreeSelectOrgDept {...options}/>
                    )}
                </FormItem>
			)
        }else if(type == 'dept_name') {
					searchComponents.push(
						<FormItem key = { 'form_item_' + key }>
								{ getFieldDecorator(key, {
										initialValue : initialValue
								})(
										<TreeSelectDeptName onChange={(value) => onSearchChange({ [key]: value })}/>
								)}
						</FormItem>
			)
				}
	})

	let UploadStudentProp = {

	}
	if (!!rightBars && !!rightBars.Changecolor  ){
        UploadStudentProp.Changecolor =  rightBars.Changecolor;
	}

	!!rightBars && !!rightBars.btns && rightBars.btns.map( function( item, index ){

    if (item.type && item.type == 'leadsrecord') {
			if ( item.isChecked) {
                rightBarComponents.push(
					<Button icon = { item.icon } key = { 'common_button_' + index +'Checked' } size = 'default' className = { styles.right_btn_leadsrecorditemChecked } onClick = { item.handle }>
                        { item.label || '' }
					</Button>
                )
			}else  {
                rightBarComponents.push(
					<Button icon = { item.icon } key = { 'common_button_' + index } size = 'default' className = { styles.right_btn_leadsrecorditem } onClick = { item.handle }>
                        { item.label || '' }
					</Button>
                )
			}

    }else if (item.type && item.type == 'sturecord'){
			if (item.isPickOn) {
                rightBarComponents.push(
					<Button icon = { item.icon } key = { 'common_button_' + index +'PickOn' } size = 'default' className = { styles.right_btn_sturecorditemPickOn } onClick = { item.handle }>
                        { item.label || '' }
					</Button>
                )
			}else  {
                rightBarComponents.push(
					<Button icon = { item.icon } key = { 'common_button_' + index } size = 'default' onClick = { item.handle }>
                        { item.label || '' }
					</Button>
                )
			}
		}else if(item.type && item.type == 'tmkOwnSea') {
			rightBarComponents.push(
				<Popconfirm placement={item.placement} key = { 'common_pop_' + index + 'tmkOwnSea' } title={item.content} onConfirm={item.handle} okText="确定" cancelText="取消">
					<Button icon = { item.icon } key = { 'common_button_' + index + 'tmkOwnSea' } size = 'default'>
						{ item.label || '' }
						</Button>
		 		</Popconfirm>
      		)
		}else {
            rightBarComponents.push(
				<Button icon = { item.icon } key = { 'common_button_' + index } size = 'default' className = { styles.right_btn_item } onClick = { item.handle }>
                    { item.label || '' }
				</Button>
            )
		}

	})

	!!leftBars && !!leftBars.btns && !!leftBars.btns.map( function( item, index ){
		if( item.confirm ){
			leftBarComponents.push(
				<div key={ 'handle_btn_item_' + index } className = { styles.handle_btn_item } >
					<Popconfirm placement = "top" title = { '确定要' + item.label + '吗?' } okText = "确定" cancelText = "取消" onConfirm = { item.handle } >
						<a className = { styles.handle_text_btn } href = "javascript:void(0);">{ item.label }</a>
					</Popconfirm>
				</div>
			)
		}else{
			leftBarComponents.push(
				<div key={ 'handle_btn_item_' + index } className = { styles.handle_btn_item } >
					<a onClick = { item.handle } className = { styles.handle_text_btn } href = "javascript:void(0);">{ item.label }</a>
				</div>
			)
		}
	})

	return (
		<div className = 'manager_list_search_box'>
			<div className = { !!leftBars && leftBars.labelNum ? styles.batch_operation : styles.batch_operation_hiden } >
				{ !!leftBars && !!leftBars.label && <span className = { styles.has_selected }>{ leftBars.label + '(' + leftBars.labelNum + ')'}</span> }
				{ leftBarComponents }
			</div>
			<Form layout = 'inline' className = { styles.search_item } >
				{ !!search && !!search.subordinate &&
					<div className = 'search_item_subordinate' >
						<SubordinateFilter onChange = { search.subordinateChange } />
					</div>
				}
				{ searchComponents }

				<div className = { styles.right_operation }>

                    {!!rightBars && !!rightBars.isShowUpload && <UploadStudent {...UploadStudentProp } />

					}

					{ rightBars && rightBars.render }

                    { rightBarComponents }


					{ !!rightBars && !!rightBars.isSuperSearch &&
						<Button style = {{ marginLeft : '20px' }} size = 'default' type = 'primary' className = { styles.super_search } onClick = { superSearchClick } >
							{ !!rightBars.superSearchVisible ? '关闭' : '高级搜索' }
						</Button>
					}
				</div>
			</Form>
			{ !!search && !!search.onSearch && !!search.onClear &&
				<div className = 'btn_group'>
					{
						search.noSearchBtn ?
							null
						:
						<Button size = 'default' type = 'primary' className = 'btn_group_search' onClick = { onSearchClick } >
							<div className = 'search_icon'></div>
						</Button>
					}

					<Button size = 'default' className = 'btn_group_clear' onClick = { onClearClick } >
						<div className = 'reset_icon' ></div>
					</Button>
					{ !!rightBars && !!rightBars.isleftSuperSearch &&
						<Button style = {{ marginLeft : '10px' }} size = 'default' type = 'primary' className = { styles.super_search } onClick = { superSearchClick } >
							{ !!rightBars.superSearchVisible ? '关闭' : '高级搜索' }
						</Button>
					}
				</div>
			}

		</div>
	)
}

export default Form.create({})(ManagerListSearch);
