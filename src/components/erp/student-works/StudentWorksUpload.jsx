import React from 'react';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import style from './StudentWorksUpload.less';
import { Form , Modal , Button , Popconfirm , Icon , Row , Col , Select , Upload , Spin , message } from 'antd';
let Option = Select.Option;
let Dragger = Upload.Dragger;
let FormItem = Form.Item;

function StudentWorksUpload({
	uploadWorksModalVisible,

    TenantSelectOnSelect,
    stuIdList,
    tagIdList,

    cancelUploadWorks,
    createWorkType,

    uploadWorksToCloud,

    fileListChange,         //上传图片
    fileList,

    stuId,
    orgId,

    uploadLoading,                      //上传加载状态(按钮+表单)

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

    function TenantSelectOnSelectAction( value ){
        setFieldsValue({ 'stuId' : undefined });
        if( !!value ){
            TenantSelectOnSelect( value )
        }
    };
    //校区下拉列表属性
    let tenantOrgSelectProps = {
        width        : 210,
        onChange     : TenantSelectOnSelectAction,            //改变机构触发事件
        disabled     : !!orgId,
    };

    //取消上传作品
    function cancelUploadWorksAction(){
        resetFields();
        cancelUploadWorks();
    }
    //上传作品
    function uploadWorksToCloudAction(){
        validateFieldsAndScroll( ( err, values ) => {
            if( !!err ){
                return;
            };
            let works = [];
            fileList && fileList.map( function( item, index ){
               works.push({
                   title   : item.name,
                   imgurl  : item.response.data.url,
                   imgsize : item.size
               })
            });
			if( works.length <= 0 ){
				message.error( '请上传作品' )
			}else{
            	uploadWorksToCloud( values, works );
			}
        })
    };

	let DraggerProps = {
		name           : 'file',
		multiple       : true,
        // action         : `${BASE_URL}/uploadController/upload`,
        action         : '/thinknode/upload/image',
        showUploadList : true,
        listType       : 'picture-card',
        onChange       : fileListChange,
        beforeUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 15;
            if (!isLt2M) {
                message.error('图片大小不大于15M!');
                return false;
            }
            return true;
        },
	};

    let formItemLayout = {
        labelCol : { span : 4 },
		wrapperCol : { span : 18 }
    };

	return(
       <Modal
            className = "zj_stu_works_upload_modal"
            visible = { uploadWorksModalVisible }
            title = '学员作品信息'
            maskClosable = { false }
            width = '550px'
            onCancel = { cancelUploadWorksAction }
            footer = { [
                <Button key = 'submit' onClick = { uploadWorksToCloudAction } type = 'primary' loading = { uploadLoading } disabled = { uploadLoading } >上传</Button>
            ] }
        >
            <Spin spinning = { uploadLoading }>
                <Row style = {{ marginBottom : -10 }}>
                    <Col span = { 24 } >
                        <Form>
                            <FormItem
                                labelCol = {{ span : 4 }}
                                wrapperCol = {{ span : 16 }}
                                label = "所属分类"
                            >
                                { getFieldDecorator('workTagId', {
                                    rules : [
                                        { required : true, message : '请选择分类' }
                                    ]
                                })(
                                    <Select
                                        size = 'default'
                                        style = {{ width : '140px' }}
                                        showSearch
                                        notFoundContent = { '没有分类' }
                                        placeholder = '请选择分类'
                                    >
                                        { tagIdList && tagIdList.map(function(item,index){
                                            return (
                                                <Option key = { item.id + '' } value = { item.id }>{ item.name }</Option>
                                            )
                                        })}
                                    </Select>
                                )}
                                <Button type='primary' onClick = { createWorkType } style = {{ marginLeft : '10px' }} size = 'default' >创建分类</Button>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col span = { 16 } >
                        { uploadWorksModalVisible == true ?
                            <Form>
                                <FormItem
                                    labelCol = {{ span : 6 }}
                                    wrapperCol = {{ span : 16 }}
                                    label = "所属校区"
                                >
                                    { getFieldDecorator('orgId',{
                                        initialValue : orgId + '' || '',
                                        rules : [
                                            { required : true, message : '请选择校区' }
                                        ]
                                    })(
                                        <TenantOrgSelect { ...tenantOrgSelectProps } />
                                    )}
                                </FormItem>
                            </Form>
                            : null
                        }
                    </Col>
                    <Col style = {{ marginLeft : '-30px' }} span = { 8 } >
                        <Form>
                            <FormItem
                                labelCol = {{ span : 12 }}
                                wrapperCol = {{ span : 12 }}
                                label = "所属学员"
								style = {{ marginBottom : '20px' }}
                            >
                                { getFieldDecorator('stuId', {
                                    initialValue : stuId || undefined,
                                    rules : [
                                        { required : true, message : '请选择学员' }
                                    ]
                                })(
                                    <Select
                                        disabled = { !!stuId }
                                        size = 'default'
                                        placeholder = '请先选择学员'
                                        style = {{ width : '110px' }}
                                        notFoundContent = { '没有学员' }
                                        optionFilterProp = 'children'
                                        showSearch
                                    >
                                      { stuIdList && stuIdList.map(function(item,index){
                                            return (
                                                <Option key = { item.stuId + '' } value = { item.stuId }>{ item.stuName }</Option>
                                            )
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col span = { 24 } >
                        <div style = {{ height : 200 }}>
                            <Dragger { ...DraggerProps } >
                                <p className = "ant-upload-drag-icon" >
                                    <Icon type = "inbox" />
                                </p>
                                <p>点击或将学生作品拖拽到此区域上传</p>
                                <p>支持单个或批量上传</p>
                            </Dragger>
                        </div>
                    </Col>
                </Row>
            </Spin>
        </Modal>
	)
};

export default Form.create()(StudentWorksUpload);
