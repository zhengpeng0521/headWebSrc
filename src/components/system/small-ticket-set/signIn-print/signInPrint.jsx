import React from 'react';
import { Checkbox , Input , Button , Spin , Radio , Upload , Form , Icon , message , Popconfirm } from 'antd';
import { NullData , BlockTitle } from '../../../common/new-component/NewComponent';
import styles from './signInPrint.less';
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

/*签到小票预览*/
function SignInPrint({
    loading,                    //是否加载状态
    checkOptions,               //打印小票可以选择的checkbox
    radioOptions,               //可选择radio
    initCheckedBox,             //需要渲染的数组
    initTicketBottomContent,    //初始小票底部内容
    ticketBottomContent,        //小票底部内容
    nameCardLogo,               //名帖logo

    CheckBoxOnChange,           //checkbox的onChange事件
    CheckRadioOnChange,         //CheckRadio的change事件
    InputContentOnChange,       //textarea的onChange事件
    SaveSmallTicketReSet,       //还原默认选项
    SaveSmallTicketSet,         //保存选项

    showModel,                  //提示框是否显示
    checkedstatus,              //打印类型
    defaultCheckStatus,         //当前保存的打印类型

    UploadPicSuc,               //上传图片成功
    UploadPicRemove,            //移除图片事件
    wetherSaveSuc,              //是否保存成功
    ClearWetherSaveSuc,         //清空保存成功
    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
}) {

    //成功之后设置logo
    if(wetherSaveSuc){
        setFieldsValue({
            logo : nameCardLogo
        });
        ClearWetherSaveSuc();
    }

    let imgurlUploadProps = {
        name: 'file',
        // action: `${BASE_URL}/uploadController/upload`,
        action: '/thinknode/upload/image',
        listType: 'picture-card',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} 上传成功`);
                UploadPicSuc(info.file);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        },
        onRemove : UploadPicRemove,
        beforeUpload(file) {
            let imgurl_list = getFieldValue('logo');
            if(imgurl_list && imgurl_list.length > 0) {
                message.error('只能选择一张logo图');
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

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return(
        <Spin spinning={loading}>
            <div className={styles.small_ticket_all_content}>
                <div className={styles.small_ticket_preview}>
                    <BlockTitle content = '小票预览（示例）'/>
                    { checkedstatus == '2' ?
                        <div className={styles.name_card_area}>
                            <div className={styles.name_card_area_title}>
                                杭州XXXXXX校区
                            </div>
                            <div className={styles.name_card_area_content}>
                                <div className={styles.name_card_area_img}>
                                    { !!nameCardLogo && nameCardLogo.length > 0 ?
                                        <img src = { nameCardLogo[0].url } height = '80px' width = '80px'/>
                                        :
                                        <div className = {styles.name_card_area_no_img}>无LOGO</div>
                                    }
                                </div>
                                <div className={styles.name_card_area_content_detail}>
                                    <div className={styles.name_card_area_content_detail_top}>
                                        张小宝
                                    </div>
                                    <div className={styles.name_card_area_content_detail_bottom}>
                                        { initCheckedBox.indexOf('courseName') > -1 ?
                                            <p>课程：游泳课</p>
                                            :
                                            null
                                        }
                                        { initCheckedBox.indexOf('parentName') > -1 ?
                                            <p>家长：张三丰</p>
                                            :
                                            null
                                        }
                                        <p>签到时间：08-27 09:12</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles.small_ticket_preview_content}>
                            <NullData height = '350px' content = '无打印内容'/>
                            {/* initCheckedBox && initCheckedBox.length > 0 ?
                                <div>
                                    { initCheckedBox.indexOf('orgName') > -1 ?
                                      <div className={styles.small_ticket_preview_content_orgName}>
                                        闪闪早教中心
                                      </div>
                                      :
                                      null}
                                    { initCheckedBox.indexOf('stuName') > -1 ?
                                      <div className={styles.small_ticket_preview_content_common}>
                                        学员姓名：阿小皮
                                      </div>
                                      :
                                      null}
                                    { initCheckedBox.indexOf('parentName') > -1 ?
                                      <div className={styles.small_ticket_preview_content_common}>
                                        家长姓名：阿哒皮
                                      </div>
                                      :
                                      null}

                                    { initCheckedBox.indexOf('courseName') > -1 ?
                                      <div className={styles.small_ticket_preview_content_common}>
                                        课程名称：幼儿益智一阶
                                      </div>
                                      :
                                      null}
                                    { initCheckedBox.indexOf('attendTime') > -1 ?
                                      <div className={styles.small_ticket_preview_content_common}>
                                        上课时间：2017-12-12 16:00-17:00
                                      </div>
                                      :
                                      null}
                                    { initCheckedBox.indexOf('expendPeriod') > -1 ?
                                      <div className={styles.small_ticket_preview_content_common}>
                                        消耗课时：1课时
                                      </div>
                                      :
                                      null}
                                    { initCheckedBox.indexOf('surplusPeriod') > -1 ?
                                      <div className={styles.small_ticket_preview_content_common}>
                                        剩余课时：2课时
                                      </div>
                                      :
                                      null}
                                    { initCheckedBox.indexOf('recBottom') > -1 ?
                                      <div className={styles.small_ticket_preview_content_recBottom}>
                                        <pre style={{width:'260px',wordWrap:'break-word'}}>{ ticketBottomContent }</pre>
                                      </div>
                                      :
                                      null}
                                </div>
                                :
                                <NullData height = '350px' content = '无打印内容'/>*/
                            }
                        </div>
                    }
                </div>
                <div className={styles.small_ticket_set}>
                    <BlockTitle content = '打印类型'/>
                    <div className={styles.small_ticket_type}>
                        <RadioGroup onChange={(e) => CheckRadioOnChange(e.target.value)} value={checkedstatus}>
                            {/*<Radio value='1'>打印小票</Radio>*/}
                            <Radio value='2'>打印名帖</Radio>
                            {/*<Radio value='0'>都不打印</Radio>*/}
                        </RadioGroup>
                    </div>
                    <BlockTitle content = '请勾选需要打印的信息'/>
                    { checkedstatus == '2' ?
                        <div>
                            <div className='small_ticket_set_checkbox'>
                                <CheckboxGroup options={[{label:'家长姓名',value:'parentName'},{label:'课程名称',value:'courseName'}]} onChange={CheckBoxOnChange} value={initCheckedBox} defaultChecked={false}/>
                            </div>
                            <div className='zj_sign_in_print_logo'>
                                {getFieldDecorator('logo', {
                                    initialValue: nameCardLogo || [],
                                    valuePropName: 'fileList',
                                    normalize: normFile,
                                })(
                                    <Upload {...imgurlUploadProps} >
                                         { getFieldValue('logo') && getFieldValue('logo').length >= 1 ?
                                            null
                                            :
                                            <div>
                                                <Icon type = 'plus' />
                                                <div>选择LOGO</div>
                                            </div>
                                         }
                                    </Upload>
                                )}
                            </div>
                        </div>
                        :
                      checkedstatus == '1' ?
                            <div>
                                <div className='small_ticket_set_checkbox'>
                                    <CheckboxGroup
                                        options={ checkOptions }
                                        onChange={ CheckBoxOnChange }
                                        value={ initCheckedBox }
                                        defaultChecked={ false }
                                        />
                                </div>
                                <Input
                                    type = 'textarea'
                                    autosize = {{ minRows: 4, maxRows: 4 }}
                                    className = { styles.small_ticket_set_textarea }
                                    disabled = { initCheckedBox.indexOf('recBottom') > -1 ? false : true }
                                    value = { ticketBottomContent }
                                    onChange = { InputContentOnChange }/>
                            </div>
                            :
                            <div style = {{ width : 250 }}>
                                <NullData height = '275px' content = '都不打印'/>
                            </div>
                    }

                    <div style = {{ marginLeft : checkedstatus == '1' ? 42 : 20 }}>
                        { checkedstatus == '0' ?
                            null
                            :
                            <Popconfirm placement="topLeft" title='确定还原默认？' onConfirm={SaveSmallTicketReSet} okText="确定" cancelText="取消">
                                <Button type = 'ghost' style = {{ marginRight : 10 }}>还原默认并保存</Button>
                            </Popconfirm>
                        }
                        <Button type = 'primary' onClick={() => SaveSmallTicketSet(getFieldValue('logo'))}>保存</Button>
                    </div>
                </div>
            </div>
        </Spin>
    );
}

export default Form.create()(SignInPrint);
