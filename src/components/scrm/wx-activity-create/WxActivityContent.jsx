import React from 'react';
import styles from './WxActivityContent.less';
import { Tabs, Form, Input, Upload, Icon, InputNumber, DatePicker, Select, Radio, Popconfirm, Button, message } from 'antd';
import moment from 'moment';
import QueueAnim from 'rc-queue-anim';
import RichEditor from '../../common/rich-editor/RichEditor';
import PageModal from '../micro-module/page-modal/PageModal';
import WxActivityPhoneReviewComponent from './WxActivityPhoneReview';
import WxActivityQrModalComponent from './WxActivityQrModal';
import WxActivityRemarkModalComponent from './WxActivityRemarkModal';
import WxActivitySuccessApplyModalComponent from './WxActivitySuccessApplyModal';
import TenantOrgSelect from '../../../pages/common/tenant-org-select/TenantOrgSelect';

const [RangePicker, Option, FormItem, RadioGroup, TabPane] = [DatePicker.RangePicker, Select.Option, Form.Item, Radio.Group, Tabs.TabPane];

function WxActivityContentComponent({

    attrHTMLValue,
    attrPageModal,
    attrQrCodeShow,
    attrQrUrl,
    attrTabActiveKey,
    attrModifyData,
    attrModify,
    attrSuccessDataSource,
    attrSuccessResultCount,
    attrSuccessPageIndex,
    attrSuccessPageSize,
    attrSuccessLoading,
    attrSuccessOrgId,
    attrApplyStatus,
    attrSuccessModalVisible,
    attrSuccessSearchVisible,
    attrRemark,
    attrRemarkModalVisible,
    attrSaveSuccess,
    attrCampusShowModal,
    attrCampusSelectIds,

    funcHandleOnSubmit,
    funcHandleClose,
    funcChangeParam,
    funcCloseQrUrlModal,
    funcSuccessFilterFunction,
    funcSuccessSearchFunction,
    funcSuccessClearFunction,
    funcExportSuccess,
    funcSuccessPageSizeChange,
    funcSuccessPageIndexChange,
    funcCloseSuccessApplyModal,
    funcCancelApply,
    funcToBeNumberOne,
    funcAddRemark,
    funcCancelAddRemark,
    funcConfirmAddRemark,
    functionSelectOrgIds,
    functionUpdateCampusParam,
    functionCloseCampusParam,

    form: {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        getFieldProps,
        validateFields,
        resetFields,
        setFields,
        getFieldError,
        validateFieldsAndScroll,
	}
}) {

    if (attrSaveSuccess) {
        resetFields();
    }

    function changePageMode(vue) {
        funcChangeParam({ attrTabActiveKey: vue })
    }

    let formItemLayoutHtml = {
        labelCol: { span: 0 },
        wrapperCol: { span: 24 }
    }

    let formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 15 }
    }

    //图片上传
    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    //图片数量限制
    let uploadButton = (
        <div>
            <Icon type='plus' />
            <div>选择图片</div>
        </div>
    );

    //验证图片大小
    function imgMaxSize(file, fileList, size, title) {     
        let fileSize = file.size;
        if (fileSize > 1048576 * size) {
            message.error(title + '大小不能超过' + size + 'M')
            return false;
        }
    };

    //活动封面
    let initActivityCover = [], initBannerPic = [], shareCover = [];

    if (attrModifyData && attrModifyData.activityCover && attrModifyData.activityCover.length > 0) {
        initActivityCover.push({
            uid: -1,
            url: attrModifyData.activityCover,
            status: 'done'
        })
    };

    if (attrModifyData && attrModifyData.shareCover && attrModifyData.shareCover.length > 0) {
        shareCover.push({
            uid: -1,
            url: attrModifyData.shareCover,
            status: 'done'
        })
    };
        
    //banner图片
    if (attrModifyData && attrModifyData.actBanner) {
        let initDetailPicArr = attrModifyData.actBanner.split(',');
        initDetailPicArr && initDetailPicArr.map(function (item, index) {
            initBannerPic.push({
                uid: -index * 100,
                url: item,
                status: 'done'
            })
        })
    };

    //活动报名时间
    let initApplyTime = [], initActivityTime = [], initCancelTime = '';
    if (attrModifyData && attrModifyData.applyStartTime && attrModifyData.applyStartTime != '') {
        initApplyTime.push(moment(new Date(attrModifyData.applyStartTime)))
    };
    if (attrModifyData && attrModifyData.applyEndTime && attrModifyData.applyEndTime != '') {
        initApplyTime.push(moment(new Date(attrModifyData.applyEndTime)));
    }

    //活动时间
    if (attrModifyData && attrModifyData.activityStartTime && attrModifyData.activityStartTime != '') {
        initActivityTime.push(moment(new Date(attrModifyData.activityStartTime)));
    }
    if (attrModifyData && attrModifyData.activityEndTime && attrModifyData.activityEndTime != '') {
        initActivityTime.push(moment(new Date(attrModifyData.activityEndTime)));
    }

    //取消报名截止时间
    if (attrModifyData && attrModifyData.cancelTime && attrModifyData.cancelTime != '') {
        initCancelTime = moment(new Date(attrModifyData.cancelTime))
    }

    function handleClose() {
        resetFields();
        changePageMode && changePageMode('baseSet');
        funcHandleClose();
    }
    
    function handleOnSubmit() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                for (let key in err) {
                    if (key == 'form_activity_share_intro' || key == 'form_activity_share_title' || key == 'form_activity_share_pic') {
                        changePageMode && changePageMode('shareSet');
                    } else if (key == 'form_activity_money_html_content') {
                        changePageMode && changePageMode('contentSet');
                    } else {
                        changePageMode && changePageMode('baseSet');
                    }
                    return;
                }
            }

            //数据处理
            let params = {};

            let data = getFieldsValue();

            if (attrHTMLValue == '' || attrHTMLValue == undefined) {
                //是否是修改活动
                if (attrModify) {
                    if (attrModifyData.actHtml == undefined || attrModifyData.actHtml.length == 0) {
                        return message.error('请输入内容');
                    } 
                } else {
                    return message.error('请输入内容');
                }                
            } 

            if (data.form_activity_time && data.form_activity_time.length) {
                let m = data.form_activity_time;
                params.activityStartTime = moment(m[0]).format('YYYY-MM-DD HH:mm:00');
                params.activityEndTime = moment(m[1]).format('YYYY-MM-DD HH:mm:00');
            }

            if (data.form_activity_apply_time && data.form_activity_apply_time.length) {
                let m = data.form_activity_apply_time;
                params.applyStartTime = moment(m[0]).format('YYYY-MM-DD HH:mm:00');
                params.applyEndTime = moment(m[1]).format('YYYY-MM-DD HH:mm:00');
            }

            if (data.form_activity_cancel_time) {
                let m = data.form_activity_cancel_time;
                params.cancelTime = moment(m).format('YYYY-MM-DD HH:mm:00');
            }

            //分享图片
            if (data.form_activity_share_pic && data.form_activity_share_pic.length) {
                let d = data.form_activity_share_pic[0];
                if (d && d.response && d.response.errorCode == 9000) {
                    params.shareCover = d.response.data && d.response.data.url || '';
                } else {
                    params.shareCover = d.url;
                }
            } 
            if (data.form_activity_cover && data.form_activity_cover.length) {
                    let d = data.form_activity_cover[0];
                    if (d && d.response && d.response.errorCode == 9000) {
                        params.activityCover = d.response.data && d.response.data.url || '';
                    } else {
                        params.activityCover = d.url;
                    }
            } 
            if (data.form_activity_banner && data.form_activity_banner.length) {
                let bannerArr = [];
                data.form_activity_banner.map((item, index) => {
                    if (item.response && item.response.errorCode === '9000' || item.response && item.response.errorCode === 9000) {
                        bannerArr.push(item.response && item.response.data.url);
                    } else {
                        bannerArr.push(item.url);
                    }
                })
                params.actBanner = bannerArr.join(',');
            }

            params.name = data.form_activity_name;
            params.actHtml = attrHTMLValue || (attrModifyData.actHtml || '');
            params.sort = data.form_activity_sort;
            params.address = data.form_activity_address;
            params.targetPeople = data.form_activity_target_people;
            params.materialFee = data.form_activity_material_fee || 0;
            params.applyType = data.form_activity_apply_type;
            params.classCus = data.form_activity_apply_class_cus || 0;
            params.activityType = data.form_activity_activity_type;
            params.vipSet = data.form_activity_vip_set;
            params.number = data.form_activity_number || 0;
            params.enablePay = data.form_activity_money_set || '0';
            params.payAmount = data.form_activity_money_number;
            params.id = attrModifyData.id || '';
            

            //分享
            params.shareTitle = data.form_activity_share_title;
            params.shareInfo = data.form_activity_share_intro;

            //等位
            params.waiting = data.form_activity_waiting_list;
            params.participate = data.form_activity_participate_list;
            params.orgIds = data.form_activity_orgIds;

            //window._current_user_info && window._current_user_info.orgId || '';

            funcHandleOnSubmit(params);
        
        });
    }

    function funcCloseModal() {
        funcCloseQrUrlModal()
    }

    let qrProps = {
        attrQrCodeShow,
        attrQrUrl,
        funcCloseModal,
    }

    let remarkProps = {
        attrRemark,
        attrRemarkModalVisible,
        funcCancelAddRemark,
        funcConfirmAddRemark,
    }

    let applyProps = {
        attrSuccessModalVisible,
        attrSuccessDataSource,
        attrSuccessResultCount,
        attrSuccessPageIndex,
        attrSuccessPageSize,
        attrSuccessLoading,
        attrSuccessOrgId,
        attrSuccessSearchVisible,
        attrRemarkModalVisible,
        funcCancelApply,
        funcToBeNumberOne,
        funcAddRemark,
        funcSuccessFilterFunction,
        funcSuccessSearchFunction,
        funcSuccessClearFunction,
        funcExportSuccess,
        funcSuccessPageSizeChange,
        funcSuccessPageIndexChange,
        funcCloseSuccessApplyModal,
    }

    //校区选择框属性
    let tenantOrgSelectProps = {
        visible: attrCampusShowModal,
        onClose: functionCloseCampusParam,
        afterSubmit: function (vue) {
            setFieldsValue({ 'form_activity_orgIds': vue.join(',') });
            functionUpdateCampusParam && functionUpdateCampusParam(vue);
        },
        init_org_select: attrCampusSelectIds || [],
        // useThisDataSource: campusProps && campusProps.useThisDataSource,
        // checkStrictly: campusProps && campusProps.checkStrictly,
        disabled: attrModify,
        no_select_campus: attrModify,
    };

    let baseComponent = (
        <TabPane tab="基础设置" key="baseSet">
            <Form style={{ textAlign: 'left' }}>
                <FormItem {...formItemLayout} label="校区选择" style={{ textAlign: 'left' }}>
                    <span style={{ 'color': '#5D9CEC', 'marginRight': '10px' }}>{attrCampusSelectIds && attrCampusSelectIds.length || '0'}<span className={styles.noneCampus}>校区</span></span>
                    {getFieldDecorator('form_activity_orgIds', {
                        initialValue: attrModifyData.orgIds || '',
                        rules: [
                            { required: true, message: '请选择校区' }
                        ]
                    })(
                        <span className={styles.reviewCampus}onClick={() => functionSelectOrgIds()}>{attrModify ? '查看校区' : '选择校区'}</span>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="活动名称" style={{ textAlign: 'left' }}>
                    {getFieldDecorator('form_activity_name', {
                        initialValue: attrModifyData.name || '',
                        rules: [
                            { required: true, message: '请输入活动名称' }
                        ]
                    })(
                        <Input style={{ width: '440px' }} size='default' placeholder='请输入活动名称' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout}
                    label="活动封面"
                    help="活动首图, 支持png、jpeg、gif格式的图片, 建议宽高 350*350px; 图片≤2M"
                >
                    {getFieldDecorator('form_activity_cover', {
                        initialValue: initActivityCover || [],
                        valuePropName: 'fileList',
                        action: '/thinknode/upload/image',
                        normalize: normFile,
                        rules: [
                            { required: true, message: '请上传活动封面' }
                        ]
                    })(
                        <Upload
                            action='/thinknode/upload/image'
                            listType="picture-card"
                            beforeUpload={(file, fileList) => imgMaxSize(file, fileList, 2, '活动封面')}
                        >
                            {getFieldValue('form_activity_cover') && getFieldValue('form_activity_cover').length >= 1 ? null : uploadButton}
                        </Upload>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout}
                    label="轮播图片"
                    help="轮播图, 最多5张; 支持png、jpeg、gif格式的图片, 建议宽高 750*400px; 图片≤2M"
                >
                    {getFieldDecorator('form_activity_banner', {
                        initialValue: initBannerPic || [],
                        valuePropName: 'fileList',
                        action: '/thinknode/upload/image',
                        normalize: normFile,
                        rules: [
                            { required: true, type: 'array', message: '请上传轮播图图片' }
                        ]
                    })(
                        <Upload
                            action='/thinknode/upload/image'
                            listType="picture-card"
                            beforeUpload={(file, fileList) => imgMaxSize(file, fileList, 2, '轮播图片')}
                        >
                            {getFieldValue('form_activity_banner') && getFieldValue('form_activity_banner').length >= 5 ? null : uploadButton}
                        </Upload>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='报名时间'
                    help='允许用户报名的时间'
                >
                    {getFieldDecorator('form_activity_apply_time', {
                        initialValue: initApplyTime || undefined,
                        rules: [
                            { type: 'array', required: true, message: '请选择报名时间' }
                        ]
                    })(
                        <RangePicker style={{ width: '440px' }} size='default' showTime format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='活动时间'
                >
                    {getFieldDecorator('form_activity_time', {
                        initialValue: initActivityTime || undefined,
                        rules: [
                            { type: 'array', required: true, message: '请选择活动时间' }
                        ]
                    })(
                        <RangePicker style={{ width: '440px' }} size='default' showTime format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='活动地点'
                >
                    {getFieldDecorator('form_activity_address', {
                        initialValue: attrModifyData.address || '',
                        rules: [
                            { required: true, message: '请输入活动地址' }
                        ]
                    })(
                        <Input style={{ width: '440px' }} size='default' placeholder='请输入活动地址' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='活动人数'
                    help='必填项, 创建之后无法修改'
                >
                    {getFieldDecorator('form_activity_number', {
                        initialValue: attrModifyData.number || '',
                        rules: [
                            { required: true, message: '请输入活动人数' }
                        ]
                    })(
                        <InputNumber disabled={attrModify || false} min={1} style={{ width: '440px' }} size='default' placeholder='请输入活动人数' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='活动类型'
                    help='必填项, 创建之后无法修改'
                >
                    {getFieldDecorator('form_activity_activity_type', {
                        initialValue: attrModifyData.activityType || undefined,
                        rules: [
                            { required: true, message: '请选择活动类型' }
                        ]
                    })(
                        <Select
                            size='default'
                            allowClear
                            placeholder='请选择活动类型'
                            disabled={attrModify || false}
                            style={{ width: '440px' }}
                        >
                            <Option value='1' >会员专属活动</Option>
                            <Option value='2' >通用活动</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='报名缴费'
                >
                    {getFieldDecorator('form_activity_apply_type', {
                        initialValue: attrModifyData.applyType || undefined,
                        rules: [
                            { required: true, message: '请选择报名缴费类型' }
                        ]
                    })(
                        <Select
                            size='default'
                            allowClear
                            placeholder='请选择报名缴费类型'
                            style={{ width: '440px' }}
                        >
                            <Option value='1' >消耗课时 + 物料费</Option>
                            <Option value='2' >消耗课时</Option>
                            <Option value='3' >物料费</Option>
                            <Option value='4' >免费</Option>
                        </Select>
                        )}
                </FormItem>
                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}
                    style={{ width: '100%' }}
                >
                    {(getFieldValue('form_activity_apply_type') == '1' || getFieldValue('form_activity_apply_type') == '2') &&
                        <FormItem
                            key='apply_type_course'
                            { ...formItemLayout }
                            label='消耗课时'
                        >
                            {getFieldDecorator('form_activity_apply_class_cus', {
                                initialValue: attrModifyData.classCus || '',
                                rules: [
                                    { required: true, message: '请输入消耗课时' }
                                ]
                            })(
                                <InputNumber min={1} style={{ width: '440px' }} size='default' placeholder='请输入消耗课时数' />
                                )}
                        </FormItem>
                    }
                </QueueAnim>
                <QueueAnim
                    type={['top', 'top']}
                    ease={['easeOutQuart', 'easeInOutQuart']}
                    style={{ width: '100%' }}
                >
                    {(getFieldValue('form_activity_apply_type') == '1' || getFieldValue('form_activity_apply_type') == '3') &&
                        <FormItem
                            key='apply_type_prize'
                            { ...formItemLayout }
                            label='物料费'
                        >
                            {getFieldDecorator('form_activity_material_fee', {
                                initialValue: attrModifyData.materialFee || '',
                                rules: [
                                    { required: true, message: '请输入物料费, 单位元' }
                                ]
                            })(
                                <InputNumber min={1} style={{ width: '440px' }} size='default' placeholder='请输入物料费, 单位元' />
                            )}
                        </FormItem>

                    }
                </QueueAnim>

                <FormItem
                    { ...formItemLayout }
                    label='活动对象'
                >
                    {getFieldDecorator('form_activity_target_people', {
                        initialValue: attrModifyData.target || '',
                        rules: [
                            { required: true, message: '请输入活动对象' }
                        ]
                    })(
                        <Input style={{ width: '440px' }} size='default' placeholder='请输入活动对象' />
                    )}
                </FormItem>

                <FormItem
                    { ...formItemLayout }
                    label='取消报名'
                >
                    {getFieldDecorator('form_activity_cancel_time', {
                        initialValue: initCancelTime || undefined,
                        rules: [
                            { type: 'object', message: '请选择活动时间' }
                        ]
                    })(
                        <DatePicker style={{ width: '440px' }} size='default' showTime format="YYYY-MM-DD HH:mm:ss" placeholder='允许用户取消报名的最晚时间' />
                    )}
                </FormItem>

                <FormItem
                    { ...formItemLayout }
                    label='排序值'
                >
                    {getFieldDecorator('form_activity_sort', {
                        initialValue: attrModifyData.sort || '',
                    })(
                        <InputNumber min={0} max={9999} size='default' style={{ width: '440px' }} placeholder='设置为0~9999中某个数字, 用户浏览列表是排序值大的在前' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='报名名单'
                >
                    {getFieldDecorator('form_activity_participate_list', {
                        initialValue: String(attrModifyData.participate == 0 ? '0' : 1) || '0',
                        rules: [
                            { required: true, message: '是否显示报名名单' }
                        ]
                    })(
                        <RadioGroup style={{ width: '250px' }} >
                            <Radio value="1" >显示</Radio>
                            <Radio value="0" >不显示</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='等位名单'
                >
                    {getFieldDecorator('form_activity_waiting_list', {
                        initialValue: String(attrModifyData.waiting == 0 ? '0' : 1) || '0',
                        rules: [
                            { required: true, message: '是否显示等位名单' }
                        ]
                    })(
                        <RadioGroup style={{ width: '250px' }} >
                            <Radio value="1" >显示</Radio>
                            <Radio value="0" >不显示</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='标记学员'
                >
                    {getFieldDecorator('form_activity_vip_set', {
                        initialValue: attrModifyData.vipSet || '1',
                        rules: [
                            { required: true, message: '是否允许用户自主标记学员' }
                        ]
                    })(
                        <RadioGroup style={{ width: '300px' }} >
                            <Radio value="1" >允许</Radio>
                            <Radio value="0" >不允许</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='支付金额'
                >
                    {getFieldDecorator('form_activity_money_set', {
                        initialValue: attrModifyData.enablePay || '0',
                        rules: [
                            { required: true, message: '选择是否支付' }
                        ]
                    })(
                        <RadioGroup style={{ width: '250px' }} >
                            <Radio value="1" >开启</Radio>
                            <Radio value="0" >不开启</Radio>
                        </RadioGroup>
                        )}
                </FormItem>
            </Form>
            {
                getFieldValue('form_activity_money_set') == '1' ?
                    <Form>
                        <FormItem
                            { ...formItemLayout }
                            label='支付金额'
                        >
                            {getFieldDecorator('form_activity_money_number', {
                                initialValue: attrModifyData.payAmount || 0.01,
                                rules: [
                                    { required: true, message: '填写大于0的金额' },
                                ]
                            })(
                                <InputNumber precision={2} step={0.01} min={0.01} style={{ width: '440px' }} size='default' placeholder='请输大于0的金额' />
                            )}
                        </FormItem>
                    </Form>
                    :
                    ''
            }
        </TabPane>
    )

    let jsonArr = [], element = '';

    if (attrModifyData.oldDetail && attrModifyData.oldDetail != '') {
        let jsonData = JSON.parse(attrModifyData.oldDetail);
        if (jsonData.length > 0) {
            jsonData.map((item, index) => {
                item.content && item.content.map((jsonItem, jsonIndex) => {
                    //内容只有一条
                    if (item.content.length == 1) {
                        jsonArr.push(`<p>${item.title || ''}</p></br/><ul><br/><li>${jsonItem.contentDetail || ''}</li></ul>`);
                    } else {
                        //内容结束
                        if (jsonIndex === item.content.length - 1) {
                            jsonArr.push(`<li>${jsonItem.contentDetail || ''}</li><br/></ul>`);
                        } else {
                            //内容开始
                            if (jsonIndex) {
                                //非第一条
                                jsonArr.push(`<li>${jsonItem.contentDetail || ''}</li>`);
                            } else {
                                //第一条
                                jsonArr.push(`<p>${item.title || ''}</p></br/><ul><li>${jsonItem.contentDetail || ''}</li>`);
                            }
                        }
                    }
                })                
            })
        }

        jsonArr.length && jsonArr.map((item, index) => {
            element = `${element}${item}`;
        })
    }

    function functionChangeHTML(html) {
        funcChangeParam({ attrHTMLValue: html})
    }
    
    let contentComponent = (
        <TabPane tab="内容设置" key="contentSet">
            {!attrSaveSuccess 
            ? <RichEditor value={attrHTMLValue != undefined ? attrHTMLValue : (element || attrModifyData.actHtml)} onChange={functionChangeHTML} /> 
            : <div></div>}
        </TabPane >
    )

    let shareComponent = (
        <TabPane tab="分享设置" key="shareSet">
            <Form>
                <FormItem
                    { ...formItemLayout }
                    label='分享标题'
                >
                    {getFieldDecorator('form_activity_share_title', {
                        initialValue: attrModifyData.shareTitle || undefined,
                        rules: [
                            { required: true, message: '分享标题为1-40个字', max: 40, min: 1 }
                        ]
                    })(
                        <Input style={{ width: '100%' }} size='default' placeholder='请输入分享标题（1～40个字）' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='分享简介'
                >
                    {getFieldDecorator('form_activity_share_intro', {
                        initialValue : attrModifyData.shareInfo || undefined,
                        rules: [
                            { required: true, message: '分享简介为1-80个字', max: 80, min: 1 }
                        ]
                    })(
                        <Input style={{ width: '100%' }} type="textarea" size='default' placeholder='请输入分享简介（1～80个字）' />
                    )}
                </FormItem>
                <FormItem
                    { ...formItemLayout }
                    label='分享图片'
                >
                
                    {getFieldDecorator('form_activity_share_pic', {
                        initialValue: shareCover || [],
                        valuePropName: 'fileList',
                        action: '/thinknode/upload/image',
                        normalize: normFile,
                        rules: [
                            { required: true, message: '请上传分享图片' }
                        ]
                    })(
                        <Upload
                            action='/thinknode/upload/image'
                            listType="picture-card"
                            beforeUpload={(file, fileList) => imgMaxSize(file, fileList, 2, '分享图片')}
                        >
                        {getFieldValue('form_activity_share_pic') && getFieldValue('form_activity_share_pic').length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                </FormItem>
            </Form >
        </TabPane >
    )

    let dataSource = getFieldsValue();

    dataSource.html = attrHTMLValue != undefined ? attrHTMLValue : (element || attrModifyData.actHtml);
    
    return (
        <PageModal
            visible={attrPageModal}
            maskClosable={false}
            title={getFieldValue('form_activity_name') || ''}
            width="calc(100vw - 150px)"
            onClose={handleClose}
            footer={[
                <Popconfirm title="确定要保存吗?" onConfirm={handleOnSubmit} placement="bottomRight" >
                    <Button type="primary" loading={false} 
                        disabled={attrModify ? attrModifyData && (attrModifyData.isHq === 0 || attrModifyData.isHq === false) : false}>提交
                    </Button>
                </Popconfirm>,
                <Popconfirm title="确定要关闭窗口吗?" onConfirm={handleClose} placement="bottomRight" >
                    <Button type="ghost">关闭</Button>
                </Popconfirm>
            ]}
        >
            <div className="baseContent">
                <div className={styles.styleTabBar}>
                    <Tabs onChange={changePageMode} activeKey={attrTabActiveKey || 'baseSet'}>
                        {baseComponent}
                        {contentComponent}
                        {shareComponent}
                    </Tabs>
                </div>
            </div>
            <WxActivityPhoneReviewComponent dataSource={dataSource} />
            <WxActivityQrModalComponent {...qrProps} />
            <WxActivitySuccessApplyModalComponent {...applyProps} />
            <WxActivityRemarkModalComponent {...remarkProps} />
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </PageModal>
    )
}

export default Form.create()(WxActivityContentComponent); 
