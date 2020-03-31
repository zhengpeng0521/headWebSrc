import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Icon, Upload, Radio, Spin } from 'antd';
import { BlockTitle } from '../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import TreeSelectStructure from '../../common/new-component/tree-select-structure/TreeSelectStructure';
import TreeOrgCheckSelect from '../../common/new-component/tree-org-check-select/TreeOrgCheckSelect';
import TreeDeptCheckSelect from '../../common/new-component/tree-dept-check-select/TreeDeptCheckSelect';
import TreeSelectOrgDept from '../../common/new-component/tree-select-org-dept/TreeSelectOrgDept';
import style from './StaffManageAddOrEditStaff.less';
import { debounce } from '../../../utils/debounce'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol : { span : 4 },
    wrapperCol : { span : 20 },
};
const formItemLayout1 = {
    labelCol : { span : 10 },
    wrapperCol : { span : 14 },
};

/*员工管理新增员工modal*/
const StaffManageAddOrEditStaff = ({
    staffManageType,
    staffManageRoleSelectContent,       //角色下拉数据
    staffManageGetchiefUserContent,     //汇报对象下拉数据
    staffList,                          //员工列表查询(总部汇报对象)

    addOrEditStaffModalType,            //新增编辑表单类型('add'/'edit'/'modifyFunction')
    addOrEditStaffModalVisible,         //新增编辑员工modal是否显示
    addOrEditStaffModalLoading,         //新增编辑员工表单加载状态
    addOrEditStaffModalButtonLoading,   //新增编辑员工modal按钮是否在加载状态
    addOrEditStaffModalData,            //编辑员工时回填数据
    addOrEditStaffModalLeaderSelect,    //通过摘要查询获取汇报对象下拉列表
    addOrEditStaffModalChooseOrgId,     //账号所属选中的校区ID
    addOrEditStaffModalWetherHead,      //所属部门如果是总部(true),用来判断管辖校区的显示内容
    addOrEditStaFFModalOrgId,
    empNo,                              //员工工号
    mail,                               //员工邮箱

    AddOrEditStaffModalSubmit,          //新增编辑员工提交
    AddOrEditStaffModalCancel,          //新增编辑员工modal关闭

    selectCampusModalVisible,           //选择校区modal是否显示
    selectCampus,                       //默认添加的校区选项
    selectDeptModalVisible,            //选择部门modal是否显示
    selectDept,                        //默认添加的部门选项
    updateXiaoquFun,
    handlePreview,
    handleCancelImg,
    previewVisible,            //预览显示
    previewImage,              //预览图片
    OpenCloseChooseMgrOrgModal,         //打开选择管辖校区modal
    AfterSelectCampusModalSubmit,       //添加校区选择完毕点击保存
    OpenCloseChooseDeptModal,         //打开选择管辖部门modal
    AfterSelectDeptModalSubmit,       //添加部门选择完毕点击保存
	checkgxxq,
    updateMgrRange,
    mobileChange,                     //手机号改变
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    /*判断是否系统管理员*/
    let wetherSysMgr = addOrEditStaffModalData.roleKey == 'hqAdmin';
    //let wetherSysMgr = true;

    let ischange = addOrEditStaffModalType == 'modifyFunction'

    /*角色下拉列表*/
    let role = [];
    if(staffManageRoleSelectContent && staffManageRoleSelectContent.length > 0){
        role = staffManageRoleSelectContent.map((item) => {
            return (
                <Option key = { item.id + '' } value ={ item.id + '' } disabled = { !!item.flag }>{ item.name }</Option>
            );
        })
    }

    /*汇报对象下拉列表*/
    let chiefUser = [];
    if(staffManageGetchiefUserContent && staffManageGetchiefUserContent.length > 0){
        chiefUser = staffManageGetchiefUserContent.map((item) => {
            return (
                <Option key = { item.id + '' } value ={ item.id + '' }>{ item.name }</Option>
            );
        })
    }

    /*总部 -- 汇报对象下拉列表*/
    let staffUserList = [];
    if(staffList && staffList.length > 0){
        staffUserList = staffList.map((item) => {
            return (
                <Option key = { item.id + '' } value ={ item.id + '' }>{ item.name }</Option>
            );
        })
    }
    /*编辑时获取账号所属默认值*/
    let arrayOne;
    let arrayTwo = [];
    if(addOrEditStaffModalData.deptPids && addOrEditStaffModalData.deptPids != '' && addOrEditStaffModalData.deptPids != null && addOrEditStaffModalData.deptPids != undefined){
        arrayOne = addOrEditStaffModalData.deptPids;
        arrayOne = arrayOne.split(',');
        for(let i in arrayOne){
            arrayTwo.push(parseInt(arrayOne[i]));
        }
        arrayTwo.push(addOrEditStaffModalData.deptId);
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,data) => {
            if (!!errors) {
                return;
            }
			if(staffManageType == 'hq' && checkgxxq == false && (data.mgrRange == '0' || data.mgrRange == '2')){
				return;
			}
            //处理员工id(新增时不传，编辑和修改职能时时才传)
            if(addOrEditStaffModalType != 'add'){
               data.userId = addOrEditStaffModalData.id;
            }

            //处理图片显示(新增和编辑时需要上传，修改职能时不需要)
            if(addOrEditStaffModalType != 'modifyFunction'){
                if(data.IMG == '' || data.IMG == null || data.IMG == undefined){
                    if(staffManageType == 'org'){
                        data.headimgurl = '';
                    }else{
                        data.headImgurl = '';
                    }
                }else{
                    if(staffManageType == 'org'){
                        data.headimgurl = !!data.IMG[0] && !!data.IMG[0].url ? data.IMG[0].url : data.IMG[0].response.data.url
                    }else{
                        data.headImgurl = !!data.IMG[0] && !!data.IMG[0].url ? data.IMG[0].url : data.IMG[0].response.data.url
                    }
                }
            }

            delete data.IMG;

            //处理密码(新增时默认密码为123456，编辑时不传密码)
            if(addOrEditStaffModalType == 'add'){
                data.password = '123456';
            }
            delete data.readPass;

            //处理管辖校区(修改职能和编辑时不存在)
            if(addOrEditStaffModalType != 'edit'){
                if(staffManageType == 'hq'){
                    data.mgrOrgIds = selectCampus && selectCampus.length > 0 ? selectCampus.join(',') : undefined;
                    data.permDeptIds = selectDept && selectDept.length > 0 ? selectDept.join(',') : undefined;
                }else{
                    data.orgId = data.suoshuxiaoqu.split('-')[1];
                    data.mgrOrgIds = data.suoshuxiaoqu.split('-')[1];
                }
            }
            if(addOrEditStaffModalType == 'edit'){
                if(staffManageType == 'hq'){
                    data.userId = data.userId;
                }else{
                    data.id = data.userId;
                    data.orgId = data.belongorgId;
                }
            }

            if(addOrEditStaffModalType == 'modifyFunction'){
                if(staffManageType == 'org'){
                    data.id = data.userId;
                    data.orgId = data.mgrOrgIds
                }
            }

            if(staffManageType == 'hq'){
                data.roleId = data.roleId;
            }else{
                data.roleIds = data.roleId;
            }
            delete data.guanxiaxiaoqu;
            delete data.suoshuxiaoqu;

            data.leaderId = data.huibaoduixiang || '';
            delete data.huibaoduixiang;

            data.staffManageType = staffManageType;
            AddOrEditStaffModalSubmit(data);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        AddOrEditStaffModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: addOrEditStaffModalType == 'add' ? '新增员工' : addOrEditStaffModalType == 'edit' ? '编辑员工' : addOrEditStaffModalType == 'modifyFunction' ? '修改职能' : '',
        maskClosable : false,
        visible : addOrEditStaffModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : wetherSysMgr ? [<Button key="cancel" type="primary" onClick={handleCancel}>我知道了</Button>] : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                    onClick={handleComplete}
                    disabled={addOrEditStaffModalButtonLoading}
                    loading={addOrEditStaffModalButtonLoading}
                    style={{marginLeft:'10px'}}>保存</Button>
        ],
        className : 'zj_staff_add_or_edit_modal'
    };

    let imgurlUploadProps = {
        name: 'file',
        action: '/thinknode/upload/image',
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                return message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
    		}
            if (info.file.status === 'done' && info.file.response.errorCode == 9000) {
                return message.success(`${info.file.name} 上传成功`);
            }
            if (info.file.status === 'error') {
                return message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            let imgurl_list = getFieldValue('IMG');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张主图');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不大于2M!');
                return false;
            }
            return true;
        },
        onPreview : handlePreview,
    };


    let url = staffManageType == 'hq' ? addOrEditStaffModalData && addOrEditStaffModalData.headImgurl && addOrEditStaffModalData.headImgurl !='' && addOrEditStaffModalData.headImgurl != undefined || addOrEditStaffModalData.headImgurl != null ? addOrEditStaffModalData.headImgurl : null : addOrEditStaffModalData && addOrEditStaffModalData.headimgurl && addOrEditStaffModalData.headimgurl !='' && addOrEditStaffModalData.headimgurl != undefined || addOrEditStaffModalData.headimgurl != null ? addOrEditStaffModalData.headimgurl : null;

    let displayImg = [{
        uid : -1,
        url : url,
        name : addOrEditStaffModalData.name,
        thumbUrl : url,
    }];

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    /*校区选择框属性*/
    let TreeOrgCheckSelectProps = {
        multiple : false,
        visible: selectCampusModalVisible,
        onClose: OpenCloseChooseMgrOrgModal,
        afterSubmit: AfterSelectCampusModalSubmit,                  /*校区选中后的回调*/
        init_org_select: selectCampus,
        disabled : wetherSysMgr
    };
    /*部门选择框属性*/
    let TreeDeptCheckSelectProps = {
        multiple : false,
        visible: selectDeptModalVisible,
        onClose: OpenCloseChooseDeptModal,
        afterSubmit: AfterSelectDeptModalSubmit,                  /*部门选中后的回调*/
        init_org_select: selectDept,
        disabled : wetherSysMgr
    };

	/*检验手机号码*/
    function checkMobile(rule, value, callback){
        if(!(/^1[0-9]{10}$/.test(value))){
            callback(new Error('请输入正确的手机号'));
        }else{
            callback();
        }
    }

    function getOrgIdFun(e) {
        setFieldsValue({
            roleId : '',
            deptId : '',
            huibaoduixiang : ''
        })
        updateXiaoquFun(e.split('-')[1])
    }
    let ssxiaoqu = addOrEditStaffModalData && addOrEditStaffModalData.tenantId ? (( addOrEditStaffModalData.tenantId) + '-' + (addOrEditStaffModalData && addOrEditStaffModalData.orgId ? addOrEditStaffModalData.orgId : '')) : '';

    function changeMgrRange(e){
        updateMgrRange(e.target.value)
    }
    return (
        <Modal {...modalOpts}>
            <Spin spinning = { addOrEditStaffModalLoading }>
                {/*新增和编辑显示如下信息*/}
                { addOrEditStaffModalType != 'modifyFunction' ?
                    <div>
                        <BlockTitle content = '基本信息'/>
                        <FormItem
                            label = "员工头像"
                            help = "支持png、jpg、jpeg、gif格式的图片,图片大小不大于2M!"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('IMG', {
                                initialValue : addOrEditStaffModalType == 'edit' ? ((displayImg[0].url == '' || displayImg[0].url == null || displayImg[0].url == undefined) ? '' : displayImg) : '',
                                valuePropName : 'fileList',
                                normalize : normFile,
                            })(
                                <Upload {...imgurlUploadProps} >
                                     { getFieldValue('IMG') && getFieldValue('IMG').length >= 1 ?
                                        null :
                                        <div>
                                            <Icon type = 'plus' />
                                            <div>选择头像</div>
                                        </div> }
                                </Upload>
                            )}
                        </FormItem>
                        <Modal visible={ previewVisible } footer={null} onCancel={ handleCancelImg }>
                          <img alt="头像" style={{ width: '100%' }} src={ previewImage } />
                        </Modal>
                        <FormItem
                            { ...formItemLayout }
                            label = "员工姓名"
                        >
                            { getFieldDecorator('name',{
                                initialValue : addOrEditStaffModalType == 'edit' && addOrEditStaffModalData.name ? addOrEditStaffModalData.name + '' : undefined,
                                rules : [
                                    { required : true , message : '请输入员工姓名' , whitespace : true },
                                ]
                            })(
                                <Input placeholder = "请输入员工姓名" size='default' />
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label = "员工手机"
                        >
                            { getFieldDecorator('mobile',{
                                initialValue : addOrEditStaffModalType == 'edit' && addOrEditStaffModalData.mobile ? addOrEditStaffModalData.mobile + '' : undefined,
                                rules : [
                                    { required : true , message : '请输入员工手机' , whitespace : true },
                                    { validator : checkMobile },
                                ]
                            })(
                                <Input placeholder = "请输入员工手机" size='default' disabled = { addOrEditStaffModalType == 'edit' } onChange={debounce((e) => mobileChange(e), 1000)}/>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label = "员工工号"
                        >
                            { getFieldDecorator('empNo',{
                                initialValue : empNo + '',
                                rules : [
                                    { required : false , message : '限制30个字符' , whitespace : true, max : 30 },
                                ]
                            })(
                                <Input placeholder = "请输入员工工号" size='default'/>
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label = "员工邮箱"
                        >
                            { getFieldDecorator('mail',{
                                initialValue : mail + '',
                                rules : [
                                    { required : false , message : '限制30个字符' , whitespace : true, max : 30 },
                                ]
                            })(
                                <Input placeholder = "请输入员工邮箱" size='default' />
                            )}
                        </FormItem>
                        <FormItem
                            { ...formItemLayout }
                            label = "初始密码"
                            style = {{ lineHeight : '32px' }}
                        >
                            { getFieldDecorator('readPass')(
                                <span style={{color:'#5d9cec'}}>123456</span>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="性别"
                            style = {{ lineHeight : '30px' }}
                        >
                            {getFieldDecorator('sex',{
                                initialValue : addOrEditStaffModalType=='edit' && addOrEditStaffModalData.sex ? addOrEditStaffModalData.sex + '' : undefined,
                                rules : [
                                    { required : true , message : '请选择员工性别' }
                                ]
                            })(
                                <RadioGroup>
                                    <Radio value='1'>男</Radio>
                                    <Radio value='2'>女</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem
                            label = "简介"
                            style = {{ marginBottom : addOrEditStaffModalType == 'add' ? 10 : 0 }}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('intro', {
                                initialValue : addOrEditStaffModalType == 'edit' && addOrEditStaffModalData.intro ? addOrEditStaffModalData.intro + '' : undefined,
                            })(
                                <Input type="textarea" placeholder='请填写简介' autosize={{ minRows: 3, maxRows: 4 }}/>
                            )}
                        </FormItem>
                    </div> : null
                }
                {/*新增和修改职能显示如下信息*/}
                { addOrEditStaffModalType != 'edit' ?
                    <div>
                        <BlockTitle
                            content = {
                                <div>职能信息{ wetherSysMgr ? <span style = {{ color : 'red' }}>（该员工为系统管理员，仅供参考，禁止修改）</span> : null }</div>
                            }
                            style = {{ marginBottom : 5 }}
                        />
                        {staffManageType == 'org' ?
                            <FormItem
                                label = "所属校区"
                                {...formItemLayout}

                            >
                                {getFieldDecorator('suoshuxiaoqu',{
                                    initialValue : ssxiaoqu,
                                    rules : [
                                        { required : true , message : '请选择校区' }
                                    ]
                                })(
                                    <TreeSelectOrgDept s_width = '100%' isHq = '0' onChange={getOrgIdFun} disabled = {ischange}/>
                                )}
                            </FormItem>
                            : ''}
                        <FormItem
                            {...formItemLayout}
                            label="角色"
                        >
                            {getFieldDecorator('roleId',{
                                initialValue : staffManageType == 'hq' ? (addOrEditStaffModalData && addOrEditStaffModalData.roleId ? addOrEditStaffModalData.roleId : undefined) : (addOrEditStaffModalData && addOrEditStaffModalData.roles && addOrEditStaffModalData.roles[0].role_id ? addOrEditStaffModalData.roles[0].role_id : undefined),
                                rules : [
                                    { required : true , message : '请选择角色' }
                                ]
                            })(
                                <Select
                                    placeholder = "请选择角色"
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    style = {{ width : '100%' }}
                                    disabled = { wetherSysMgr }>
                                    { role || [] }
                                </Select>
                            )}
                        </FormItem>
                        {
                            staffManageType == 'org' ?
                            <FormItem
                                label = "数据权限"
                                {...formItemLayout}
                                style = {{ marginBottom : 0 , lineHeight : '30px'}}
                            >
                                {getFieldDecorator('dataPermission',{
                                    initialValue : addOrEditStaffModalData.dataPermission ? addOrEditStaffModalData.dataPermission : '1',
                                    rules : [
                                        { required : true , message : '请选择数据权限' }
                                    ]
                                })(
                                    <RadioGroup disabled = { wetherSysMgr }>
                                        <Radio value='0'>全部（可查看机构全部数据）</Radio>
                                        <Radio value='1'>个人 (团队) (可查看自己和下属数据，若无下属数据则查看自己数据)</Radio>
                                    </RadioGroup>
                                )}
                            </FormItem>
                            :
                            null
                        }
                        <FormItem
                            label = "所属部门"
                            {...formItemLayout}
                            extra={staffManageType == 'org' ? '请先选择所属部门再选择汇报对象，否则汇报对象可能无选项' : ''}
                        >
                            {getFieldDecorator('deptId', {
                                initialValue : addOrEditStaffModalData && addOrEditStaffModalData.deptId ? addOrEditStaffModalData.deptId : '',
                            })(
                                <TreeSelectStructure width = '100%' disabled = { wetherSysMgr } isHq = {staffManageType == 'org' ? '0' : '1'} addOrEditStaFFModalOrgId = { addOrEditStaFFModalOrgId }/>
                            )}
                        </FormItem>
                        {staffManageType == 'org' ?
                            <FormItem
                                {...formItemLayout}
                                label="汇报对象"
                            >
                                {getFieldDecorator('huibaoduixiang',{
                                    initialValue : addOrEditStaffModalData && addOrEditStaffModalData.leaderId && addOrEditStaffModalData.leaderId != '0' ? addOrEditStaffModalData.leaderId + '' : undefined,
                                })(
                                    <Select
                                        placeholder = "请选择汇报对象"
                                        allowClear
                                        showSearch
                                        optionFilterProp = "children"
                                        notFoundContent = "未找到"
                                        style = {{ width : '100%' }}
                                        disabled = { wetherSysMgr }>
                                        { chiefUser || [] }
                                    </Select>
                                )}
                            </FormItem>
                        : ''}
                        {staffManageType == 'hq' ?
                        <div>
                            <FormItem
                                {...formItemLayout}
                                label="汇报对象"
                            >
                                {getFieldDecorator('huibaoduixiang',{
                                    initialValue : addOrEditStaffModalData && addOrEditStaffModalData.leaderId && addOrEditStaffModalData.leaderId != '0' ? addOrEditStaffModalData.leaderId + '' : undefined,
                                })(
                                    <Select
                                        placeholder = "请选择汇报对象"
                                        allowClear
                                        showSearch
                                        optionFilterProp = "children"
                                        notFoundContent = "未找到"
                                        style = {{ width : '100%' }}
                                        disabled = { wetherSysMgr }>
                                        { staffUserList || [] }
                                    </Select>
                                )}
                            </FormItem>
							<div style={{display : 'flex'}}>
								<FormItem
									label = "管辖校区"
									{...formItemLayout}
									style = {{ marginBottom : 0 , lineHeight : '30px', width:'100%'}}
								>
									{getFieldDecorator('mgrRange',{
										initialValue : addOrEditStaffModalData.mgrRange ? addOrEditStaffModalData.mgrRange : '1',
										rules : [
											{ required : true , message : '请选择管辖校区' }
										]
									})(
										<RadioGroup disabled = { wetherSysMgr } onChange = { changeMgrRange }>
											<Radio value='1'>全部校区</Radio>
                                            <Radio value='2'>分部校区</Radio>
                                            {getFieldValue('mgrRange') && getFieldValue('mgrRange') == '2' &&
                                                <FormItem
                                                    style = {{ marginBottom : 0 , lineHeight : '30px', display:'inline-block', marginRight: '5px' }}
                                                    validateStatus = { checkgxxq == false ? 'error' : ''}
                                                    help = { checkgxxq == false ? '请选择分部' : ''}
                                                >
                                                    {getFieldDecorator('permDeptIds',{

                                                    })(
                                                        <div>
                                                            <Button size = 'small' type = 'primary' onClick = { OpenCloseChooseDeptModal } style = {{ marginRight : 10 }}>
                                                                { wetherSysMgr ? '查看分部' : '选择分部' }
                                                            </Button>
                                                            <a onClick = { OpenCloseChooseDeptModal }>已选{ selectDept && selectDept.length > 0 ? selectDept.length : 0 }个</a>
                                                        </div>
                                                    )}
                                                </FormItem>
                                            }
											<Radio value='0'>自选校区</Radio>
                                            {getFieldValue('mgrRange') && getFieldValue('mgrRange') == '0' &&
                                                <FormItem
                                                    style = {{ marginBottom : 0 , lineHeight : '30px', display:'inline-block' }}
                                                    validateStatus = { checkgxxq == false ? 'error' : ''}
                                                    help = { checkgxxq == false ? '请选择校区' : ''}
                                                >
                                                    {getFieldDecorator('guanxiaxiaoqu',{

                                                    })(
                                                        <div>
                                                            <Button size = 'small' type = 'primary' onClick = { OpenCloseChooseMgrOrgModal } style = {{ marginRight : 10 }}>
                                                                { wetherSysMgr ? '查看校区' : '选择校区' }
                                                            </Button>
                                                            <a onClick = { OpenCloseChooseMgrOrgModal }>已选{ selectCampus && selectCampus.length > 0 ? selectCampus.length : 0 }家</a>
                                                        </div>
                                                    )}
                                                </FormItem>
                                            }
										</RadioGroup>
									)}
								</FormItem>
							</div>
                            <FormItem
									label = "数据权限"
                                    {...formItemLayout}
                                    style = {{ marginBottom : 0 , lineHeight : '30px'}}
								>
									{getFieldDecorator('dataPermission',{
										initialValue : addOrEditStaffModalData.dataPermission ? addOrEditStaffModalData.dataPermission : '0',
										rules : [
											{ required : true , message : '请选择数据权限' }
										]
									})(
										<RadioGroup disabled = { wetherSysMgr }>
											<Radio value='0'>总部数据</Radio>
											<Radio value='1'>个人数据</Radio>
										</RadioGroup>
									)}
								</FormItem>
                        </div>

                        : ''}
                    </div> : null
                }
            </Spin>
            <TreeOrgCheckSelect {...TreeOrgCheckSelectProps}/>
            <TreeDeptCheckSelect {...TreeDeptCheckSelectProps}/>
        </Modal>
    );
};

export default Form.create()(StaffManageAddOrEditStaff);
