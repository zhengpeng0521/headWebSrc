import React from 'react';
import styles from './ModuleBarComponent.less';
import ColorSelect from '../../../common/color-select/ColorSelect';
import {Button,Form,Input,Upload,Icon,message,Select,InputNumber,Popconfirm,} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

/**
 * 自定义模板-基本属性表单
 * 页面元素编辑组件
 */
function PageItemBar ({
    currentPageKey,
    pageConfig,
    activeItemKey,
    updateItem,

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

    let renderItemBar = undefined;

    let items = (pageConfig && pageConfig.items) || [];

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

    function normFile(itemKey, e) {

        let fileList = [];
        if (Array.isArray(e)) {
            fileList = e;
        } else {
            fileList = e && e.fileList;
        }

        fileList && fileList.length > 0 && fileList.map(function(item, index) {

            if(item.response && (item.response.errorCode == 9000) && item.response.data && item.response.data.url) {
                item.url = item.response.data.url;
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

        //更新model里的图片链接
        let img_url = '';
        if(fileList && fileList.length > 0) {
            let firstFile = fileList[0];
            img_url = firstFile.url || '';
        }
        updateItem && updateItem(currentPageKey, itemKey, {
            img_url: img_url,
        });

        return fileList;
    }

    /*校验图片*/
    function beforeUpload(file) {
		if(file.size > 2097152) {
			message.error('文件大小不能超过2M');
			return false;
		}
		return true;
    }

    let uploadMusicProps = {
        // action: BASE_URL+'/uploadController/upload',
        action : '/thinknode/upload/image',
        listType: "picture-card",
        beforeUpload : beforeUpload,
        withCredentials: true,//上传请求时是否携带 cookie
    };

    //文本信息编辑时
    function textContentChange(itemKey, e) {
        let {target} = e;
        let value = target && target.value;
        updateItem && updateItem(currentPageKey, itemKey, {
            text_content: value,
        });
    }

    function fontSizeChange(itemKey, value) {
        updateItem && updateItem(currentPageKey, itemKey, {
            font_size: value,
        });
    }

    function letterSpacingChange(itemKey, value) {
        updateItem && updateItem(currentPageKey, itemKey, {
            letter_spacing: value,
        });
    }

    function fontColorChange(itemKey, value) {
        updateItem && updateItem(currentPageKey, itemKey, {
            font_color: value,
        });
    }

    //按钮类型 文本信息编辑时
    function btnContentChange(itemKey, e) {
        let {target} = e;
        let value = target && target.value;
        updateItem && updateItem(currentPageKey, itemKey, {
            btn_content: value,
        });
    }
    //按钮类型 文本信息编辑时
    function linkHrefChange(itemKey, e) {
        let {target} = e;
        let value = target && target.value;
        updateItem && updateItem(currentPageKey, itemKey, {
            link_href: value,
        });
    }
    //按钮类型 文本信息编辑时
    function phoneLinkHrefChange(itemKey, e) {
        let {target} = e;
        let value = target && target.value;
        updateItem && updateItem(currentPageKey, itemKey, {
            phone_link_href: value,
        });
    }

    function itemReset(itemKey, itemInit) {
        updateItem && updateItem(currentPageKey, itemKey, itemInit);
        resetFields && resetFields([
            'text_content_&' + currentPageKey + '&'+itemKey,
            'font_size_&' + currentPageKey + '&'+itemKey,
            'letter_spacing_&' + currentPageKey + '&'+itemKey,
            'font_color_&' + currentPageKey + '&'+itemKey,
            'img_url_&' + currentPageKey + '&'+itemKey,
            'btn_content_&' + currentPageKey + '&'+itemKey,
            'link_href_&' + currentPageKey + '&'+itemKey,
            'phone_link_href_&' + currentPageKey + '&'+itemKey,
        ]);
    }

    if(activeItemKey != '') {
        items && items.map(function(iitem, iindex) {
            if(iitem.item_key == activeItemKey) {

                if(iitem.type == 'text') {
                    //文本类型元素的设置表单

                    let font_bold = iitem.font_weight == 'bold';
                    let font_style = iitem.font_style == 'italic';
                    let text_decoration = iitem.text_decoration == 'underline';

                    let text_align = iitem.text_align || 'center';
                    let vertical_align = iitem.vertical_align || 'middle';

                    let icon_select_color = '#5D9CEC';
                    let icon_no_select_color = '#999';

                    //设置默认内容
                    if(iitem.text_content_init == undefined) {
                        iitem.text_content_init = iitem.text_content;
                    }
                    if(iitem.font_size_init == undefined) {
                        iitem.font_size_init = iitem.font_size;
                    }
                    if(iitem.letter_spacing_init == undefined) {
                        iitem.letter_spacing_init = iitem.letter_spacing ||'0';
                    }

                    if(iitem.font_color_init == undefined) {
                        iitem.font_color_init = iitem.font_color;
                    }

                    if(iitem.font_weight_init == undefined) {
                        iitem.font_weight_init = iitem.font_weight;
                    }
                    if(iitem.font_style_init == undefined) {
                        iitem.font_style_init = iitem.font_style;
                    }
                    if(iitem.text_decoration_init == undefined) {
                        iitem.text_decoration_init = iitem.text_decoration;
                    }
                    if(iitem.text_align_init == undefined) {
                        iitem.text_align_init = iitem.text_align;
                    }
                    if(iitem.vertical_align_init == undefined) {
                        iitem.vertical_align_init = iitem.vertical_align;
                    }

                    let itemInit = {
                        text_content: iitem.text_content_init,
                        font_size: iitem.font_size_init,
                        letter_spacing: iitem.letter_spacing_init,
                        font_color: iitem.font_color_init,
                        font_weight: iitem.font_weight_init,
                        font_style: iitem.font_style_init,
                        text_decoration: iitem.text_decoration_init,
                        text_align: iitem.text_align_init,
                        vertical_align: iitem.vertical_align_init,
                    };
//<div className={styles.item_cont_title_cont}><div className={styles.item_cont_title}>文本信息</div></div>
                    renderItemBar = (
                        <div className={styles.item_bar_cont}>

                            <FormItem
                              {...formItemLayout}
                              label='文本内容'
                             >
                                 {getFieldDecorator('text_content_&' + currentPageKey + '&' + iitem.item_key, {
                                    initialValue: iitem.text_content,
                                  })(
                                    <Input
                                        type="textarea"
                                        placeholder="请输入文本内容"
                                        style={info_input_style}
                                        onChange={(e)=>textContentChange(iitem.item_key, e)}
                                     />
                                  )}
                            </FormItem>

                            <FormItem
                              {...formItemLayout}
                              label='文本字号'
                             >
                                 {getFieldDecorator('font_size_&' + currentPageKey + '&' + iitem.item_key, {
                                    initialValue: iitem.font_size,
                                  })(
                                    <Select style={info_input_style} onChange={(value)=>fontSizeChange(iitem.item_key, value)}>
                                        <Option key='font_size_0' value={iitem.font_size_init}>默认</Option>
                                        <Option key='font_size_1' value='20px'>最小</Option>
                                        <Option key='font_size_2' value='30px'>较小</Option>
                                        <Option key='font_size_3' value='45px'>适中</Option>
                                        <Option key='font_size_4' value='100px'>较大</Option>
                                        <Option key='font_size_5' value='150px'>超大</Option>
                                    </Select>
                                  )}
                            </FormItem>

                            <FormItem
                              {...formItemLayout}
                              label='文本间距'
                             >
                                 {getFieldDecorator('letter_spacing_&' + currentPageKey + '&' + iitem.item_key, {
                                    initialValue: (iitem.letter_spacing || '0') + '',
                                  })(
                                    <Select style={info_input_style} onChange={(value)=>letterSpacingChange(iitem.item_key, value)}>
                                        <Option key='font_size_0' value={iitem.letter_spacing_init+''}>默认</Option>
                                        <Option key='font_size_1' value={'0'}>紧凑</Option>
                                        <Option key='font_size_2' value={'5'}>正常</Option>
                                        <Option key='font_size_3' value={'10'}>加宽</Option>
                                        <Option key='font_size_4' value={'30'}>超宽</Option>
                                    </Select>
                                )}
                            </FormItem>

                            <FormItem
                              {...formItemLayout}
                              label='文本颜色'
                             >
                                 {getFieldDecorator('font_color_&' + currentPageKey + '&' + iitem.item_key, {
                                    initialValue: iitem.font_color,
                                  })(
                                    <ColorSelect  width='70px' height='24px' onChange={(value)=>fontColorChange(iitem.item_key, value)} />
                                  )}
                            </FormItem>


                           <FormItem
                              {...formItemLayout}
                              label='文本样式'
                             >
                                <div className={styles.font_set_other_cont}>

                                   <div className={styles.font_set_row}>
                                        <Icon type='jiacu' title="加粗" className={styles.font_set_icon}
                                            style={{color: font_bold ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {font_weight: font_bold?'normal':'bold'})}
                                        />
                                        <Icon type='qingxie' title="倾斜" className={styles.font_set_icon}
                                            style={{color: font_style ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {font_style: font_style?'normal':'italic'})}
                                        />
                                        <Icon type='xiahuaxian' title="下划线" className={styles.font_set_icon}
                                            style={{color: text_decoration ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {text_decoration: text_decoration?'none':'underline'})}
                                        />
                                   </div>

                                   <div className={styles.font_set_row}>
                                        <Icon type='font-align-left' title="居左对齐" className={styles.font_set_icon}
                                            style={{color: (text_align == 'left') ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {text_align: 'left'})}
                                        />
                                        <Icon type='font-align-center' title="水平居中" className={styles.font_set_icon}
                                            style={{color: (text_align == 'center') ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {text_align: 'center'})}
                                        />
                                        <Icon type='font-align-right' title="居右对齐" className={styles.font_set_icon}
                                            style={{color: (text_align == 'right') ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {text_align: 'right'})}
                                        />
                                        <Icon type='font-align-top' title="顶部对齐" className={styles.font_set_icon}
                                            style={{color: (vertical_align == 'top') ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {vertical_align: 'top'})}
                                        />
                                        <Icon type='font-align-center-v' title="垂直居中" className={styles.font_set_icon}
                                            style={{color: (vertical_align == 'middle') ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {vertical_align: 'middle'})}
                                        />
                                        <Icon type='font-align-bottom' title="底部对齐" className={styles.font_set_icon}
                                            style={{color: (vertical_align == 'bottom') ? icon_select_color : icon_no_select_color}}
                                            onClick={()=>updateItem(currentPageKey, iitem.item_key, {vertical_align: 'bottom'})}
                                        />
                                   </div>
                                </div>
                            </FormItem>

                            <Popconfirm title="确认要还原默认配置吗?" onConfirm={()=>itemReset(iitem.item_key, itemInit)} >
                                <Button type="ghost" className={styles.item_reset_btn} >还原默认</Button>
                            </Popconfirm>
                        </div>
                    );

                } else if(iitem.type == 'image') {
                    //图片类型元素的设置表单
                    let initFileList = [];

                    if(iitem && iitem.img_url && iitem.img_url.length > 0) {
                        initFileList.push({
                            uid: -1,
                            name: 'image_'+iitem.item_key,
                            status: 'done',
                            url: iitem.img_url,
                        });

                        if(iitem.img_url_init == undefined) {
                            iitem.img_url_init = iitem.img_url;
                        }
                    }

                    let itemInit = {
                        img_url: iitem.img_url_init || '',
                    };

                    renderItemBar = (
                        <div className={styles.item_bar_cont}>
                            <FormItem
                              {...formItemLayout}
                              label='选择图片'
                              help={(
                                <div style={{marginTop: '-5px', display: 'block', width: '100%', float: 'left'}}>
                                    <p>图片大小≤2M, 支持png,jpeg,gif格式</p>
                                    <span className={styles.form_validate_msg}>{(getFieldError('img_url_&' + currentPageKey + '&' + iitem.item_key) || []).join(', ')}</span>
                                    <Popconfirm title="确认要还原默认配置吗?" onConfirm={()=>itemReset(iitem.item_key, itemInit)} >
                                        <Button type="ghost" className={styles.item_reset_img_btn} >还原默认</Button>
                                    </Popconfirm>
                                </div>
                               )}
                             >
                                 {getFieldDecorator('img_url_&' + currentPageKey + '&' + iitem.item_key, {
                                    initialValue: initFileList,
                                    valuePropName: 'fileList',
                                    getValueFromEvent: (e)=>normFile(iitem.item_key, e),
                                  })(
                                     <Upload {...uploadMusicProps} >
                                     {(getFieldValue('img_url_&' + currentPageKey + '&' + iitem.item_key) && getFieldValue('img_url_&' + currentPageKey + '&' + iitem.item_key).length > 0) ?
                                        null
                                        :
                                        <div>
                                            <Icon type="plus" />
                                            <div >选择图片</div>
                                        </div>
                                     }
                                    </Upload>
                                  )}
                            </FormItem>
                        </div>
                    );
                } else if(iitem.type == 'button') {
                    //按钮类型元素的设置表单

                    if(iitem.btn_content_init == undefined) {
                        iitem.btn_content_init = iitem.btn_content;
                    }
                    if(iitem.link_href_init == undefined) {
                        iitem.link_href_init = iitem.link_href;
                    }
                    if(iitem.phone_link_href_init == undefined) {
                        iitem.phone_link_href_init = iitem.phone_link_href;
                    }

                    let itemInit = {
                        btn_content: iitem.btn_content_init,
                        link_href: iitem.link_href_init,
                        phone_link_href: iitem.phone_link_href_init,
                    };

                    renderItemBar = (
                        <div className={styles.item_bar_cont}>
                            <FormItem
                              {...formItemLayout}
                              label='文本内容'
                             >
                                 {getFieldDecorator('btn_content_&' + currentPageKey + '&' + iitem.item_key, {
                                    initialValue: iitem.btn_content,
                                  })(
                                    <Input
                                        type="textarea"
                                        placeholder="请输入文本内容"
                                        style={info_input_style}
                                        onChange={(e)=>btnContentChange(iitem.item_key, e)}
                                     />
                                  )}
                            </FormItem>

                            {iitem.btn_type == 'link' ?
                                <FormItem
                                  {...formItemLayout}
                                  label='链接地址'
                                 >
                                     {getFieldDecorator('link_href_&' + currentPageKey + '&' + iitem.item_key, {
                                        initialValue: iitem.link_href,
                                      })(
                                        <Input
                                            type="textarea"
                                            placeholder="请输入文本内容"
                                            style={info_input_style}
                                            onChange={(e)=>linkHrefChange(iitem.item_key, e)}
                                         />
                                      )}
                                </FormItem>
                                :

                                <FormItem
                                      {...formItemLayout}
                                      label='拨打电话'
                                     >
                                         {getFieldDecorator('phone_link_href_&' + currentPageKey + '&' + iitem.item_key, {
                                            initialValue: iitem.phone_link_href,
                                          })(
                                            <Input
                                                type="textarea"
                                                placeholder="请输入拨打电话"
                                                style={info_input_style}
                                                onChange={(e)=>phoneLinkHrefChange(iitem.item_key, e)}
                                             />
                                          )}
                                    </FormItem>
                            }

                            <Popconfirm title="确认要还原默认配置吗?" onConfirm={()=>itemReset(iitem.item_key, itemInit)} >
                                <Button type="ghost" className={styles.item_reset_btn} >还原默认</Button>
                            </Popconfirm>
                        </div>
                    );
                } else {
                    renderItemBar = (
                        <div className={styles.item_cont_title_cont}><div className={styles.item_cont_title}>暂未提供编辑方法</div></div>
                    );
                }


            }
        });
    }

    return (
        <div className={styles.bar_info_cont}>
            {renderItemBar == undefined ?
                <div className={styles.item_cont_title_cont}><div className={styles.item_cont_title}>请点击左侧预览器里面的模块, 进行编辑</div></div>
                :
                renderItemBar
            }
        </div>
    );
}

export default PageItemBar;
