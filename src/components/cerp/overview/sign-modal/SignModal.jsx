import React from 'react';
import { Form, Input, Modal, Button, message, Select, Checkbox, Radio, Popover, Rate, Upload, Icon, Spin } from 'antd';
import { NullData , StatusFlag , BlockHelp } from '../../../common/new-component/NewComponent';
import styles from './SignModal.less';
import QueueAnim from 'rc-queue-anim';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const formItemLayoutTeacher = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const formItemLayoutCommon = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
}

const formItemLayout = {
    labelCol: { span : 7 },
    wrapperCol: { span : 16 },
};

/*cerp首页签到modal*/
/*目前cerp首页和cerp教务管理中的考勤管理的考勤和明细modal都用到*/
const SignModal = ({
    selfOrgId,                              //当前校区的orgId
    teacherDetail,                          //助教和助教信息
    wetherToday,                            //是否是今天(今天可以考勤和编辑明细，非今日只能编辑明细，cerp首页签到固定式今日，主要是考勤页面需要此参数来判断)
    cerpOverviewSignModalVisible,           //首页签到modal是否显示
    cerpOverviewSignModalLoading,           //首页签到modal加载状态
    cerpOverviewSignModalButtonLoading,     //首页签到modal按钮加载状态
    cerpOverviewSignSingleDetail,           //点击每一项之后获取的详情信息

    CerpOverviewSignModalSubmit,            //首页签到点击签到
    CerpOverviewSignModalCancel,            //首页签到modal关闭
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
  }) => {

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
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
            if(info.file.status != 'uploading' && info.file.response && info.file.response.errorCode != 9000) {
                return message.error(info.file.response.errorMessage || `${info.file.name} 上传失败`);
    		}
            if(info.file.status == 'done') {
                return message.success(`${info.file.name} 上传成功`);
            }
            if(info.file.status == 'error') {
                return message.error(`${info.file.name} 上传失败`);
            }
        },
        beforeUpload(file) {
            const imgLimit = file.size / 1024 / 1024 < 5;
            if (!imgLimit) {
                message.error('图片大小不大于5M!');
                return false;
            }
            return true;
        },
    };

    //渲染主教和助教下拉列表
    let teacher = [];
    if(teacherDetail && teacherDetail.length){
        teacher = teacherDetail.map((item,index) => {
            return(
                <Option key = { index } value = { item.userId + '' }>{ item.userName }</Option>
            );
        })
    }


    //出勤，请假，旷课判断数组
    let costConf = [];
    if(cerpOverviewSignSingleDetail.costConf != null){
        costConf = cerpOverviewSignSingleDetail.costConf.split(',');
    }

    //课堂图片格式化
    let courseImg = [];
    if(!!cerpOverviewSignSingleDetail.picList && cerpOverviewSignSingleDetail.picList.length > 0){
        cerpOverviewSignSingleDetail.picList.map((item,index) => {
            courseImg.push({
                uid : - index - 1,
                url : item
            })
        })
    }

    //渲染上课数据和补课数据(后台已经排序过，上课数据在前，补课数据在后)
    let attendOrMakeUpCourse = [];      //上课数据
    if(cerpOverviewSignSingleDetail && cerpOverviewSignSingleDetail.stuList && cerpOverviewSignSingleDetail.stuList.length > 0){
        let target = cerpOverviewSignSingleDetail.stuList;
        for(let i in target){
            let img_render = [];
            let pics = !!target[i].pictures ? JSON.parse(target[i].pictures) : [];
            if(!!pics && pics.length > 0){
                for(let j in pics){
                    img_render.push({
                        uid : - j - 1,
                        url : pics[j]
                    })
                }
            }
            attendOrMakeUpCourse.push(
                <div key = { 'attend_or_makeup_course' + i }>
                    <div className='cerp_overview_sign_modal_stu_detail' >
                        <FormItem
                            {...formItemLayout}
                            style = {{ width : '70%' , lineHeight : '30px' , marginBottom : 0 }}
                            label = {
                                <div>
                                    <Popover placement = 'top' content = { target[i].name + '' }>
                                        <span style = {{ marginRight : 5 , fontWeight : 600 }}>
                                            {/*确保是字符串后进行截取，超过4位变为XXX...，否则显示全部*/}
                                            { !!target[i].name && typeof(target[i].name) == 'string' ?
                                                ((target[i].name + '').length > 4 ?
                                                (target[i].name + '').substr(0,3) + '...:' : target[i].name + ':')
                                              :
                                              '--'
                                            }
                                        </span>
                                    </Popover>
                                    <StatusFlag type = { target[i].stu_type == '1' ? 'blue' : target[i].stu_type == '2' ? 'green' : 'deep_red' } style = {{ marginRight : 5 }}>{ target[i].stu_type == '1' ? '上课' : target[i].stu_type == '2' ? '补课' : '--' }</StatusFlag>
                                </div>
                            }
                        >
                            {getFieldDecorator('attend_or_makeup_course' + i , {
                                initialValue : target[i].sign_type && target[i].sign_type != '1' ? target[i].sign_type + '' : undefined
                            })(
                                <RadioGroup disabled = { !wetherToday || (target[i].sign_type && target[i].sign_type != '1' ? true : false) } options={[
                                    { label: '出勤', value: '3' },
                                    { label: '请假', value: '4' },
                                    { label: '旷课', value: '5' },
                                ]} />
                            )}
                        </FormItem>
                        <div className={styles.course_spend}>
                            <div>消耗课时：</div>
                            <Popover placement = 'top' content = {
                                    costConf[0] == '1' && getFieldValue('attend_or_makeup_course' + i) == '3' ? cerpOverviewSignSingleDetail.cost + '' :
                                    costConf[1] == '1' && getFieldValue('attend_or_makeup_course' + i) == '4' ? cerpOverviewSignSingleDetail.cost + '' :
                                    costConf[2] == '1' && getFieldValue('attend_or_makeup_course' + i) == '5' ? cerpOverviewSignSingleDetail.cost + '' : '0'
                            }>
                                {
                                    costConf[0] == '1' && getFieldValue('attend_or_makeup_course' + i) == '3' ? cerpOverviewSignSingleDetail.cost + '' :
                                    costConf[1] == '1' && getFieldValue('attend_or_makeup_course' + i) == '4' ? cerpOverviewSignSingleDetail.cost + '' :
                                    costConf[2] == '1' && getFieldValue('attend_or_makeup_course' + i) == '5' ? cerpOverviewSignSingleDetail.cost + '' : '0'
                                }
                            </Popover>
                        </div>
                    </div>
                    <QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}>
                        { !!getFieldValue('attend_or_makeup_course' + i) ?
                            <div key = { 'attend_or_makeup_course_detail' + i }>
                                <FormItem
                                    label = "综合评分"
                                    style = {{ marginBottom : 5 }}
                                    {...formItemLayoutCommon}
                                >
                                    {getFieldDecorator('attend_or_makeup_score' + i , {
                                        initialValue : !isNaN(target[i].score + '') ? parseFloat(target[i].score) : 0
                                    })(
                                        <Rate disabled = { !wetherToday || (target[i].sign_type && target[i].sign_type != '1' ? true : false) }/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label = "老师点评"
                                    style = {{ marginBottom : 5 }}
                                    {...formItemLayoutCommon}
                                >
                                    {getFieldDecorator('attend_or_makeup_comment' + i,{
                                        initialValue : target[i].comment ? target[i].comment + '' : undefined,
                                        rules : [
                                            { validator : checkWordLength },
                                        ]
                                    })(
                                        <Input placeholder = '请填写老师点评（限300字）' size = 'default' disabled = { !wetherToday || (target[i].sign_type && target[i].sign_type != '1' ? true : false) }/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label = "上课图片"
                                    help = "最多3张，支持png、jpg、jpeg、gif格式的图片，不大于5M!"
                                    className = 'cerp_overview_sign_modal_upload_pic'
                                    {...formItemLayoutCommon}
                                >
                                    {getFieldDecorator('attend_or_makeup_img' + i , {
                                        initialValue: img_render.slice(0,3),
                                        valuePropName: 'fileList',
                                        normalize: normFile,
                                    })(
                                        <Upload {...imgurlUploadProps} disabled = { !wetherToday || (target[i].sign_type && target[i].sign_type != '1' ? true : false) } onRemove = {() => (!wetherToday || (target[i].sign_type && target[i].sign_type != '1' ? false : true))}>
                                             { getFieldValue('attend_or_makeup_img' + i) && getFieldValue('attend_or_makeup_img' + i).length >= 3 ?
                                                null
                                                :
                                                <div>
                                                    <Icon type = 'plus' />
                                                    <div>选择图片</div>
                                                </div>
                                             }
                                        </Upload>
                                    )}
                                </FormItem>
                            </div>
                            :
                            null
                        }
                    </QueueAnim>
                </div>
            )
        }
    }

    //渲染试听数据
    let auditionData = [];      //试听数据
    if(cerpOverviewSignSingleDetail && cerpOverviewSignSingleDetail.tryStuList && cerpOverviewSignSingleDetail.tryStuList.length > 0){
        auditionData = cerpOverviewSignSingleDetail.tryStuList.map((item,index) => {
            let img_render = [];
            let pics = !!item.pictures ? JSON.parse(item.pictures) : [];
            if(!!pics && pics.length > 0){
                for(let j in pics){
                    img_render.push({
                        uid : - j - 1,
                        url : pics[j]
                    })
                }
            }
            return(
                <div key = { 'audition' + index }>
                    <div className='cerp_overview_sign_modal_stu_detail'>
                        <FormItem
                            label = {
                                <div>
                                    <Popover placement = 'top' content = { item.name + '' }>
                                        <span style = {{ marginRight : 5 , fontWeight : 600 }}>
                                            {/*确保是字符串后进行截取，超过4位变为XXX...，否则显示全部*/}
                                            { typeof(item.name + '') == 'string' ?
                                                ((item.name + '').length > 4 ?
                                                (item.name + '').substr(0,3) + '...:' : item.name + ':')
                                              :
                                              '--'
                                            }
                                        </span>
                                    </Popover>
                                    <StatusFlag type = 'yellow' style = {{ marginRight : 5 }}>试听</StatusFlag>
                                </div>
                            }
                            style = {{ width : '70%' , lineHeight : '30px' , marginBottom : 0 }}
                            {...formItemLayout}
                        >
                            {getFieldDecorator('auditionData' + index , {
                                initialValue : item.sign_type && item.sign_type != '1' ? item.sign_type + '' : undefined
                            })(
                                <RadioGroup disabled = { !wetherToday || (item.sign_type && item.sign_type != '1' ? true : false) }  options={[
                                    { label: '试听', value: '2' },
                                    { label: '旷课', value: '3' },
                                ]} />
                            )}
                        </FormItem>
                    </div>
                    <QueueAnim
                        type={['top', 'top']}
                        ease={['easeOutQuart', 'easeInOutQuart']}>
                        { !!getFieldValue('auditionData' + index) ?
                            <div key = { 'audition_detail' + index }>
                                <FormItem
                                    label = "综合评分"
                                    style = {{ marginBottom : 5 }}
                                    {...formItemLayoutCommon}
                                >
                                    {getFieldDecorator('audition_score' + index , {
                                        initialValue : !isNaN(item.score + '') ? parseFloat(item.score) : 0
                                    })(
                                        <Rate disabled = { !wetherToday || (item.sign_type && item.sign_type != '1' ? true : false) }/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label = "老师点评"
                                    style = {{ marginBottom : 5 }}
                                    {...formItemLayoutCommon}
                                >
                                    {getFieldDecorator('audition_comment' + index,{
                                        initialValue : !!item.comment ? item.comment + '' : undefined,
                                        rules : [
                                            { validator : checkWordLength },
                                        ]
                                    })(
                                        <Input placeholder = '请填写老师点评（限300字）' size = 'default' disabled = { !wetherToday || (item.sign_type && item.sign_type != '1' ? true : false) }/>
                                    )}
                                </FormItem>
                                <FormItem
                                    label = "上课图片"
                                    help = "最多3张，支持png、jpg、jpeg、gif格式的图片，不大于5M!"
                                    className = 'cerp_overview_sign_modal_upload_pic'
                                    {...formItemLayoutCommon}
                                >
                                    {getFieldDecorator('audition_img' + index , {
                                        initialValue: img_render.slice(0,3),
                                        valuePropName: 'fileList',
                                        normalize: normFile,
                                    })(
                                        <Upload {...imgurlUploadProps} disabled = { !wetherToday || (item.sign_type && item.sign_type != '1' ? true : false) } onRemove = {() => (!wetherToday || (item.sign_type && item.sign_type != '1' ? false : true))}>
                                             { getFieldValue('audition_img' + index) && getFieldValue('audition_img' + index).length >= 3 ?
                                                null
                                                :
                                                <div>
                                                    <Icon type = 'plus' />
                                                    <div>选择图片</div>
                                                </div>
                                             }
                                        </Upload>
                                    )}
                                </FormItem>
                            </div>
                            :
                            null
                        }
                    </QueueAnim>
                </div>
            );
        })
    }

    function handleComplete(e) {
        e.preventDefault();
        validateFieldsAndScroll((errors,values) => {
            if( !!errors ){
                return;
            }

            //处理orgId
            values.orgId = selfOrgId || '';

            //处理cpdId和cpmId
            values.cpdId = cerpOverviewSignSingleDetail.cpdId;
            values.cpmId = cerpOverviewSignSingleDetail.cpmId;

            //处理课堂图片
            let pictures = [];
            if(values.pictures && values.pictures.length > 0){
                values.pictures.map((item,index) => {
                    pictures.push(item.url ? item.url : item.response.data.url ? item.response.data.url : '')
                })
            }
            values.pictures = JSON.stringify(pictures);
            values.picNum = pictures.length;

            //处理上课和补课数据
            let signStuList = [];
            if(cerpOverviewSignSingleDetail && cerpOverviewSignSingleDetail.stuList){
                let stuList = cerpOverviewSignSingleDetail.stuList;
                for(let i in stuList){
                    if(stuList[i].sign_type == '1' && !!values['attend_or_makeup_course' + i]){
                        let picture = [];
                        if(values['attend_or_makeup_img' + i] && values['attend_or_makeup_img' + i].length > 0){
                            values['attend_or_makeup_img' + i].map((item,index) => {
                                picture.push(item.url ? item.url : item.response.data.url ? item.response.data.url : '')
                            })
                        }
                        signStuList.push({
                            cpStuId : stuList[i].id,
                            signType : values['attend_or_makeup_course' + i],
                            score : values['attend_or_makeup_score' + i],
                            comment : values['attend_or_makeup_comment' + i],
                            picNum :　picture.length,
                            picture : JSON.stringify(picture)
                        });
                    }
                    delete values['attend_or_makeup_course' + i];
                    delete values['attend_or_makeup_score' + i];
                    delete values['attend_or_makeup_comment' + i];
                    delete values['attend_or_makeup_img' + i]
                }
            }
            values.signStuList = JSON.stringify(signStuList);

            //处理试听数据
            let tryList = [];
            //试听数据长度
            if(cerpOverviewSignSingleDetail && cerpOverviewSignSingleDetail.tryStuList){
                let tryStuList = cerpOverviewSignSingleDetail.tryStuList;
                for(let i in tryStuList){
                    if(tryStuList[i].sign_type == '1' && !!values['auditionData' + i]){
                        let picture = [];
                        if(values['audition_img' + i] && values['audition_img' + i].length > 0){
                            values['audition_img' + i].map((item,index) => {
                                picture.push(item.url ? item.url : item.response.data.url ? item.response.data.url : '')
                            })
                        }
                        tryList.push({
                            id : tryStuList[i].audition_id,
                            status : values['auditionData' + i],
                            score : values['audition_score' + i],
                            comment : values['audition_comment' + i],
                            picNum :　picture.length,
                            picture : JSON.stringify(picture)
                        });
                    }
                    delete values['auditionData' + i];
                    delete values['audition_score' + i];
                    delete values['audition_comment' + i];
                    delete values['audition_img' + i]
                }
            }
            values.tryList = JSON.stringify(tryList);

            //删除多余数据
            delete values.mtids;
            delete values.atids;
            delete values.studyTime;

            //console.info(values);
            CerpOverviewSignModalSubmit(values);
        });
    }

    function handleCancel(e) {
        e.preventDefault();
        resetFields();
        CerpOverviewSignModalCancel();
    }

    let modalFooter = [
        <Button key="cancel" type="ghost" onClick={handleCancel}>取消</Button>,
        <Button key="submit" type="primary"
                onClick={handleComplete}
                disabled={cerpOverviewSignModalButtonLoading}
                loading={cerpOverviewSignModalButtonLoading}
                style={{marginLeft:20}}>考勤</Button>
    ];

    //当日数据才展示打印小票功能
    if(!!wetherToday){
        modalFooter.splice(0,0,
            <div style = {{ display : 'inline-flex' , alignItems : 'center' , marginRight : 20 }} key = 'print_and_help'>
                <div>
                    {getFieldDecorator('printTicket')(
                        <Checkbox>打印小票</Checkbox>
                    )}
                </div>
                <BlockHelp
                    content = {
                        <div>
                            <div>1.如果连接了打印机设备并且勾选，则在考勤时会打印小票</div>
                            <div>2.只会对出勤的学员打印小票</div>
                            <div>3.已考勤过的的学员不会打印小票</div>
                        </div>
                    }
                />
            </div>)
    }

    //模态框的属性
    let modalOpts = {
        title: cerpOverviewSignSingleDetail && cerpOverviewSignSingleDetail.courseName || '',
        maskClosable : false,
        visible : cerpOverviewSignModalVisible,
        closable : true,
        width : 550,
        onOk: handleComplete,
        onCancel : handleCancel,
        footer : modalFooter,
        className : 'cerp_overview_sign_modal'
    };

    //检查字数(不超过300字)
    function checkWordLength(rule, value, callback){
        if(!!value && value.length > 300){
            callback('字数不能超过300');
        }else{
            callback();
        }
    }



    return (
        <Modal {...modalOpts}>
            <Spin spinning = { cerpOverviewSignModalLoading }>
                <Form className={styles.form}>
                    <div className={styles.teacher_area}>
                        <FormItem
                            label = "主教"
                            {...formItemLayoutTeacher}
                        >
                            {getFieldDecorator('mtids' , {
                                initialValue : !!cerpOverviewSignSingleDetail && !!cerpOverviewSignSingleDetail.mtids ? cerpOverviewSignSingleDetail.mtids.split(',') : []
                            })(
                                <Select
                                    mode = 'multiple'
                                    placeholder = '请选择主教'
                                    size = 'default'
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    disabled = { true }>
                                    { teacher || [] }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            label = "助教"
                            {...formItemLayoutTeacher}
                        >
                            {getFieldDecorator('atids' , {
                                initialValue : !!cerpOverviewSignSingleDetail && !!cerpOverviewSignSingleDetail.atids ? cerpOverviewSignSingleDetail.atids.split(',') : []
                            })(
                                <Select
                                    mode = 'multiple'
                                    placeholder = '请选择助教'
                                    size = 'default'
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    disabled = { true }>
                                    { teacher || [] }
                                </Select>
                            )}
                        </FormItem>
                    </div>
                    <FormItem
                        label = "上课时间"
                        {...formItemLayoutCommon}
                    >
                        {getFieldDecorator('studyTime',{
                            initialValue : cerpOverviewSignSingleDetail && cerpOverviewSignSingleDetail.startTime != null && cerpOverviewSignSingleDetail.endTime != null ?
                            `${cerpOverviewSignSingleDetail.startTime}~${cerpOverviewSignSingleDetail.endTime}` : undefined
                        })(
                            <Input placeholder = '请填写上课时间' disabled = { true } size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "课堂内容"
                        {...formItemLayoutCommon}
                    >
                        {getFieldDecorator('content' , {
                            initialValue : cerpOverviewSignSingleDetail && !!cerpOverviewSignSingleDetail.content ? cerpOverviewSignSingleDetail.content + '' : undefined,
                            rules : [
                                { validator : checkWordLength },
                            ]
                        })(
                            <Input placeholder = '请填写课堂内容（限300字）' size = 'default'/>
                        )}
                    </FormItem>
                    <FormItem
                        label = "课后作业"
                        {...formItemLayoutCommon}
                    >
                        {getFieldDecorator('homework' , {
                            initialValue : cerpOverviewSignSingleDetail && !!cerpOverviewSignSingleDetail.homework ? cerpOverviewSignSingleDetail.homework + '' : undefined,
                            rules : [
                                { validator : checkWordLength },
                            ]
                        })(
                            <Input placeholder = '请填写课后作业（限300字）' size = 'default' />
                        )}
                    </FormItem>
                    <FormItem
                        label = "课堂图片"
                        help = "最多3张，支持png、jpg、jpeg、gif格式的图片，不大于5M!"
                        className = 'cerp_overview_sign_modal_upload_pic'
                        {...formItemLayoutCommon}
                    >
                        {getFieldDecorator('pictures' , {
                            initialValue: courseImg.slice(0,3),
                            valuePropName: 'fileList',
                            normalize: normFile,
                        })(
                            <Upload {...imgurlUploadProps}>
                                 { getFieldValue('pictures') && getFieldValue('pictures').length >= 3 ?
                                    null
                                    :
                                    <div>
                                        <Icon type = 'plus' />
                                        <div>选择图片</div>
                                    </div>
                                 }
                            </Upload>
                        )}
                    </FormItem>
                    { attendOrMakeUpCourse && attendOrMakeUpCourse.length > 0 ?
                        <div>
                            { attendOrMakeUpCourse }
                        </div>
                        :
                        null
                    }

                    { auditionData && auditionData.length > 0 ?
                        <div>
                            { auditionData }
                        </div>
                        :
                        null
                    }

                    { attendOrMakeUpCourse.length == 0 && auditionData.length == 0 ?
                        <NullData height = '220px' content = '暂无学员上课补课试听数据'/>
                        :
                        null
                    }
                </Form>
            </Spin>
        </Modal>
    );
};

export default Form.create()(SignModal);
