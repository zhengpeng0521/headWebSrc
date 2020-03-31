import React from 'react';
import styles from './KoubeiGoodsFormComponent.less';
import KoubeiGoodsPreview from './KoubeiGoodsPreview';
import {Modal,Button,Form,Input,Select,Checkbox,InputNumber,Upload,Icon,DatePicker,Radio,Cascader,message} from 'antd';
import KoubeiOrgGoodsSelect from '../../../../pages/scrm/koubei/common/koubei-org-select/KoubeiOrgGoodsSelect';
import QueueAnim from 'rc-queue-anim';
import moment from 'moment';

import {checkWrongWord,checkOnlyNum} from '../../../../utils/validateUtils';

let Option = Select.Option;
let CheckboxGroup = Checkbox.Group;
let FormItem = Form.Item;
let RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;

function KoubeiGoodsFormComponent ({
    visible,
    loading,
    formData,
    goodsType,
    courseTypeCheckList,
    ageCheckList,
    freeOrTemplate,             //模板('1'),自定义('2')
    freeModalContent,           //自定义模板数据
    freeSuppleModalContent,     //补充数据

    onClose,
    onSubmit,
    orgSelectVisible,
    changeOrgSelectShow,
    goodsIntroArr,
    addGoodsIntro,
    removeGoodsIntroItem,

    categoryId,                //商品类目所有类别

    KouBeiGoodsChangeModalType,     //表单改变单选框状态(模板/自定义)

    freeTypeAddGoodsIntroItem,      //课程详情自定义时增加简介
    freeTypeRemoveGoodsIntroItem,   //课程详情自定义时删除简介

    freeTypeRemoveGoods,            //删除相应课程名称和详情
    freeTypeAddGoods,               //增加一组课程名称和详情

    freeContentTitleOnChange,       //课程名称输入框onChange事件
    detailContentOnChange,          //课程详情输入框onChange事件

    freeContentSuppleTitleOnChange, //补充说明名称输入框onChange事件
    detailContentSuppleOnChange,    //补充说明详情输入框onChange事件

    form: {
        getFieldDecorator,
        getFieldValue,
        getFieldsValue,
        setFieldsValue,
        validateFields,
        resetFields,
        getFieldError,
        validateFieldsAndScroll
    }
}) {

    //暂时处理由于模板类型发生变化导致课时数和每节时长数字框会出现中文的情况
    function KouBeiGoodsChangeModalTypeInner(e){
        if(getFieldValue('courseHour') != '' && getFieldValue('courseHour') != undefined && getFieldValue('courseHour') != null && !/^[\s]*$/.test(getFieldValue('courseHour'))){
            setFieldsValue({
                courseHour : undefined,
            });
        }
        if(getFieldValue('courseDuring') != '' && getFieldValue('courseDuring') != undefined && getFieldValue('courseDuring') != null && !/^[\s]*$/.test(getFieldValue('courseDuring'))){
            setFieldsValue({
                courseDuring : undefined,
            });
        }
        KouBeiGoodsChangeModalType(e)
    }

    //关闭窗口
    function onCloseClick() {
        resetFields();
        onClose && onClose();
    }
    //保存按钮
    function onSaveClick() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }

            //处理商品类别
            values.categoryId = (values.categoryId)[(values.categoryId).length - 1];

            //发送请求时编译后台所需结构(课程)
            let courseArray = [];
            freeModalContent.map((first,index) => {
                let obj = {};
                obj.title = first.title;
                let detailArr = [];
                first.details.map((details,index) => {
                    detailArr.push(details.value)
                });
                obj.details = detailArr;
                courseArray.push(obj);
            })

            //发送请求时编译后台所需结构(补充说明)
            let courseSuppleArray = [];
            let isPass = true;                  //是否可通过最终检验(默认可通过)
            freeSuppleModalContent.map((first,index) => {
                let titleNull = false;          //标题为空
                let detailsNotNull = false;     //内容不为空
                let obj = {};
                if(first.title == '' || first.title == null || first.title == undefined || /^[\s]*$/.test(first.title)){
                    titleNull = true;
                }
                obj.title = first.title;
                let detailArr = [];
                first.details.map((details,index) => {
                    if(details.value != '' && details.value != null && details.value != undefined && !/^[\s]*$/.test(details.value)){
                        detailsNotNull = true;
                        detailArr.push(details.value);
                    }
                });
                if(detailArr.length > 0){
                    obj.details = detailArr;
                }
                //标题和内容都为空 标题为空内容不为空 标题不为空内容为空 都不会通过检测(isPass变为false)
                if((titleNull == true && detailsNotNull == true) || (titleNull == false && detailsNotNull == false)){
                    isPass = false;
                }

                //标题和简介都不为空时才添加进数组
                if(titleNull == false && detailsNotNull == true){
                    courseSuppleArray.push(obj);
                }
            })

            if(!isPass){
                message.warn('若补充说明标题或补充说明内容其中一项已填写，则另一项必填');
                return isPass;
            }

            //选择类型是自定义模板类型时才封装自定义数据
            if(freeOrTemplate == '2'){
                values.descriptions = JSON.stringify(courseArray);
                values.buyer_notes = JSON.stringify(courseSuppleArray);
            }

            onSubmit(values, onCloseClick);
        });
    }

    let formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    };

    let formDataId = formData && formData.id;
    let goodsTypeName = goodsType == 'course' ? '课程' : '活动';

    let modal_title = (formDataId == undefined || formDataId == '') ?
        ( <span>新增{goodsTypeName} (<span className={styles.must_mark}></span>为必填)</span> )
    :   ( <span>修改{goodsTypeName} (<span className={styles.must_mark}></span>为必填)</span> );

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }

    /*校验图片*/
    function imageBeforeUpload(file) {
		if(file.size > 5242880) {
			message.error('图片大小过大');
			return false;
		}
		return true;
    }

    let uploadBtnProps = {
        action: BASE_URL+'/orderGoodController/img',
        listType: 'picture-card',
        beforeUpload : imageBeforeUpload,
        withCredentials: true,//上传请求时是否携带 cookie
    };

    /*显示门店选择窗口*/
    function closeOrgSelect(orgSelect) {
        if(orgSelect != undefined) {
            setFieldsValue({belongOrg: orgSelect});
        }
    }

    function getOrgSelectProps() {
        let orgSelectProps = {
            visible: orgSelectVisible,
            onClose: changeOrgSelectShow,
            afterSubmit: closeOrgSelect,
            init_org_select: getFieldValue('belongOrg'),
            commodityId: '201610200194070711',//口碑商品的插件服务号
            show_all_org:true,
        };
        return orgSelectProps;
    }


    /*上架时间的不可选日期*/
    function disabledOnlineTime(dateValue) {
        if(dateValue) {
            let today_begin = moment(moment().format('YYYY-MM-DD') + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss');
            return dateValue < today_begin;
        }
	    return false;
    }

    /*商品详情渲染*/
    let goodsIntroFormRender = [];
    if(goodsIntroArr && goodsIntroArr.length == 0 && freeOrTemplate == '1') {
        goodsIntroArr.push({
            key: 'goodsIntro_0',
            index: 0,
            value: '',
        });
    }

    if(freeOrTemplate == '1'){
        goodsIntroArr && goodsIntroArr.map(function(goodsIntroItem, goodsIntroIndex) {
            let formItemKey = goodsIntroItem.key;
            let formItemValue = goodsIntroItem.value;

            goodsIntroFormRender.push(
                <FormItem
                  labelCol={{ span: goodsIntroIndex === 0 ? 5 : 0 }}
                  wrapperCol={{ span: 18, offset: goodsIntroIndex === 0 ? 0 : 5 }}
                  label={goodsIntroIndex === 0 ? (goodsTypeName + '简介') : ''}
                  key={'goods_intro_formitem_' + goodsIntroItem.index}
                >
                {getFieldDecorator(formItemKey, {
                    initialValue: formItemValue,
                    rules: [
                        { required: true, message: '请输入' + goodsTypeName +'简介', },
                        { max: 100, message: '限100汉字以内', },
                        { validator: checkWrongWord },
                        { validator: checkOnlyNum },
                    ],
                  })(
                    <Input type="textarea" placeholder = { '请输入' + goodsTypeName + '简介' } autosize={{ minRows: 2, maxRows: 3 }} style={{width: '90%'}} />
                  )}
                  <Icon
                      className={styles.goods_intro_item_remove}
                      type="minus-circle-o"
                      onClick={() => removeGoodsIntroItem(formItemKey)}
                      title="删除简介"
                    />
                </FormItem>
            );
        });
        goodsIntroFormRender.push(
            <FormItem
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 18, offset: 5 }}
                  label=''
                  key={'goods_intro_formitem_btn'}
                >
                <Button type="primary" onClick={()=>addGoodsIntro()} className={styles.goods_intro_add_btn} >添加简介</Button>
            </FormItem>
        );
    }

    /*自定义商品详情数据渲染*/
    let freeModalContentRender = [];
    if(freeOrTemplate == '2'){
        freeModalContentRender = freeModalContent.map((modalContentItem,modalContentIndex) => {
            let fatherKey = modalContentItem.key;
            let freeModalInnerContentRender = [];
            freeModalInnerContentRender = (modalContentItem.details).map((modalContentDetailItem,modalContentDetailIndex) => {
                let OwnKey = modalContentDetailItem.key;
                return(
                    <div key={'free_goods_intro_formitem_detail' + OwnKey}>
                        <FormItem
                            labelCol={{ span : 5 }}
                            wrapperCol={{ span: 18, offset: 5 }}

                        >
                            {getFieldDecorator('free_goods_intro_formitem_detail'+OwnKey, {
                                initialValue: modalContentDetailItem.value,
                                rules: [
                                    { required: true, message: '请输入课程详情简介', },
                                    { max: 100, message: '限100汉字以内', },
                                    { validator: checkWrongWord },
                                    { validator: checkOnlyNum },
                                ],
                            })(
                            <Input type="textarea" placeholder = '请输入内容，最多允许100字，多的请通过右边加号按钮增加即可' autosize={{ minRows: 2, maxRows: 3 }} style={{width: '90%'}} onChange={detailContentOnChange}/>
                        )}
                            <Icon
                              className={modalContentDetailIndex == modalContentItem.details.length - 1 ? styles.goods_intro_item_remove_two : styles.goods_intro_item_remove}
                              type="minus-circle-o"
                              onClick={() => freeTypeRemoveGoodsIntroItem(fatherKey,OwnKey,'content')}
                              title="删除简介"
                            />
                            { modalContentDetailIndex == modalContentItem.details.length - 1 ?
                                <Icon
                                  className={styles.goods_intro_item_add}
                                  type="plus-circle-o"
                                  onClick={() => freeTypeAddGoodsIntroItem(fatherKey,OwnKey,'content')}
                                  title="增加简介"
                                />
                                :
                                null
                            }
                        </FormItem>
                    </div>
                );
            })
            return(
                <div key={'free_goods_intro_formitem_title' + fatherKey}>
                    <FormItem
                        labelCol={{ span: modalContentIndex === 0 ? 5 : 0 }}
                        wrapperCol={{ span: 18, offset: 5 }}
                        label=''
                    >
                        {getFieldDecorator('free_goods_intro_formitem_title' + fatherKey, {
                            initialValue: modalContentItem.title,
                            rules: [
                                { required: true, message: '请输入课程详情标题', },
                                { max: 15, message: '限15汉字以内', },
                                { validator: checkWrongWord },
                                { validator: checkOnlyNum },
                            ],
                        })(
                        <Input placeholder = '请输入标题，最多允许15字' style={{width: '100%'}} onChange={freeContentTitleOnChange}/>
                    )}
                    </FormItem>
                    { freeModalInnerContentRender || [] }
                    <Button type = 'primary' style={{margin:'0 20px 10px 20.8%'}} onClick={() => freeTypeRemoveGoods(fatherKey,'content')}>删除此组</Button>
                    { modalContentIndex ==  freeModalContent.length -1 ?
                        <Button type = 'ghost' onClick={() => freeTypeAddGoods(fatherKey,'content')}>增加一组</Button> : null
                    }
                </div>
            );
        })
    }

    //自定义补充说明渲染
    let freeModalSuppleContentRender = [];
    if(freeOrTemplate == '2'){
        freeModalSuppleContentRender = freeSuppleModalContent.map((modalContentItem,modalContentIndex) => {
            let fatherKey = modalContentItem.key;
            let freeModalInnerSuppleContentRender = [];
            freeModalInnerSuppleContentRender = (modalContentItem.details).map((modalContentDetailItem,modalContentDetailIndex) => {
                let OwnKey = modalContentDetailItem.key;
                return(
                    <div key={'free_goods_supple_intro_formitem_detail' + OwnKey}>
                        <FormItem
                            labelCol={{ span : 5 }}
                            wrapperCol={{ span: 18, offset: 5 }}

                        >
                            {getFieldDecorator('free_goods_supple_intro_formitem_detail' + OwnKey, {
                                initialValue: modalContentDetailItem.value,
                                rules: [
                                    { max: 100, message: '限100汉字以内', },
                                    { validator: checkWrongWord },
                                ],
                            })(
                            <Input type="textarea" placeholder = '请输入内容，最多允许100字，多的请通过右边加号按钮增加即可' autosize={{ minRows: 2, maxRows: 3 }} style={{width: '90%'}} onChange={detailContentSuppleOnChange}/>
                        )}
                            <Icon
                              className={modalContentDetailIndex == modalContentItem.details.length - 1 ? styles.goods_intro_item_remove_two : styles.goods_intro_item_remove}
                              type="minus-circle-o"
                              onClick={() => freeTypeRemoveGoodsIntroItem(fatherKey,OwnKey,'suppleContent')}
                              title="删除简介"
                            />
                            { modalContentDetailIndex == modalContentItem.details.length - 1 ?
                                <Icon
                                  className={styles.goods_intro_item_add}
                                  type="plus-circle-o"
                                  onClick={() => freeTypeAddGoodsIntroItem(fatherKey,OwnKey,'suppleContent')}
                                  title="增加简介"
                                />
                                :
                                null
                            }
                        </FormItem>
                    </div>
                );
            })
            return(
                <div key={'free_goods_supple_intro_formitem_title' + fatherKey}>
                    <FormItem
                        labelCol={{ span: modalContentIndex === 0 ? 5 : 0 }}
                        wrapperCol={{ span: 18, offset: 5 }}
                        label=''
                    >
                        {getFieldDecorator('free_goods_supple_intro_formitem_title' + fatherKey, {
                            initialValue: modalContentItem.title,
                            rules: [
                                { max: 15, message: '限15汉字以内', },
                                { validator: checkWrongWord },
                            ],
                        })(
                        <Input placeholder = '请输入标题，最多允许15字' style={{width: '100%'}} onChange={freeContentSuppleTitleOnChange}/>
                    )}
                    </FormItem>
                    { freeModalInnerSuppleContentRender || [] }
                    <Button type = 'primary' style={{margin:'0 20px 10px 20.8%'}} onClick={() => freeTypeRemoveGoods(fatherKey,'suppleContent')}>删除此组</Button>
                    { modalContentIndex ==  freeSuppleModalContent.length -1 ?
                        <Button type = 'ghost' onClick={() => freeTypeAddGoods(fatherKey,'suppleContent')}>增加一组</Button> : null
                    }
                </div>
            );
        })
    }

    //表单校验相关方法

    /*
     * 校验商品现价
     */
    function checkGoodsPrice(rule, value, callback) {
        let price = parseFloat( (getFieldValue('price') || 0) + '');
		let yuanjia = parseFloat( (getFieldValue('originalPrice') || 0) + '');

        if(price > 0) {
			if(price >= 0.01) {
				if(price > 5000) {
					callback('现价不能超过5000');
				} else if(yuanjia > 0 && price > yuanjia) {
					callback('现价必须小于原价');
				} else {
					callback();
				}
			} else {
				callback('价格至少为0.01');
			}
		} else {
			callback();
		}
    }
    /*
     * 校验商品原价
     */
    function checkGoodsYuanjia(rule, value, callback) {
        let price = parseFloat( (getFieldValue('price') || 0) + '');
		let yuanjia = parseFloat( (getFieldValue('originalPrice') || 0) + '');

        if(yuanjia > 0) {
			if(yuanjia >= 0.01) {
				if(price > yuanjia) {
					callback('原价必须大于现价');
				} else {
					if(yuanjia > 5000) {
                        callback('原价不能超过5000');
                    } else {
                        callback();
                    }
				}
			} else {
				callback('价格至少为0.01');
			}
		} else {
			callback('请输入原价');
		}
    }

    /*获取 商品分享的数据*/
    function getGoodsPreviewData() {
        let params = getFieldsValue();
        //口碑商品简介
        let goodsIntroValueArr = [];
        goodsIntroArr && goodsIntroArr.map(function(introItem) {
            let introItemKey = introItem.key;
            goodsIntroValueArr.push(params[introItemKey]);
        });

        params.courseType = params.courseType ? params.courseType.join(' ') : '';
        params.age = params.age ? params.age.join(' ') : '';

        if(params.activityTime && params.activityTime.length > 0) {
            let s_moment = params.activityTime[0].format('YYYY-MM-DD HH:mm:ss');
            let e_moment = params.activityTime[1].format('YYYY-MM-DD HH:mm:ss');
            params.activityTime = s_moment + '~' + e_moment;
        }
        return Object.assign(params, {goodsType}, {goodsIntro: goodsIntroValueArr},{freeModalContent : freeModalContent},{freeSuppleModalContent : freeSuppleModalContent},{freeOrTemplate : freeOrTemplate});
    }

    return (
        <Modal
            title={modal_title}
            visible={visible}
            maskClosable={false}
            closable={true}
            okText="保存"
            onOk={onSaveClick}
            cancelText="取消"
            onCancel={onCloseClick}
            width={940}
        >
           <div className='koubei_goods_form_cont'>

               <div className={styles.goods_info_cont}>

                   <Form>

                       <div className={styles.form_item_title}>
                           基本信息
                       </div>

                        {getFieldDecorator('id', {
                            initialValue: formDataId,
                          })(
                            <Input type="hidden" />
                          )}

                          {getFieldDecorator('goodsType', {
                            initialValue: goodsType,
                          })(
                            <Input type="hidden" />
                          )}

                        <FormItem
                          {...formItemLayout}
                          label={goodsTypeName + '名称'}
                          help={(
                            <div>
                                <p>限20汉字，禁止输入以下关键字：储值卡、充值卡、会员卡、vip卡、充值卡、打折卡、年卡、美容卡、健身卡</p>
                                <span className={styles.form_validate_msg}>{(getFieldError('goodsName') || []).join(', ')}</span>
                            </div>
                           )}
                        >
                        {getFieldDecorator('subject', {
                            initialValue: formData && formData.subject,
                            rules: [
                                { required: true, message: '请输入' + goodsTypeName +'名称', },
                                { max: 20, message: '限20汉字以内', },
                                { validator: checkWrongWord },
                                { validator: checkOnlyNum },
                            ],
                          })(
                            <Input placeholder={'请输入' + goodsTypeName +'名称'}/>
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={goodsTypeName + '封面'}
                          help={(
                            <div>
                                <p>商品首图。支持png,jpeg,gif格式的图片,建议宽高比16:9,建议宽高: 1242*698px 图片大小≤5M</p>
                                <span className={styles.form_validate_msg}>{(getFieldError('fengmian') || []).join(', ')}</span>
                            </div>
                           )}
                        >
                        {getFieldDecorator('fengmian', {
                            initialValue: formData && formData.fengmian,
                            rules: [{
                              required: true, message: '请选择' + goodsTypeName +'封面',
                            }],
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                          })(
                            <Upload {...uploadBtnProps} >
                             {(getFieldValue('fengmian') && getFieldValue('fengmian').length > 0) ?
                                null
                                :
                                <div>
                                    <Icon type="plus" />
                                    <div className={styles.img_upload_text}>选择{goodsTypeName}封面</div>
                                </div>
                             }
                            </Upload>
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={goodsTypeName + '详情图片'}
                          help={(
                            <div>
                                <p>商品详情图,最多5张.支持png,jpeg,gif格式的图片,建议宽高比16:9,建议宽高: 1242*698px 图片大小≤5M</p>
                                <span className={styles.form_validate_msg}>{(getFieldError('fengmian') || []).join(', ')}</span>
                            </div>
                           )}
                        >
                        {getFieldDecorator('detailImg', {
                            initialValue: formData && formData.detailImg,
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                          })(
                            <Upload {...uploadBtnProps} >
                             {(getFieldValue('detailImg') && getFieldValue('detailImg').length > 4) ?
                                null
                                :
                                <div>
                                    <Icon type="plus" />
                                    <div className={styles.img_upload_text}>选择{goodsTypeName}详情图片</div>
                                </div>
                             }
                            </Upload>
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={goodsTypeName + '现价'}
                        >
                        {getFieldDecorator('price', {
                            initialValue: formData && formData.price,
                            rules: [
                                { validator: checkGoodsPrice },
                            ],
                          })(
                            <InputNumber min={0} step={0.01} placeholder={'请输入' + goodsTypeName + '现价'} style={{width : '100%'}} />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={goodsTypeName + '原价'}
                        >
                        {getFieldDecorator('originalPrice', {
                            initialValue: formData && formData.originalPrice,
                            rules: [
                                { required: true, message: '请输入' + goodsTypeName +'原价', },
                                { validator: checkGoodsYuanjia },
                            ],
                          })(
                            <InputNumber min={0} step={0.01} placeholder={'请输入' + goodsTypeName + '原价'} style={{width : '100%'}} />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={goodsTypeName + '库存'}
                        >
                        {getFieldDecorator('inventory', {
                            initialValue: formData && formData.inventory,
                            rules: [{
                              required: true, message: '请输入' + goodsTypeName +'库存',
                            }],
                          })(
                            <InputNumber min={1} max={9999} step={1} placeholder={'必须设置为1~9999中某个整数'} style={{width : '100%'}} />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={'排序值'}
                        >
                        {getFieldDecorator('weight', {
                            initialValue: formData && formData.weight || '0',
                          })(
                            <InputNumber min={0} max={9999} step={1} placeholder={'设置为0~9999中某个整数;用户在浏览时排序值大的会排在前面'} style={{width : '100%'}} />
                          )}
                        </FormItem>

                        <FormItem
                          {...formItemLayout}
                          label={'适用门店'}
                        >
                        {getFieldDecorator('belongOrg', {
                            initialValue: (formData && formData.belongOrg) || window._init_data.koubei_org_list_id,
                            rules: [{
                              required: true, message: '请选择适用门店',
                            }],
                          })(
                            <div className={styles.select_org_cont}>
                                <span className={styles.select_org_text}>{getFieldValue('belongOrg') ? getFieldValue('belongOrg').length : 0} 家</span>
                                <Button type="primary" onClick={()=>changeOrgSelectShow()} >选择</Button>
                                <KoubeiOrgGoodsSelect {...getOrgSelectProps()}/>
                            </div>
                          )}
                        </FormItem>

                       {!!(formDataId == undefined) &&
                        <div className={styles.on_line_time_cont}>
                            <FormItem
                              labelCol={{ span: 9 }}
                              wrapperCol={{ span: 14 }}
                              label={'上架时间'}
                              className={styles.on_line_time_type_cont}
                            >
                            {getFieldDecorator('gmtStartType', {
                                initialValue: formData && formData.onLineTimeType || '1',
                                rules: [{
                                  required: true, message: '请选择' + goodsTypeName +'上架时间',
                                }],
                              })(
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder="请选择上架时间"
                                  >
                                    <Option value="1">立即上架</Option>
                                    <Option value="2">指定时间</Option>
                                  </Select>
                              )}
                            </FormItem>

                            {!!(getFieldValue('gmtStartType') == '2') &&
                                <FormItem
                                  labelCol={{ span: 0 }}
                                  wrapperCol={{ span: 18 }}
                                  label=''
                                  className={styles.on_line_time_value_cont}
                                >
                                {getFieldDecorator('gmtStart', {
                                    initialValue: formData && formData.onLineTimeValue,
                                    rules: [{
                                      required: (getFieldValue('gmtStartType') == '2'), message: '请选择' + goodsTypeName +'上架时间',
                                    }],
                                  })(
                                    <DatePicker
                                        showTime
                                        disabledDate={disabledOnlineTime}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请选择时间"
                                        style={{width : '100%'}}
                                    />
                                  )}
                                </FormItem>
                            }
                        </div>
                       }

                        <FormItem
                          {...formItemLayout}
                          label={'有效天数'}
                        >
                        {getFieldDecorator('validityPeriod', {
                            initialValue: formData && formData.validityPeriod,
                            rules: [{
                              required: true, message: '请输入' + goodsTypeName +'有效天数',
                            }],
                          })(
                            <InputNumber min={7} max={360} step={1} placeholder={'用户购买后多少天之内可以使用,过期作废,钱自动退回到用户账户'} style={{width : '100%'}} />
                          )}
                        </FormItem>

                       <FormItem
                            label="商品类目"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('categoryId', {
                                initialValue : formData && formData.categoryPath || [],
                            })(
                                <Cascader
                                    placeholder='请选择商品类目'
                                    options={categoryId}
                                    expandTrigger="hover"/>
                            )}
                        </FormItem>

                       <div style={{lineHeight:'31px'}}>
                            <FormItem
                                {...formItemLayout}
                                label={'请选择类型'}
                            >
                            {getFieldDecorator('goodSrc', {
                                initialValue: freeOrTemplate,
                                rules: [{
                                  required: true, message: '请选择类型',
                                }],
                              })(
                                <RadioGroup onChange={KouBeiGoodsChangeModalTypeInner}>
                                    <Radio value='1'>早教模板</Radio>
                                    <Radio value='2'>自定义</Radio>
                                </RadioGroup>
                              )}
                            </FormItem>
                       </div>

                       <div className={styles.form_item_title}>
                            {goodsTypeName}详情
                       </div>

                       <QueueAnim
                            type={freeOrTemplate == '1' ? ['left', 'right'] : ['right', 'left']}
                            ease={['easeOutQuart', 'easeInOutQuart']}
                            className="common-search-queue" >
                            { freeOrTemplate == '1' ?
                                <div key='modalType'>
                                    <QueueAnim
                                        type={['top', 'top']} >
                                        {goodsIntroFormRender}
                                    </QueueAnim>

                                   {!!(goodsType == 'activity') &&
                                   <FormItem
                                      {...formItemLayout}
                                      label={'活动时间'}
                                    >
                                    {getFieldDecorator('activityTime', {
                                        initialValue: formData && formData.activityTimeArr,
                                        rules: [{
                                          required: true, message: '请选择活动时间',
                                        }],
                                      })(
                                        <RangePicker
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            style={{width : '100%'}}
                                        />

                                      )}
                                    </FormItem>
                                   }

                                   {!!(goodsType == 'activity') &&
                                   <FormItem
                                      {...formItemLayout}
                                      label={'活动地址'}
                                    >
                                    {getFieldDecorator('activityAddr', {
                                        initialValue: formData && formData.activityAddr,
                                        rules: [
                                            { required: true, message: '请输入活动地址', },
                                            { max: 100, message: '限100汉字以内', },
                                            { validator: checkWrongWord },
                                            { validator: checkOnlyNum },
                                        ],
                                      })(
                                        <Input type="textarea" placeholder={'请输入活动地址'} autosize={{ minRows: 2, maxRows: 3 }} style={{width: '100%'}} />
                                      )}
                                    </FormItem>
                                   }

                                   {!!(goodsType == 'course') &&
                                   <FormItem
                                      {...formItemLayout}
                                      label={'课程类型'}
                                    >
                                    {getFieldDecorator('courseType', {
                                        initialValue: formData && formData.courseType,
                                        rules: [{
                                          required: true, message: '请选择课程类型',
                                        }],
                                      })(
                                        <CheckboxGroup options={courseTypeCheckList} />
                                      )}
                                    </FormItem>
                                   }

                                    <FormItem
                                      {...formItemLayout}
                                      label={'适合年龄'}
                                    >
                                    {getFieldDecorator('age', {
                                        initialValue: formData && formData.age,
                                        rules: [{
                                          required: true, message: '请选择适合年龄',
                                        }],
                                      })(
                                        <CheckboxGroup options={ageCheckList} />
                                      )}
                                    </FormItem>

                                    {!!(goodsType == 'course') &&
                                       <FormItem
                                          {...formItemLayout}
                                          label={'课时数'}
                                        >
                                        {getFieldDecorator('courseHour', {
                                            initialValue: formData && formData.keshishu,
                                            rules: [{
                                              required: true, message: '请输入请输入课时数',
                                            }],
                                          })(
                                            <InputNumber min={0} step={1} placeholder={'请输入请输入课时数'} style={{width : '100%'}} />
                                          )}
                                        </FormItem>
                                   }

                                   {!!(goodsType == 'course') &&
                                       <FormItem
                                          {...formItemLayout}
                                          label={'每节时长'}
                                        >
                                        {getFieldDecorator('courseDuring', {
                                            initialValue: formData && formData.courseLong,
                                            rules: [{
                                              required: true, message: '请输入每节时长',
                                            }],
                                          })(
                                            <InputNumber min={0} step={1} placeholder={'请输入每节时长(单位为分钟)'} style={{width : '100%'}} />
                                          )}
                                        </FormItem>
                                   }
                                </div>
                               :
                                <div key='freeType' className='koubei_goods_form_free_type'>
                                    { freeModalContentRender || [] }
                                </div>
                            }

                        </QueueAnim>



                       <div className={styles.form_item_title}>
                          补充信息
                       </div>

                            { freeOrTemplate == '1' ?
                                <div>
                                    <FormItem
                                      {...formItemLayout}
                                      label={'预约信息'}
                                    >
                                    {getFieldDecorator('reservation', {
                                        initialValue: formData && formData.reservation,
                                        rules: [
                                            { max: 100, message: '限100汉字以内', },
                                            { validator: checkWrongWord },
                                            { validator: checkOnlyNum },
                                        ],
                                      })(
                                        <Input placeholder={'请输入预约信息'} style={{width: '100%'}}  type="textarea" autosize={{ minRows: 2, maxRows: 3 }} />
                                      )}
                                    </FormItem>

                                    <FormItem
                                      {...formItemLayout}
                                      label={'适用人群'}
                                    >
                                    {getFieldDecorator('fitPerson', {
                                        initialValue: formData && formData.fitPerson,
                                        rules: [
                                            { max: 100, message: '限100汉字以内', },
                                            { validator: checkWrongWord },
                                            { validator: checkOnlyNum },
                                        ],
                                      })(
                                        <Input placeholder={'请输入适用人群'} style={{width: '100%'}}  type="textarea" autosize={{ minRows: 2, maxRows: 3 }} />
                                      )}
                                    </FormItem>

                                    <FormItem
                                      {...formItemLayout}
                                      label={'规则提醒'}
                                    >
                                    {getFieldDecorator('ruleRemind', {
                                        initialValue: formData && formData.ruleRemind,
                                        rules: [
                                            { max: 100, message: '限100汉字以内', },
                                            { validator: checkWrongWord },
                                            { validator: checkOnlyNum },
                                        ],
                                      })(
                                        <Input placeholder={'请输入规则提醒'} style={{width: '100%'}} type="textarea" autosize={{ minRows: 2, maxRows: 3 }} />
                                      )}
                                    </FormItem>
                                </div>
                                :
                                <div key='freeTypeSupple' className='koubei_goods_supple_form_free_type'>
                                    { freeModalSuppleContentRender || [] }
                                </div>
                            }

                   </Form>

               </div>

               <div className={styles.goods_preview_cont}>
                    <KoubeiGoodsPreview koubeiGoods={getGoodsPreviewData()} />
               </div>

           </div>

        </Modal>
    );
}

export default Form.create()(KoubeiGoodsFormComponent);
