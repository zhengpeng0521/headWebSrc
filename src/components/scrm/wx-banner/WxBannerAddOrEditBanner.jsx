import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Popover, Radio, Icon, Upload, Spin } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import QueueAnim from 'rc-queue-anim';
import style from './WxBanner.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 18,
  },
};

/*请假处理表单*/
const WxBannerAddOrEditBanner = ({
    wxBannerAddOrEditBannerModalType,               //modal类型('add'/'edit')
    wxBannerAddOrEditBannerModalLoading,            //modal是否loading
    wxBannerAddOrEditBannerModalVisible,            //modal是否显示
    wxBannerAddOrEditBannerButtonLoading,           //modal按钮是否加载状态
    wxBannerAddOrEditBannerModalWetherAdd,          //新增时是否可以在该校区下添加banner
    wxBannerAddOrEditBannerModalLetUChoose,         //新增时说明(若未选择校区 则提示用户请选择校区)
    wxBannerAddOrEditBannerModalContent,            //modal回填数据(主要用到校区ID和校区name)
    wxBannerAddOrEditBannerModalHrefType,           //选择外链方式类型('0'无,'1'自定义,'2'活动,'3'课程)
    wxBannerAddOrEditBannerCourseSelectContent,     //modal课程外链下拉列表
    wxBannerAddOrEditBannerActivitySelectContent,   //modal活动外链下拉列表

    WxBannerAddOrEditBannerModalChangeTenantFilter, //校区选择onChange事件，用来查询当前校区下banner数是否已到限制数(5个)
    WxBannerAddOrEditBannerModalChangeHrefType,     //外链下拉列表onChange事件
    WxBannerAddOrEditBannerModalSubmit,             //请假处理表单提交
    WxBannerAddOrEditBannerModalCancel,             //请假处理表单关闭
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    },
  }) => {


    function changeCampus(orgId) {
        resetFields();
        WxBannerAddOrEditBannerModalChangeTenantFilter(orgId);
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors) => {
            if (!!errors) {
                return;
            }
            let data = getFieldsValue();
            //id传递
            data.id = wxBannerAddOrEditBannerModalContent.id || '0';

            //校验排序值
            if(data.sort == '' || data.sort == undefined || data.sort == null || /^[\s]*$/.test(data.sort)){
                data.sort = 0;
            }else if(!/^\d+$/.test(data.sort) || parseFloat(data.sort) > 9999){
                message.error('排序值只能设置0~9999中某个数字，数字大的排在前面');
                return;
            }

            //处理图片显示
            if(data.IMG == '' || data.IMG == null || data.IMG == undefined){
                data.picUrl = '';
            }else{
                data.picUrl = data.IMG[0].url || data.IMG[0].response.data.url ;
            }

            delete data.IMG;

            if(data.href && (data.href).indexOf('http') == -1 && (data.href).indexOf('https') == -1){
                message.warn('自定义外链必须包含http://或者https://');
                return;
            }
            data.uri = JSON.stringify({ type : data.uriType , uri : data.href || data.activity || data.course || ''});
            delete data.uriType;

            WxBannerAddOrEditBannerModalSubmit(data);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        WxBannerAddOrEditBannerModalCancel();
    }

    //模态框的属性
    let modalOpts = {
        title: wxBannerAddOrEditBannerModalType == 'add' ? '新增轮播图' : '编辑轮播图',
        maskClosable : false,
        visible : wxBannerAddOrEditBannerModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : [
            <Button key="cancel" type="ghost" onClick={handleCancel}> 取 消 </Button>,
            <Button key="submit" type="primary"
                onClick={handleComplete}
                disabled={wxBannerAddOrEditBannerModalType == 'add' && wxBannerAddOrEditBannerModalWetherAdd.flag == false ? true : wxBannerAddOrEditBannerButtonLoading}
                loading={wxBannerAddOrEditBannerButtonLoading}
                style={{marginLeft:'10px'}}>
                保存
            </Button>

        ],
        className : 'zj_scrm_wx_banner_modal'
    };

    /*课程下拉列表*/
    let course = [];
    if(wxBannerAddOrEditBannerCourseSelectContent && wxBannerAddOrEditBannerCourseSelectContent.length > 0){
        course = wxBannerAddOrEditBannerCourseSelectContent.map((item,index) => {
            return(
                <Option key={index + ''} value={item.id + ''}>{item.name}</Option>
            );
        })
    }

    /*活动下拉列表*/
    let activity = [];
    if(wxBannerAddOrEditBannerActivitySelectContent && wxBannerAddOrEditBannerActivitySelectContent.length > 0){
        activity = wxBannerAddOrEditBannerActivitySelectContent.map((item,index) => {
            return(
                <Option key={index + ''} value={item.id + ''}>{item.name}</Option>
            );
        })
    }

    /*校区选择框属性*/
    let tenantOrgFilterProps = {
        width : 382.5,
        onChange : changeCampus,
        disabled : wxBannerAddOrEditBannerModalType == 'add' ? false : true,
    };

    let imgurlUploadProps = {
        name: 'file',
        // action: `${BASE_URL}/uploadController/upload`,
        action : '/thinknode/upload/image',
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                info.file.url = info.file.response.data.url;
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            let imgurl_list = getFieldValue('IMG');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张轮播图');
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片大小不大于2M!');
                return false;
            }
            return true;
        },
    };

    let url = wxBannerAddOrEditBannerModalContent && wxBannerAddOrEditBannerModalContent.picUrl && wxBannerAddOrEditBannerModalContent.picUrl !='' && wxBannerAddOrEditBannerModalContent.picUrl != undefined || wxBannerAddOrEditBannerModalContent.picUrl != null ? wxBannerAddOrEditBannerModalContent.picUrl : null;
    let displayImg = [{
        uid : -1,
        url : url,
        name : url,
        thumbUrl : url,
    }];

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    let uploadButton = (
    	<div>
    		<Icon type = 'plus' />
    		<div>选择图片</div>
    	</div>
    );

    //检查外链地址及方式
    function checkHref(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('外链地址不能为空'));
        }else{
            callback();
        }
    }

    //校验图片
    function checkImg(rule, value, callback){
        if(value == undefined || value == '' || value == null){
            callback(new Error('请选择图片'));
        }else{
            callback();
        }
    }

    /*检验是否只输入了空格*/
    function checkImgName(rule, value, callback){
        if(value == '' || value == undefined || value == null){
            callback();
        }else if(/^[\s]*$/.test(value)){
            callback(new Error('图片名称不能为空'));
        }else{
            callback();
        }
    }

    return (
        <div >
            <Modal {...modalOpts}>
                <Form className='zj_scrm_wx_banner_form'>
                    <div>
                        <FormItem
                            label="所属校区"
                            {...formItemLayout}
                            help={ wxBannerAddOrEditBannerModalType == 'add' && wxBannerAddOrEditBannerModalLetUChoose == true ? '请选择所属校区' : wxBannerAddOrEditBannerModalType == 'add' && wxBannerAddOrEditBannerModalWetherAdd.flag == true ? `该校区还可以增加${5-parseInt(wxBannerAddOrEditBannerModalWetherAdd.num)}个轮播图（校区选择一经保存，无法更改）`
                                :
                            wxBannerAddOrEditBannerModalType == 'add' && wxBannerAddOrEditBannerModalWetherAdd.flag == false ? <span style={{color:'#ff0000'}}>该校区轮播图已满5个，无法增加,请切换校区</span>
                                :
                            ''}
                        >
                            {getFieldDecorator('orgId', {
                                initialValue : wxBannerAddOrEditBannerModalContent.orgId || (window._init_data.firstOrg).key,
                                rules : [
                                    { required : true , message : '请选择所属校区' }
                                ]
                            })(
                                <TenantOrgFilter {...tenantOrgFilterProps}/>
                            )}
                        </FormItem>
                    </div>

                    { wxBannerAddOrEditBannerModalWetherAdd.flag == true || wxBannerAddOrEditBannerModalType == 'edit'?
                        <QueueAnim
                            type={['top', 'top']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                                <div key='wxBannerAddOrEditBannerModalWetherAddTrue'>
                                    <Spin tip='Loading' spinning={wxBannerAddOrEditBannerModalLoading}>
                                        <FormItem
                                            label="名称"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('title', {
                                                initialValue : wxBannerAddOrEditBannerModalContent.title || undefined,
                                                rules : [
                                                    { required : true , message : '请填写名称' },{validator: checkImgName},
                                                ]
                                            })(
                                                <Input size='default' placeholder='请填写名称'/>
                                            )}
                                        </FormItem>
                                        <div style={{position:'relative'}}>
                                            <span style={{position:'absolute',left:'35px',top:'7px',color:'#f04134'}}>*</span>
                                            <FormItem
                                                label="图片"
                                                help = "支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！"
                                                {...formItemLayout}
                                            >
                                                {getFieldDecorator('IMG', {
                                                    initialValue: displayImg[0].url != '' && displayImg[0].url != null && displayImg[0].url != undefined ? displayImg : null,
                                                    valuePropName: 'fileList',
                                                    normalize: normFile,
                                                    rules: [
                                                        {validator: checkImg},
                                                    ],
                                                })(
                                                    <Upload {...imgurlUploadProps} >
                                                         { getFieldValue('IMG') && getFieldValue('IMG').length >= 1 ?  null : uploadButton }
                                                    </Upload>
                                                )}
                                            </FormItem>
                                        </div>
                                        <FormItem
                                            label="排序值"
                                            help="设置0~9999中某个数字，数字大的排在前面，不填则默认为0"
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator('sort', {
                                                initialValue : wxBannerAddOrEditBannerModalContent.sort || undefined,
                                            })(
                                                <Input size='default' placeholder='请填写排序值'/>
                                            )}
                                        </FormItem>
                                        <FormItem
                                                {...formItemLayout}
                                                label="外链方式"
                                            >
                                                {getFieldDecorator('uriType',{
                                                    initialValue : wxBannerAddOrEditBannerModalType == 'edit' ? JSON.parse(wxBannerAddOrEditBannerModalContent.uri).type : wxBannerAddOrEditBannerModalHrefType,
                                                    rules : [
                                                        { required : true , message : '请选择外链方式' }
                                                    ]
                                                })(
                                                    <Select size='default' placeholder='请选择外链方式' onChange={WxBannerAddOrEditBannerModalChangeHrefType}>
                                                        <Option value = '0' >无</Option>
                                                        <Option value = '3' >自定义</Option>
                                                        <Option value = '2' >活动</Option>
                                                        <Option value = '1' >课程</Option>
                                                    </Select>
                                                )}
                                        </FormItem>
                                        { wxBannerAddOrEditBannerModalHrefType == '3' ?
                                            <QueueAnim
                                                type={['top', 'top']}
                                                ease={['easeOutQuart', 'easeInOutQuart']}
                                                className="common-search-queue" >
                                                <div key='wxBannerAddOrEditBannerModalHrefType_1'>
                                                    <FormItem
                                                        label="外链地址"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('href', {
                                                            initialValue : wxBannerAddOrEditBannerModalType == 'edit' && JSON.parse(wxBannerAddOrEditBannerModalContent.uri).type == wxBannerAddOrEditBannerModalHrefType ? JSON.parse(wxBannerAddOrEditBannerModalContent.uri).uri : undefined,
                                                            rules : [
                                                                { required : true , message : '请填写外链地址' },{validator: checkHref},
                                                            ]
                                                        })(
                                                            <Input size='default' placeholder='请填写外链地址(请以http://或https://开头)'/>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </QueueAnim>
                                            :
                                          wxBannerAddOrEditBannerModalHrefType == '2' ?
                                            <QueueAnim
                                                type={['top', 'top']}
                                                ease={['easeOutQuart', 'easeInOutQuart']}
                                                className="common-search-queue" >
                                                <div key='wxBannerAddOrEditBannerModalHrefType_2'>
                                                    <FormItem
                                                        label="选择活动"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('activity', {
                                                            initialValue : wxBannerAddOrEditBannerModalType == 'edit' && JSON.parse(wxBannerAddOrEditBannerModalContent.uri).type == wxBannerAddOrEditBannerModalHrefType ? JSON.parse(wxBannerAddOrEditBannerModalContent.uri).uri : undefined,
                                                            rules : [
                                                                { required : true , message : '请选择活动' },{validator: checkHref},
                                                            ]
                                                        })(
                                                            <Select
                                                                size='default'
                                                                placeholder='请选择活动'
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp="children"
                                                                notFoundContent="未找到活动">
                                                                { activity || [] }
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </QueueAnim>
                                            :
                                          wxBannerAddOrEditBannerModalHrefType == '1' ?
                                            <QueueAnim
                                                type={['top', 'top']}
                                                ease={['easeOutQuart', 'easeInOutQuart']}
                                                className="common-search-queue" >
                                                <div key='wxBannerAddOrEditBannerModalHrefType_3'>
                                                    <FormItem
                                                        label="选择课程"
                                                        {...formItemLayout}
                                                    >
                                                        {getFieldDecorator('course', {
                                                            initialValue : wxBannerAddOrEditBannerModalType == 'edit' && JSON.parse(wxBannerAddOrEditBannerModalContent.uri).type == wxBannerAddOrEditBannerModalHrefType ? JSON.parse(wxBannerAddOrEditBannerModalContent.uri).uri : undefined,
                                                            rules : [
                                                                { required : true , message : '请选择课程' },{validator: checkHref},
                                                            ]
                                                        })(
                                                            <Select
                                                                size='default'
                                                                placeholder='请选择课程'
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp="children"
                                                                notFoundContent="未找到课程">
                                                                { course || [] }
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </div>
                                            </QueueAnim>
                                            :
                                            null
                                        }
                                    </Spin>
                                </div>
                        </QueueAnim>
                        :
                        null
                    }
                </Form>
            </Modal>
        </div>
    );
};

export default Form.create()(WxBannerAddOrEditBanner);
