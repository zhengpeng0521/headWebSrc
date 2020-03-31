import React from 'react';
import { Form, Input, Modal, Button, message, Select, Cascader, Spin, Upload, Icon, Radio, InputNumber } from 'antd';
import OSS from 'ali-oss';
import { ProgressBar, NewProgress } from '../../../common/new-component/NewComponent';
import TreeSelectCourseware from '../../../common/new-component/tree-select-courseware/TreeSelectCourseware';
import TreeOrgCheckSelect from '../../../common/new-component/tree-org-check-select/TreeOrgCheckSelect';
import BumenCheckSelect from '../../../common/new-component/bumenCheckSelect/bumenCheckSelect';
import { getAliToken, uploadCourse, uploadPdf } from '../../../../services/campus-service/courseware/Courseware';
import styles from './ReleaseCoursewareModal.less';
import ReleaseFileType from './ReleaseFileType.json';       //文件限制类型

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

/*发布课件modal*/
const ReleaseCoursewareModal = ({
    releaseCoursewareDetailLoading,            //详情加载按钮
    dp,                                         //封装dispatch方法
    releaseCoursewareModalVisible,              //modal是否显示
    releaseCoursewareModalLoading,              //表单加载状态
    releaseCoursewareModalButtonLoading,        //提交按钮加载状态
    ReleaseCoursewareModalSubmit,               //发布课件提交
    ReleaseCoursewareModalClose,                //关闭发布课件modal

    changeClassType,                           //选择按钮事件
    TypeStatus,

    //选择校区
    OpenCloseChooseMgrOrgModal,         //打开选择管辖校区modal
    AfterSelectCampusModalSubmit,       //添加校区选择完毕点击保存
    selectCampusModalVisible,           //选择校区modal是否显示
    selectCampus,                       //默认添加的校区选项

    //选择分组
    OpendepartmentModal,
    AfterDepartmentModalSubmit,
    departmentModalVisible,
    departmentIds,

    CoursewareDetailInfo,               //详情数据
    orgIdsOnChange,                     //校区全部与部分的选择
    orgIdsOnChangeStatus,
    ReleaseCoursewareModalEdit,         //编辑提交

    disabled,
    disabled1,

    progress,

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

    //详情数据存在时渲染课件数据
    function handleComplete (e) {
        e.preventDefault();
        validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            if (values.sourcePath == undefined || values.sourcePath == null) {
                message.error('请选择上传课件');
                return;
            }
            if (TypeStatus == '0') {
                values.timeOut = '-1'
            }
            delete values.courseware_name;
            delete values.progress;
            delete values.expire;
            values.fileName = getFieldValue('courseware_name');
            if (orgIdsOnChangeStatus == '2') {
                if (selectCampus.length == 0) {
                    message.error('请选择校区');
                    return;
                } else {
                    values.orgIds = selectCampus.join(',');
                }
            }
            if (orgIdsOnChangeStatus == '3') {
                if (departmentIds.length == 0) {
                    message.error('请选择分组');
                    return;
                } else {
                    values.deptIds = departmentIds.join(',');
                }
            }
            values.allVisible = orgIdsOnChangeStatus;
            values.orgId = window._init_data.orgId;
            if (!!CoursewareDetailInfo && !!CoursewareDetailInfo.id) {
                values.id = CoursewareDetailInfo.id;
                values.uid = CoursewareDetailInfo.uid;
                ReleaseCoursewareModalEdit(values); //编辑
            } else {
                ReleaseCoursewareModalSubmit(values); //新增
            }
            //            console.log('==',values)
            //
        });
    }


    function handleCancel (e) {
        e.preventDefault();
        resetFields();
        ReleaseCoursewareModalClose();
    }
    /*校区选择框属性*/
    let TreeOrgCheckSelectProps = {
        multiple: false,
        visible: selectCampusModalVisible,
        onClose: OpenCloseChooseMgrOrgModal,
        afterSubmit: AfterSelectCampusModalSubmit,                  /*校区选中后的回调*/
        init_org_select: selectCampus,
        disabled: false
    };
    //分组选择属性
    let BumenCheckSelectProps = {
        multiple: false,
        visible: departmentModalVisible,
        onClose: OpendepartmentModal,
        afterSubmit: AfterDepartmentModalSubmit,                  /*校区选中后的回调*/
        init_org_select: departmentIds,
        disabled: false,
        type: 'group'
    }
    //查看文件类型
    function checkFileType (fileName) {
        let lastPointIndex = 0;
        let fileType = undefined;
        let flag = false;
        //取到最后一个'.'出现的位置(最后一个'.'后面即是文件类型)
        for (let i = 0, len = fileName.length; i < len; i++) {
            if (fileName[i] == '.') {
                lastPointIndex = i;
            }
        }
        //获取上传文件的文件类型
        fileType = fileName.substr(lastPointIndex + 1);
        //遍历寻找是否匹配文件类型(open表示是否开启可上传权限,true表示开启权限)
        for (let i = 0, ilen = ReleaseFileType.length; i < ilen; i++) {
            if (ReleaseFileType[i].content && ReleaseFileType[i].content.length > 0 && !!ReleaseFileType[i].open && ReleaseFileType[i].content.indexOf(fileType) > -1) {
                setFieldsValue({ type: ReleaseFileType[i].type })          //设置文件类型
                flag = true;
                break;
            }
        }
        return flag;
    }

    //模态框的属性
    let modalOpts = {
        title: '发布课件',
        maskClosable: false,
        visible: releaseCoursewareModalVisible,
        closable: true,
        width: 600,
        onOk: handleComplete,
        onCancel: handleCancel,
        footer: !!getFieldValue('progress') ? [] : [
            <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
            <Button key="submit" type="primary"
                onClick={handleComplete}
                disabled={releaseCoursewareModalLoading}
                loading={releaseCoursewareModalLoading}
                style={{ marginLeft: 10 }}>发布</Button>
        ],
        className: 'release_courseware_modal'
    };

    // 自定义上传
    async function customRequest({
        file,
    }){
        setFieldsValue({ progress: true })
        try{
            // 校验
            let result = await uploadCourse({fileSize: file.size})
            if(result && result.ret && result.ret.errorCode == 9000){
                // 获取token
                let { ret } = await getAliToken()
                let aliToken = {}
                if(ret && ret.Credentials){
                    aliToken = ret.Credentials
                }
                const client = new OSS({
                    region: 'oss-cn-hangzhou',
                    accessKeyId: aliToken.AccessKeyId,
                    accessKeySecret: aliToken.AccessKeySecret,
                    stsToken: aliToken.SecurityToken,
                    bucket: 'jpss-crm'
                });
                client.multipartUpload
                // 上传文件
                let timestamp = (new Date()).valueOf()
                let lastName = timestamp + '.' + file.name.substring(file.name.lastIndexOf('.') + 1)
                let info = await client.multipartUpload(`${window._init_data.tenantId}/${lastName}`, file, {
                    progress: async function (p, checkpoint) {
                        // 断点记录点。 浏览器重启后无法直接继续上传，需用户手动触发进行设置。
                        // console.log(checkpoint, p)
                        dp('courseware/updateState', { progress: p })
                    }
                })
                let url = info.res.requestUrls[0].substring(0, info.res.requestUrls[0].lastIndexOf('?'))
                setFieldsValue({
                    progress: false,
                    courseware_name: file.name,
                    size: file.size,
                    url: url,
                    sourcePath: url,
                    // ratio: '',
                });
                message.success(`${file.name}上传成功`);
            } else {
                message.error(`${file.name}校验失败`);
            }
        } catch (e) {
            console.error('error: ', e);
            message.error(`${file.name}上传失败`);
        }

        setFieldsValue({ progress: false });
    }

    //上传文件属性
    let uploadProps = {
        name: 'file',
        withCredentials: true,
        // customRequest,
        action: `${BASE_URL}/crm/hq/uploadCourseware`,
        showUploadList: false,
        onChange: (info) => {
            if(info.file.name.indexOf('.mp4') > -1 || info.file.name.indexOf('.mp3') > -1 ||
                info.file.name.indexOf('.avi') > -1 || info.file.name.indexOf('.flv') > -1 ||
                info.file.name.indexOf('.wmv') > -1 || info.file.name.indexOf('.rmvb') > -1){
                return false
            }
            setFieldsValue({ progress: true });
            // 假装加载进度
            let newP = 0
            var interval = setInterval(() => {
                newP += 0.05
                if(newP >= 1) {
                    newP = 0.99
                    clearInterval(interval)
                }

                dp('courseware/updateState', { progress: newP })
            }, 50)

            if (info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                setFieldsValue({ progress: false });
                return message.error(info.file.response.errorMessage);
            }
            if (info.file.status === 'done' && info.file.response.errorCode == 9000) {
                window.serviceRequest(`${BASE_URL}/crm/hq/courseware/IsComplete`, { key: info.file.response.data.key }, pollSuc, pollFail);
                function pollSuc (res) {
                    function time () { return setTimeout(window.serviceRequest, 2000, `${BASE_URL}/crm/hq/courseware/IsComplete`, { key: info.file.response.data.key }, pollSuc, pollFail); }
                    if (!!res.complete) {
                        clearTimeout(time);
                        dp('courseware/updateState', { progress: 1 })
                        setFieldsValue({
                            progress: false,
                            courseware_name: info.file.name,
                            size: info.file.size,
                            url: res.imgUrl,
                            sourcePath: res.sourcePath,
                            ratio: res.ratio,
                        });
                        return message.success(`${info.file.name}上传成功`);
                    } else {
                        time();
                    }
                }
                function pollFail (res) {
                    setFieldsValue({ progress: false });
                    return message.error(res && res.errorMessage ? res.errorMessage : `${info.file.name}上传失败`);
                }
            }
            if (info.file.status === 'error') {
                setFieldsValue({ progress: false });
                return message.error(`${info.file.name}上传失败`);
            }
        },
        beforeUpload: (file, fileList) => {
            // if ((file.size / 1024 / 1024) > 100) {
            //     message.warn('上传文件超过限制');
            //     return false;
            // }
            dp('courseware/updateState', { progress: 0 })
            if(!(file.name.indexOf('.pdf') > -1 || file.name.indexOf('.ppt') > -1 || file.name.indexOf('.pptx') > -1)){
                customRequest({file})
                return false
            }
            //            if(!checkFileType(file.name)){
            //                message.warn('上传文件类型不正确');
            //                return false;
            //            }
        }
    };

    function normFile (e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    function onChange () {

    }

    return (

        <Modal {...modalOpts}>
            <Spin spinning={releaseCoursewareDetailLoading}>
                {/*上传文件时进度条*/}
                <FormItem style={{ display: 'none' }}>
                    {getFieldDecorator('progress', {
                        initialValue: false
                    })(
                        <Input type='hidden' />
                    )}
                </FormItem>
                {/* {!!getFieldValue('progress') ? <ProgressBar visible={getFieldValue('progress')} content='课件上传中' height='250px' /> : null} */}
                {!!getFieldValue('progress') ? <NewProgress height='250px' label='课件上传中' percent={progress} /> : null}
                {/*此处必须采取display或者visibity来隐藏，不然会打断upload的onChange事件*/}
                <div style={{ display: !!getFieldValue('progress') ? 'none' : 'block' }}>
                    <Spin spinning={releaseCoursewareModalLoading}>
                        {/*上传文件大小*/}
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('size', {
                                initialValue: CoursewareDetailInfo.size,
                            })(
                                <Input type='hidden' />
                            )}
                        </FormItem>
                        {/*上传文件类型(1文档/2图片/3视频)*/}
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('type', {
                                initialValue: CoursewareDetailInfo.type,
                            })(
                                <Select>
                                    {ReleaseFileType && ReleaseFileType.map((item, index) => <Option key={item.type} value={item.type}>{item.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        {/*上传文件路径*/}
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('url', {
                                initialValue: CoursewareDetailInfo.url,
                            })(
                                <Input type='hidden' />
                            )}
                        </FormItem>
                        {/*上传文件原路径*/}
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('sourcePath', {
                                initialValue: CoursewareDetailInfo.sourcePath,
                            })(
                                <Input type='hidden' />
                            )}
                        </FormItem>
                        {/*上传文件宽高比(宽/高)*/}
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('ratio', {
                                initialValue: CoursewareDetailInfo.ratio,
                            })(
                                <Input type='hidden' />
                            )}
                        </FormItem>
                        {
                            /*<FormItem
                            label = "开设校区"
                            {...formItemLayout}
                            style = {{ marginBottom : '10px' , lineHeight : '30px' }}
                        >
                            {getFieldDecorator('orgIds',{
                            })(
                                <div>
                                    <Button size = 'small' type = 'primary' onClick = { OpenCloseChooseMgrOrgModal } style = {{ marginRight : 10 }}>
                                       选择校区
                                    </Button>
                                    <a onClick = { OpenCloseChooseMgrOrgModal }>已选{ selectCampus && selectCampus.length > 0 ? selectCampus.length : 0 }家</a>
                                </div>
                            )}
                        </FormItem>*/
                        }
                        <FormItem
                            label="开设校区"
                            {...formItemLayout}
                            style={{ marginBottom: '10px', lineHeight: '30px', display: 'flex', position: 'relative' }}
                        >
                            {getFieldDecorator('allVisible', {
                                initialValue: orgIdsOnChangeStatus,
                            })(
                                <RadioGroup onChange={orgIdsOnChange} >
                                    <Radio value='1' >全部</Radio>
                                    <Radio value='3' >课件分组</Radio>
                                    <Radio value='2' style={{ marginLeft: '120px' }}>校区</Radio>
                                </RadioGroup>
                            )}
                            <div style={{ position: 'absolute', top: '0', left: '140px' }}>
                                <Button disabled={disabled1} size='small' type='primary' onClick={OpendepartmentModal} style={{ marginRight: 4 }}>
                                    选择分组
                            </Button>
                                <a disabled={disabled1} onClick={OpendepartmentModal}>已选{departmentIds && departmentIds.length > 0 ? departmentIds.length : 0}个</a>
                            </div>
                            <div style={{ position: 'absolute', top: '0', left: '320px' }}>
                                <Button disabled={disabled} size='small' type='primary' onClick={OpenCloseChooseMgrOrgModal} style={{ marginRight: 4 }}>
                                    选择校区
                            </Button>
                                <a disabled={disabled} onClick={OpenCloseChooseMgrOrgModal}>已选{selectCampus && selectCampus.length > 0 ? selectCampus.length : 0}家</a>
                            </div>
                        </FormItem>
                        <FormItem
                            label="课件名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('name', {
                                initialValue: CoursewareDetailInfo.name,
                                rules: [
                                    { required: true, message: '请填写课件名称' },
                                ],
                            })(
                                <Input placeholder='请填写课件名称' size='default' />
                            )}
                        </FormItem>
                        <FormItem
                            label="课件分类"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('cat', {
                                initialValue: CoursewareDetailInfo.cat,
                                rules: [
                                    { required: true, message: '请选择课件分类' },
                                ],
                            })(
                                <TreeSelectCourseware width='100%' />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label='是否过期'
                        >
                            {getFieldDecorator('expire', {
                                initialValue: TypeStatus,
                                rules: [
                                    { required: true, message: '请选择是否过期' }
                                ]
                            })(
                                <RadioGroup onChange={changeClassType} style={{ marginTop: '6px' }} disabled={!!CoursewareDetailInfo.timeOut ? true : false}>
                                    <Radio value='0' >永久有效</Radio>
                                    <Radio value='1' >指定有效天数</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        {TypeStatus == '1' ?
                            <FormItem
                                label="有效天数"
                                extra='从机构第一次点开来开始计算有效时间'
                                {...formItemLayout}
                            >
                                {getFieldDecorator('timeOut', {
                                    initialValue: CoursewareDetailInfo.timeOut,
                                    rules: [
                                        { required: true, message: '请填写有效天数' },
                                    ],
                                })(
                                    <InputNumber placeholder='请填写有效天数' style={{ width: '434px' }} min={0} onChange={onChange} />
                                )}
                            </FormItem>
                            : null}


                        <FormItem
                            label='上传课件'
                            extra={
                                <div>
                                    {ReleaseFileType && ReleaseFileType.map((item, index) => {
                                        if (!!item.open) {
                                            return (<div key={index}>支持{item.content && item.content.length > 0 ? item.content.join('，') : ''}文件</div>)
                                        }
                                    })}
                                </div>
                            }
                            className={styles.upload}
                            {...formItemLayout}>
                            {getFieldDecorator('courseware_name', {
                                initialValue: CoursewareDetailInfo.fileName,
                                //                            rules: [
                                //                                { required : true, message: '请上传课件' },
                                //                            ],
                            })(
                                <Input placeholder="请选择文件"
                                    size='default'
                                    disabled={true}
                                    style={{ width: 220, borderRadius: '4px 0 0 4px', color: '#666' }}
                                />
                            )}
                            <Upload {...uploadProps}>
                                <Button type='primary' style={{ borderRadius: '0 4px 4px 0' }}><Icon type="upload" /></Button>
                            </Upload>
                        </FormItem>
                        <FormItem
                            label="课件备注"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('remark', {
                                initialValue: CoursewareDetailInfo.remark,
                            })(
                                <Input type='textarea' placeholder='请填写课件备注' autosize={{ minRows: 4, maxRows: 4 }} />
                            )}
                        </FormItem>
                    </Spin>
                </div>
                <TreeOrgCheckSelect {...TreeOrgCheckSelectProps} />
                <BumenCheckSelect {...BumenCheckSelectProps} />
            </Spin>
        </Modal>

    );
};

export default Form.create()(ReleaseCoursewareModal);
