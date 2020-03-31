import React from 'react';
import QueueAnim from 'rc-queue-anim';
import style from './StuMdoalCreat.less';
import { Button, Modal, Form, Input, Select, Upload, Icon, Radio, DatePicker, Row, Col, message, Cascader, Checkbox } from 'antd';
import { BlockTitle } from '../../common/new-component/NewComponent';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import PageModal from '../../common/page-modal/PageModal';
import { JusConstellation } from '../../../utils/dateFormat';
import moment from 'moment';
let FormItem   = Form.Item;
let Option     = Select.Option;
let RadioGroup = Radio.Group;

function StudentManageCreateForm({
    createStudentModalVisible,
    confirmCreateForm,
    cancelCreateForm,

    createOrgId,                 //默认选择的校区Id
    createOrgName,               //默认选择的校区名字

    //选择器下拉列表
    createSellerList,            //学员负责人

    edtionStuinfro,              //所要编辑的学员信息
	isShowMore,                  //是否显示更多

    studentTypeList,             //学员类型
    saleStatusList,              //跟进状态列表
    sourceList,                  //来源下拉框
    checkStudentStatus,


    TenantSelectOnSelect,

    checkStudentVisible,         //学员查重框
    checkStudentList,            //学员列表
    checkName,

    secondChannelList,           //二级来源
    recommenderList,             //推荐人   家长下拉列表
    collecterIdList,             //收集人

	showMoreStuInfo,             //显示更多学员信息
	parentRelationList,          //家长关系

	stuModalCreateBtnLoading,

	checkStuNameAndPhone,

    form : {
        getFieldDecorator,
        validateFieldsAndScroll,
        validateFields,
        getFieldsValue,
        getFieldValue,
        getFieldError,
        setFieldsValue,
        resetFields,
    }
}){

    function checkStudentStatusAction( orgId, name ){

        let neworgId =orgId + '';

        if( neworgId == '' || neworgId == null || neworgId == undefined || /^[\s]*$/.test(neworgId) || name == '' || name == undefined || name == null || /^[\s]*$/.test(name)){
            message.warn( '请选择校区并输入姓名，请检查有无遗漏' );
        }else {
            checkStudentStatus( neworgId,name );
        }
    }
    //改变校区是清空所选跟进人
    function TenantSelectOnSelectAction( value ){
        setFieldsValue({ 'seller'         : undefined });
		setFieldsValue({ 'parentId'       : undefined });
		setFieldsValue({ 'counselorId'    : undefined });
		setFieldsValue({ 'collecterId'    : undefined });
		setFieldsValue({ 'recommender'    : undefined });
        if( !!value ){
            TenantSelectOnSelect( value );
        }
    };
    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 270,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!edtionStuinfro.orgId
    };

    let formItemLayout = {
        labelCol : { span : 5 },
        wrapperCol : { span : 16 }
    };

    function normFile( e ) {
        if( Array.isArray( e ) ){
            return e;
        }
        return e && e.fileList;
    };

    function imgMaxSize( file , fileList , size , title){
        let fileSize = file.size;
        if ( fileSize > 1048576 * size ){
            message.error( title + '大小不能超过' + size + 'M')
            return false;
        }
    };

    let uploadButton = (
        <div>
            <Icon type = 'plus' />
            <div className = { style.upload_picture_btn } >选择图片</div>
        </div>
    );

    //学员头像
    let initStudentImg = [];
    if( edtionStuinfro && edtionStuinfro.headimgurl &&  edtionStuinfro.headimgurl.length > 0){
        initStudentImg.push({
            uid    : -1,
            url    :  edtionStuinfro.headimgurl,
            status : 'done'
        })
    };
    //学员生日
    let initStudentBirthday;
    if ( edtionStuinfro && edtionStuinfro.birthday && edtionStuinfro.birthday != ''){
        initStudentBirthday = moment(new Date(  edtionStuinfro.birthday ));
    };

    //确认新增表单
    function confirmCreateFormAction(){
        validateFieldsAndScroll((err, values) => {
			if ( !!err ){
				return;
			};
			if (values.seller == "undefined" || !values.seller || values.seller ==''){
				values.seller = '';
			}
			if( edtionStuinfro && edtionStuinfro.id ){
				values.stuId =  edtionStuinfro.id;
				confirmCreateForm(values);
			}else  {
				confirmCreateForm(values);
			}
        });
    };

	//表单关闭后
	function afterClose(){
		resetFields();
	}

    //取消新增表单
    function cancelCreateFormAction(){
        cancelCreateForm();
    };

    let NewsourceList = [];
    sourceList.map(function (item) {
        if (item.key == '1' || item.value == "微官网"){

        }else{
            NewsourceList.push(item);
        }
    })

    function disabledDate(current) {
        return current && current.valueOf() > Date.now();
    }

    function disabledDateTime() {
        return {
            disabledHours: () => range(0, 24).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }

    /*检验联系方式*/
    function checkMobile(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(!(/^1[0-9]{10}$/.test(value))){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    }

    /*校验员工姓名*/
    function NewcheckName(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('学员姓名不能为空'));
        }else{
            callback();
        }
    }

    let collecter = '';
    if ( edtionStuinfro.collecter == '' || edtionStuinfro.collecter == undefined || edtionStuinfro.collecter == null ){
        collecter = '';
    }else{
        collecter = edtionStuinfro.collecter + '';
    }

	function birthdaySelect( moment, value ){
		let constellation = JusConstellation( value );
		setFieldsValue({ constellation : constellation })
	}

	function checkRemark( rule, value, callback){
		if( value.length > 200 ){
            callback(new Error('备注不超过200字'));
        }else{
			callback();
		}
	}

	function changeStuName( e ){
		let value = e.target.value;
		setFieldsValue({ 'parentName' : value + '家长' })
	}

    return (
        <Modal
            className = "stu_create_modal_content"
            title = "学员信息"
            visible = { createStudentModalVisible }
            width = '800px'
            onCancel = { cancelCreateFormAction }
            onClose = { cancelCreateFormAction }
            maskClosable = { false }
			afterClose = { afterClose }
            footer = {[
                <Button key = "cancelStudent" onClick = { cancelCreateFormAction } >取消</Button>,
                <Button key = "confirmStudent" type = "primary" onClick = { confirmCreateFormAction } loading = { stuModalCreateBtnLoading } disabled = { stuModalCreateBtnLoading } style = {{ marginLeft : 20 }}>保存</Button>
            ]}
        >
            <Form className ="zl_basefrom">
                <BlockTitle content = '学员信息'/>
				<div className = 'stu_create_modal_left' >
					<FormItem
						{ ...formItemLayout }
						label = "所属校区"
					>
						{ getFieldDecorator('orgId',{
							initialValue : !edtionStuinfro.orgId ? (!createOrgId ? '' : createOrgId + ''):edtionStuinfro.orgId + '',
							rules : [
								{ required : true , message : '请选择校区' }
							]
						})(
							<TenantOrgSelect { ...tenantOrgSelectProps } />
						)}
					</FormItem>
					<div style={{ position : 'relative' }}>
						<FormItem
							{ ...formItemLayout }
							label = "学员姓名"
						>
							{ getFieldDecorator('name', {
								initialValue : edtionStuinfro.name || '',
								rules : [
									{ required : true , message : '请输入学员姓名' },
									{ validator : NewcheckName }
								]
							})(
								<Input size = 'default' placeholder = "请输入学员姓名" style = {{ width : 220 }} onChange = { (e) => changeStuName(e) } onBlur = { ( e ) => checkStuNameAndPhone( e, 'name', getFieldValue('orgId'), edtionStuinfro.id ) }/>
							)}

						</FormItem>
						<a
							onClick = { () => checkStudentStatusAction( getFieldValue('orgId'), getFieldValue('name') ) }
							style={{ position : 'absolute', top : 5,right : -2, padding : 0, width : 58 }}>
							查重
						</a>
					</div>
					<FormItem
						{ ...formItemLayout }
						label = "一级来源"
					>
						{ getFieldDecorator('channel',{
							initialValue : edtionStuinfro.channel || undefined,
							rules : [
								{ required : true , message : '请选择一级来源' }
							]
						})(
							<Select
								style = {{ width : '270px' }}
								size = 'default'
								showSearch
								allowClear
								optionFilterProp = "children"
								placeholder = '请选择来源'
								notFoundContent = { '没有来源' }
							>
								{
									NewsourceList &&  NewsourceList.map(function( item, index ){
										return ( <Option key = { 'source' + item.key } value = { item.key } >{ item.value }</Option> )
									})
								}
							</Select>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "学员性别"
					>
						{ getFieldDecorator('sex', {
							initialValue : edtionStuinfro.sex || undefined,
						})(
							<RadioGroup style = {{ width : '270px', marginTop : '5px' }} >
								<Radio value = "1">男</Radio>
								<Radio value = "2">女</Radio>
							</RadioGroup>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "学员生日"
					>
						{ getFieldDecorator('birthday',{
							initialValue : initStudentBirthday || undefined,
							rules : [
								{ required : true ,type : 'object', message : '请选择生日' }
							]
						})(
							<DatePicker
								onChange = { birthdaySelect }
								size = 'default'
								format="YYYY-MM-DD"
								disabledDate={disabledDate}
								disabledTime={disabledDateTime}
								style = {{ width : '270px'}}
							/>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "星座"
					>
						{ getFieldDecorator('constellation',{
							initialValue : edtionStuinfro.constellation || undefined,
							rules : [
							]
						})(
							<Input size = 'default' disabled = { true } placeholder = '选择生日得到星座' style = {{ width : '270px'}} />
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "联系方式"
						style = {{ marginBottom : '0' }}
					>
						{ getFieldDecorator('mobile',{
							initialValue : edtionStuinfro.mobile || '',
							rules : [
								{ validator : checkMobile }
							]
						})(
							<Input size = 'default' placeholder = "请输入联系方式" style = {{ width : '270px'}} /*onBlur = { ( e ) => checkStuNameAndPhone( e, 'mobile', getFieldValue('orgId'), edtionStuinfro.id ) }*/ />
						)}
					</FormItem>
				</div>
				<div className = 'stu_create_modal_right'>
					<FormItem
						{ ...formItemLayout }
						label = "负责销售"
					>
						{ getFieldDecorator('seller',{
							initialValue : edtionStuinfro.seller || undefined,
							rules : [
							]
						})(
							<Select
								size = 'default'
								style = {{ width : '270px' }}
								showSearch
								allowClear
								optionFilterProp = "children"
								placeholder = '请选择当前校区下的员工'
								notFoundContent = { '当前校区下没有员工' }
							>
								{
									createSellerList && createSellerList.map(function( item, index ){
										return ( <Option key = { 'intention_' + item.id } value = { item.id + '' } >{ item.name }</Option> )
									})
								}
							</Select>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "负责顾问"
					>
						{ getFieldDecorator('counselorId',{
							initialValue : edtionStuinfro.counselorId|| undefined,
							rules : [
							]
						})(
							<Select
								size = 'default'
								style = {{ width : '270px' }}
								showSearch
								allowClear
								optionFilterProp = "children"
								placeholder = '请选择当前校区下的员工'
								notFoundContent = { '当前校区下没有员工' }
							>
								{
									collecterIdList && collecterIdList.map(function( item, index ){
										return ( <Option key = { 'source' + item.id } value = { item.id + ''} >{ item.name }</Option> )
									})
								}
							</Select>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout }
						label = "二级来源"
					>
						{ getFieldDecorator('secondChannel',{
							initialValue : edtionStuinfro.secondChannel || undefined,
							rules : [
							]
						})(
							<Select
								style = {{ width : '270px' }}
								size = 'default'
								showSearch
								allowClear
								optionFilterProp = "children"
								placeholder = '请选择二级来源'
								notFoundContent = { '没有来源' }
							>
								{
									secondChannelList && secondChannelList.map(function( item, index ){
										return ( <Option key = { 'source' + item.key } value = { item.key } >{ item.value }</Option> )
									})
								}
							</Select>
						)}
					</FormItem>
					<FormItem
						{ ...formItemLayout}
						label = "学员头像"
						help = "支持png, jpeg, gif格式的图片, 不大于2M"
					>
						{ getFieldDecorator('headimgurl', {
							initialValue  : initStudentImg || [],
							valuePropName : 'fileList',
							// action        : `${BASE_URL}/uploadController/upload`,
							action		 : '/thinknode/upload/image',
							normalize     : normFile,
							rules : [
								{ type : 'array' , message : '请上传头像' }
							]
						})(
							<Upload
								// action = { BASE_URL + '/uploadController/upload' }
								action = '/thinknode/upload/image'
								listType = "picture-card"
								beforeUpload = {( file , fileList ) => imgMaxSize( file , fileList , 2 , '学员头像')}
							>
								{ getFieldValue('headimgurl') && getFieldValue('headimgurl').length >= 1 ?  null : uploadButton }
							</Upload>
						)}
					</FormItem>
				</div>
            </Form>
			<div className = 'stu_create_modal_more' onClick = { showMoreStuInfo } >
				<a style = {{ height : '14px', lineHeight : '14px', display : 'inline-block', marginRight : '10px' }} >填写更多</a>
				{ isShowMore ?
					<Icon type = "down-circle" />
					: <Icon type = "up-circle" />
				}
			</div>
			<QueueAnim
				type={['top', 'top']}
				ease={['easeOutQuart', 'easeInOutQuart']}
				style={{width : '100%'}} >
				{ isShowMore ?
					<div key = 'stuInfoMore'>
						<Form>
							<div className = 'stu_create_modal_left' >
								<FormItem
									{ ...formItemLayout }
									label = "学员类型"
								>
									{ getFieldDecorator('intention',{
										initialValue : edtionStuinfro.intention || undefined,
										rules : [
										]
									})(
										<Select
											style = {{ width : '270px' }}
											size = 'default'
											showSearch
											allowClear
											optionFilterProp = "children"
											placeholder = '请选择学员类型'
											notFoundContent = { '没有学员类型' }
										>
											{
												studentTypeList && studentTypeList.map(function( item, index ){
													return ( <Option key = { 'studentType_' + item.key } value = { item.key } >{ item.value }</Option> )
												})
											}
										</Select>
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "昵称"
								>
									{ getFieldDecorator('nickName',{
										initialValue : edtionStuinfro.nickName || undefined,
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请填写昵称" style = {{ width : '270px'}} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "民族"
								>
									{ getFieldDecorator('nation',{
										initialValue : edtionStuinfro.nation || undefined,
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请填写民族" style = {{ width : '270px'}} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "特长"
								>
									{ getFieldDecorator('speciality',{
										initialValue : edtionStuinfro.speciality || undefined,
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请填写特长" style = {{ width : '270px'}} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "爱好"
								>
									{ getFieldDecorator('hobby',{
										initialValue : edtionStuinfro.hobby || undefined,
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请输入爱好" style = {{ width : '270px' }} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "血型"
								>
									{ getFieldDecorator('bloodType',{
										initialValue : edtionStuinfro.bloodType || undefined,
										rules : [
										]
									})(
										<Select
											style = {{ width : '270px' }}
											size = 'default'
											placeholder = '请选择血型'
										>
											<Option value = 'ab' >AB</Option>
											<Option value = 'a' >A</Option>
											<Option value = 'b' >B</Option>
											<Option value = 'o' >O</Option>
										</Select>
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "年级"
								>
									{ getFieldDecorator('grade',{
										initialValue : edtionStuinfro.grade || undefined,
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请输入年级" style = {{ width : '270px' }} />
									)}
								</FormItem>
							</div>
							<div className = 'stu_create_modal_right'>
								<FormItem
									{ ...formItemLayout }
									label = "推荐人"
								>
									{ getFieldDecorator('recommender',{
										initialValue : edtionStuinfro.recommender || undefined,
										rules : [
										]
									})(
										<Select
											style = {{ width : '270px' }}
											size = 'default'
											showSearch
											allowClear
											optionFilterProp = "children"
											placeholder = '请选择推荐人'
											notFoundContent = { '没有推荐人' }
										>
											{
												recommenderList && recommenderList.map(function( item, index ){
													return ( <Option key = { 'source' + item.id } value = { item.id } >{ item.name }</Option> )
												})
											}
										</Select>
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "收集人"
								>
									{ getFieldDecorator('collecterId',{
										initialValue : collecter || undefined,
										rules : [
										]
									})(
										<Select
											style = {{ width : '270px' }}
											size = 'default'
											showSearch
											allowClear = { false }
											optionFilterProp = "children"
											placeholder = '请选择收集人'
											notFoundContent = { '没有收集人' }
										>
											{
												collecterIdList && collecterIdList.map(function( item, index ){
													return ( <Option key = { 'source' + item.id } value = { item.id +'' } >{ item.name }</Option> )
												})
											}
										</Select>
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "社保号码"
								>
									{ getFieldDecorator('socialSecurityNum',{
										initialValue : edtionStuinfro.socialSecurityNum || '',
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请输入社保号码" style = {{ width : '270px' }} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "联系地址"
								>
									{ getFieldDecorator('conaddress',{
										initialValue : edtionStuinfro.conaddress || '',
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请输入联系地址" style = {{ width : '270px'}} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "学校"
								>
									{ getFieldDecorator('schaddress',{
										initialValue : edtionStuinfro.schaddress || '',
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请输入学校" style = {{ width : '270px'}} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "居住小区"
								>
									{ getFieldDecorator('community',{
										initialValue : edtionStuinfro.community || '',
										rules : [
										]
									})(
										<Input size = 'default' placeholder = "请输入居住小区" style = {{ width : '270px'}} />
									)}
								</FormItem>
								<FormItem
									{ ...formItemLayout }
									label = "备注"
								>
									{ getFieldDecorator('remark',{
										initialValue : edtionStuinfro.remark || '',
										rules : [
											{ validator : checkRemark }
										]
									})(
										<Input size = 'default' placeholder = "请输入备注" style = {{ width : '270px'}} />
									)}
								</FormItem>
							</div>
						</Form>
					</div>
					: null
				}
			</QueueAnim>
			{ !edtionStuinfro.id && createStudentModalVisible &&
				<Form>
				<FormItem
					style = {{ height : '12px' }}
				>
					{ getFieldDecorator('parentInfoIsShow', {
						initialValue : 'checked' || undefined,
						rules : [
						]
					})(
						<Checkbox defaultChecked = { true } >同时填写家长信息</Checkbox>
					)}
				</FormItem>
			</Form>
			}
			{ !edtionStuinfro.id &&
				<QueueAnim
					type={['top', 'top']}
					ease={['easeOutQuart', 'easeInOutQuart']}
					style={{width : '100%'}} >
					{ getFieldValue( 'parentInfoIsShow' ) ?
						<div key = 'isWriteParentInfo'>
							<Form>
								<BlockTitle content = '家长信息'/>
								<div className = 'stu_create_modal_left' >
									<FormItem
										label = "家长信息"
										{ ...formItemLayout }
									>
										{ getFieldDecorator('parentInfo',{
											initialValue : '1',
											rules : [
												{ required : true, message : '请选择' }
											]
										})(
											<Select
												size = 'default'
												allowClear
												placeholder = "请选择"

											>
												<Option value = '1' >新建家长</Option>
												<Option value = '2' >从家长库选择</Option>
											</Select>
										)}
									</FormItem>
									<QueueAnim
											type={['top', 'top']}
											ease={['easeOutQuart', 'easeInOutQuart']}
											style={{width : '100%'}} >
										{ !!getFieldValue('parentInfo') && getFieldValue('parentInfo') == '2' ?
											<div key = 'parentIsQueueAnim'>
												<FormItem
													label = "家长姓名"
													{ ...formItemLayout }
												>
													{ getFieldDecorator('parentId', {
														initialValue : undefined,//parentId || undefined,
														rules : [
															{ required : true, message : '请选择家长'}
														]
													})(
														<Select
															showSearch
															allowClear
															size = 'default'
															placeholder = "请选择家长"
															optionFilterProp = "children"
															notFoundContent = "没有家长"
														>
															{ recommenderList && recommenderList.map(function( item, index ){
																return ( <Option key = { 'parentName_' + item.id } value = { item.id } >{ item.name }</Option> )
															})}
														</Select>
													)}
												</FormItem>
											</div>
											:
											<div key = 'parentNotQueueAnim' >
												<FormItem
													label = "家长姓名"
													{ ...formItemLayout }
												>
													{ getFieldDecorator('parentName',{
														initialValue : undefined,//parentDetailInfo.name || '',
														rules : [
															{ required : true, message : '请输入家长姓名', whitespace: true, }
														]
													})(
														<Input size = 'default' placeholder = '请输入家长姓名' />
													)}
												</FormItem>
												<FormItem
													label = "手机号"
													{ ...formItemLayout }
													style = {{ marginBottom : '0' }}
												>
													{ getFieldDecorator('parentMobile',{
														initialValue : undefined,//parentDetailInfo.mobile || '',
														rules : [
															{ required : true, message : '请输入家长手机号' },
															{ validator : checkMobile }
														]
													})(
														<Input size = 'default' placeholder = '请输入联系方式' onBlur = { ( e ) => checkStuNameAndPhone( e, 'parentMobile', getFieldValue('orgId') ) }  />
													)}
												</FormItem>
											</div>
										}
									</QueueAnim>
								</div>
								<div className = 'stu_create_modal_right'>
									<FormItem
										label = "家长关系"
										{ ...formItemLayout }
									>
										{ getFieldDecorator('parentRelation',{
											initialValue : undefined,//parentDetailInfo.relation || undefined,
											rules : [
												{ required : true, message : '请选择家长关系' }
											]
										})(
											<Select
												showSearch
												allowClear
												size = 'default'
												placeholder = "请选择家长关系"
											>
												{ !!parentRelationList && parentRelationList.map(function( item, index ){
													return ( <Option key = { 'parent_relation_' + item.index } value = { item.key } >{ item.value }</Option> )
												})}
											</Select>
										)}
									</FormItem>
									<QueueAnim
										type={['top', 'top']}
										ease={['easeOutQuart', 'easeInOutQuart']}
										style={{width : '100%'}} >
										{ !!getFieldValue('parentInfo') && getFieldValue('parentInfo') == '1' ?
											<div key = 'parentEmailIsQueueAnim'>
												<FormItem
													label = "邮箱"
													{ ...formItemLayout }
												>
													{ getFieldDecorator('parentEmail',{
														initialValue : undefined,//parentDetailInfo.email || '',
														rules : [
														]
													})(
														<Input size = 'default' placeholder = '请输入邮箱' />
													)}
												</FormItem>
												<FormItem
													label = "工作单位"
													{ ...formItemLayout }
													style = {{ marginBottom : '0' }}
												>
													{ getFieldDecorator('parentWorkUnit',{
														initialValue : undefined, // parentDetailInfo.email || '',
														rules : [
														]
													})(
														<Input size = 'default' placeholder = '请输入邮箱' />
													)}
												</FormItem>
											</div>
											: null
										}
									</QueueAnim>
								</div>
							</Form>
						</div>
						: null
					}
				</QueueAnim>
			}
        </Modal>
    )
}

export default Form.create({})(StudentManageCreateForm);
