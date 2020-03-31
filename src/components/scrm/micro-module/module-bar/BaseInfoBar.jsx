import React from 'react';
import styles from './ModuleBarComponent.less';
import { Button, Form, Input, Upload, Icon, message, InputNumber, Radio, Select} from 'antd';
import TenantOrgSelect from '../../../../pages/common/tenant-org-select/TenantOrgSelect';

const FormItem = Form.Item;
const Option = Select.Option;
let RadioGroup = Radio.Group;

/**
 * 自定义模板-基本属性表单
 * 表单组件
 */
function BaseInfoBar ({
    formData, resetModuleMusic, moduleMusicInit, payProps, campusProps, moduleConfigData,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        getFieldError,
        setFields,
        validateFieldsAndScroll,
    }
}) {

    //模板音乐还原默认
    function handleResetModuleMusic() {
        resetFields(['musicList']);
        resetModuleMusic && resetModuleMusic();
    }
    
    /*
     * 校验支付金额是否大于0
     */
    function checkPayNum(rule, value, callback) {
    	if(value > 0) {
    		callback();
    	} else {
    		callback('支付金额必须大于零');
    	}
    }

    function normFile(e) {
        let fileList = [];
        if (Array.isArray(e)) {
            fileList = e;
        } else {
            fileList = e && e.fileList;
        }

        fileList && fileList.length > 0 && fileList.map(function(item, index) {

            if(item.response && (item.response.errorCode == 9000) && item.response.data && item.response.data.url) {
                item.url = item.response.data.url;
                item.name = item.response.data.fileName;
                item.status = 'done';
                message.success('上传成功!');
            } else if(item.response && item.response.errorCode == 5000){

                setFields({
                    musicList: {
                        value: [],
                        errors: [new Error((item.response && item.response.errorMessage) || '文件上传失败!')],
                    }
                });
                fileList = [];
            }
        });

        return fileList;
    }

    /*校验图片*/
    function beforeUpload(file) {
		if(file.size > 5242880) {
			message.error('文件大小不能超过5M');
			return false;
		}
		return true;
    }

    let formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    };

    let info_input_style = {
        width: '100%',
        float: 'inherit',
        marginTop: 'auto',
        marginRight: 'auto'
    };

    let uploadMusicProps = {
        // action: BASE_URL+'/fileUpload/mp3',
        action: '/thinknode/upload/file',
        beforeUpload : beforeUpload,
        accept: 'audio/*',
        withCredentials: true,//上传请求时是否携带 cookie
    };

    let _init_music_list = [];
    if(moduleMusicInit && moduleMusicInit.url && moduleMusicInit.url.length > 0) {
        _init_music_list.push({
            uid: -1,
            name: moduleMusicInit.name,
            status: 'done',
            url: moduleMusicInit.url,
        });
    }
    
    //校区选择框属性
    let tenantOrgSelectProps = {
        visible: campusProps && campusProps.showSelectOrgModal,
        onClose: campusProps && campusProps.onSelectOrgModalClose,
        afterSubmit: function(vue) {            
            setFieldsValue({ 'orgIds': vue.join(',') });
            campusProps && campusProps.afterSelectOrgModalSubmit(vue)
        },
        init_org_select: campusProps.selectOrgs || [],
        useThisDataSource: campusProps && campusProps.useThisDataSource,
        checkStrictly: campusProps && campusProps.checkStrictly,
        disabled: campusProps && campusProps.modifyActivity,
        no_select_campus: campusProps && campusProps.modifyActivity,
        source: campusProps && campusProps.source,
    };
    
    return (
        <div className={styles.bar_info_cont}>
            <FormItem
              {...formItemLayout}
              label='选择校区'
             >
             {
                formData && formData.orgName != '' && formData.orgName != undefined
                    ? 
                        <span style={{height: '30px', lineHeight: '30px'}}>{formData.orgName || ''}</span>
                    : 
                    <div>
                        <span style={{ 'color': '#5D9CEC', 'marginRight': '10px' }}>{campusProps.selectOrgs && campusProps.selectOrgs.length || '0'}校区</span>
                        {getFieldDecorator('orgIds', {
                            initialValue: campusProps.selectOrgs.join(',') || "",
                            rules: [
                                { required: true, message: '请选择校区' }
                            ]
                        })(
                            <Button type="primary" size="small" onClick={tenantOrgSelectProps.onClose}>{tenantOrgSelectProps.disabled ? '查看校区' : '选择校区'}</Button>
                        )}
                  </div>
             }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={formData.moduleType == 'leaflet' ? '传单名称' : '活动名称'}
             >
                 {getFieldDecorator('name', {
                    initialValue: formData && formData.moduleName,
                    rules: [{ required: true, message: '请输入名称!' }],
                  })(
                    <Input placeholder="请输入名称" style={info_input_style} />
                  )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label='背景音乐'
              help={(
                <div style={{marginTop: '3px'}}>
                    <p>微模板的背景音乐 文件大小≤5M</p>
                    <span className={styles.form_validate_msg}>{(getFieldError('musicList') || []).join(', ')}</span>
                    <Button type="ghost" className={styles.upload_reset_btn} onClick={()=>handleResetModuleMusic()}>还原默认</Button>
                </div>
               )}
             >
                 {getFieldDecorator('musicList', {
                    initialValue: _init_music_list,
                    valuePropName: 'fileList',
                    getValueFromEvent: normFile,
                  })(
                     <Upload {...uploadMusicProps} >
                     {(getFieldValue('musicList') && getFieldValue('musicList').length > 0) ?
                        null
                        :
                        <Button icon='plus' >选择音乐</Button>
                     }
                    </Upload>
                  )}
            </FormItem>
            
            <FormItem
                {...formItemLayout}
                label="开启支付"
                validateStatus={(getFieldError('enablePay') && getFieldError('enablePay').length > 0) ? 'error' : ''}
                help={(getFieldError('enablePay') && getFieldError('enablePay').length > 0) ? getFieldError('enablePay').join(', ') : '点击是，则活动开启支付功能，活动报名页（h5）显示支付金额字段;金额需要大于0元;'}
            >
                {getFieldDecorator('enablePay', {
                    initialValue: (payProps && payProps.enablePay != undefined) ? payProps.enablePay : 0,
                })(
                    <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                )}
            </FormItem>

			{!!(getFieldValue('enablePay') == 1) &&
			<FormItem
                {...formItemLayout}
                label="支付金额"
                validateStatus={(getFieldError('payAmount') && getFieldError('payAmount').length > 0) ? 'error' : ''}
                help={(getFieldError('payAmount') && getFieldError('payAmount').length > 0) ? getFieldError('payAmount').join(', ') : ''}
            >
                {getFieldDecorator('payAmount', {
                    initialValue: (payProps && payProps.payAmount != undefined) ? payProps.payAmount : 0,
                    rules: [
                        { required: (getFieldValue('enablePay') == 1), message: '请输入支付金额!'},
                        { validator: checkPayNum },
                    ],
                })(
                    <InputNumber 
                    	min={0} 
                    	step={0.01} 
                    	precision={2} 
                    	style={info_input_style} 
                    	disabled={(getFieldValue('enablePay') != 1)} 
                    	placeholder="请输入支付金额" />
                )}
            </FormItem>
            }
            <FormItem
                {...formItemLayout}
                label="渲染类型"
            >
                {getFieldDecorator('renderType', {
                    initialValue: moduleConfigData && moduleConfigData.renderMode || "fill",
                    rules: [{ required: true, message: '请选择渲染类型!' }],
                })(
                    <Select placeholder="请选择渲染类型" style={{width : "80px"}}>
                        <Option value="fill">填充</Option>
                        <Option value="contain">包含</Option>
                        <Option value="cover">裁剪</Option>
                    </Select>
                )}
            </FormItem>

            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </div>
    );
}

export default BaseInfoBar;
