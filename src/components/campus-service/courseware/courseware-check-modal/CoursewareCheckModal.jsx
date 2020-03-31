import React from 'react';
import { Modal , Form , Icon , InputNumber , Input , Popover , Slider } from 'antd';
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';
import standard from './standard';
import rotate from './rotate.json';
import styles from './CoursewareCheckModal.less';

/*查看课件modal*/
function CoursewareCheckModal({
    dp,                                         //封装dispatch方法
    coursewareCheckModalVisible,                //modal是否显示
    coursewareCheckModalImgTenantId,            //租户id
    coursewareCheckModalImgCourseId,            //课件id
    coursewareCheckModalImgTotal,               //modal课件图片个数
    coursewareCheckModalImgIndex,               //课件图片分页(默认是1)
    coursewareCheckModalImgRatio,               //课件图片宽高
    coursewareCheckModalCurrentUrl,             //当前显示课件的图片url
    show_standard_length,                       //具体显示的标准长度

    CoursewareCheckModalChangePage,             //课件分页改变
    CoursewareCheckModalClose,                  //关闭查看课件modal

    courseType,    //课件上传类型
    courseVideoSrc , //课件地址
    coursewareCheckModalCancel,

    form: {
        getFieldDecorator,
        validateFields,
        setFieldsValue,
        getFieldsValue,
        resetFields,
        getFieldValue,
        validateFieldsAndScroll,
    },
}){

    let {
        small_large_height_standard,
        small_large_width_standard,
        large_standard_length,
        small_standard_length,
        img_operation_interval,
        operation_height,
        minMultiple,
        maxMultiple
    } = standard;

    //初始化进入页面(因为标准在当前目录standard下，所以初始化在此做处理，不在modal文件中做处理)
    show_standard_length = document.body.clientHeight < small_large_height_standard || document.body.clientWidth < small_large_width_standard ? small_standard_length : large_standard_length;

    //页面宽高动态变更时
    window.onresize = function(){
        dp('courseware/updateState' , { show_standard_length : document.body.clientHeight < small_large_height_standard || document.body.clientWidth < small_large_width_standard ? small_standard_length : large_standard_length });
    }

    //modal直属子div的宽高
    /* coursewareCheckModalImgRatio 图片宽/图片高(宽高比)
     * maxMultiple 最大倍率
     * 当coursewareCheckModalImgRatio <= 1 的时
     * 最大宽度 = 标准 * 最大倍率 * 宽高比。标准宽度 = 标准 * 宽高比
     * 最大高度 = 标准 * 最大倍率。标准高度 = 标准
     *
     * 当coursewareCheckModalImgRatio > 1 的时
     * 最大宽度 = 标准 * 最大倍率。标准宽度 = 标准
     * 最大高度 = 标准 * 最大倍率 / 宽高比。标准高度 = 标准 / 宽高比
     *
     * 设计思路:保证标准宽度和标准高度其中一项是标准值，另一项通过宽高比来计算
     */
    let judgement = coursewareCheckModalImgRatio <= 1;
//    let modalWidth = judgement ? show_standard_length * maxMultiple * coursewareCheckModalImgRatio : show_standard_length * maxMultiple;
//    let modalHeight = judgement ? show_standard_length * maxMultiple + img_operation_interval + operation_height : show_standard_length * maxMultiple / coursewareCheckModalImgRatio + img_operation_interval + operation_height; //加最后两个是为了图片和操作栏隔开和设置操作栏高度

    let modalWidth = document.body.clientWidth;
    let modalHeight = modalWidth / coursewareCheckModalImgRatio + img_operation_interval + operation_height;

    //图片最外层div宽高
    let imgOutWidth = judgement ? show_standard_length * maxMultiple * coursewareCheckModalImgRatio : show_standard_length * maxMultiple;
    let imgOutHeight = imgOutWidth / coursewareCheckModalImgRatio;

    //背景图片size
    let bgSizeWidth = judgement ? show_standard_length * coursewareCheckModalImgRatio : show_standard_length;
    let bgSizeHeight = bgSizeWidth / coursewareCheckModalImgRatio;
    //模态框的属性
    let modalOpts = {
        title : undefined,
        maskClosable : false,
        visible : coursewareCheckModalVisible,
        closable : false,
        width : modalWidth,
        //onOk : handleComplete,
        //onCancel : CoursewareCheckModalClose,
        footer : [],
        className : 'courseware_check_modal'
    };

    //获取最后计算的属性名称
    let targetName = undefined;
    for(let i = 0 , len = rotate.length ; i < len ; i++){
        if(!!rotate[i].main){ targetName = rotate[i].id ; break ; }
    }

    function ChangeRotate(angle){
        let obj = {};
        obj[targetName] = getFieldValue(targetName) + parseFloat(angle);
        setFieldsValue(obj);
    }
     //模态框的属性
    let modalOpts2 = {
        maskClosable : false,
        visible : coursewareCheckModalVisible,
        closable : true,
        width : 600,
        onOk: coursewareCheckModalCancel,
        onCancel : coursewareCheckModalCancel,
        footer : null,
        className : 'modalOpts2'
   };

    return (
        <div>
            {!!courseType && courseType=='3'?
            <Modal {...modalOpts2}>
                <div>
                    <Video
                        width='500'
                        height='300'
                        controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen']}
                        src={courseVideoSrc}></Video>
                </div>
            </Modal>
            :
             <Modal {...modalOpts}>
                  <div className = { styles.img_and_operation }
                      style = {{
                        width : `${modalWidth* (getFieldValue('slider') || 20) / 20 }px`,
                        height : `${modalHeight* (getFieldValue('slider') || 20) / 20}px`
                    }}>
                    <div className = { styles.right_top_close } onClick = { CoursewareCheckModalClose }>
                        <Icon className = { styles.right_top_close_icon } type = 'close'/>
                    </div>
                    <div className = { styles.img }
                        style = {{
                            width : `${ bgSizeWidth * (getFieldValue('slider') || 20) / 20 }px`,
                            height : `${ bgSizeHeight * (getFieldValue('slider') || 20) / 20 }px`,
                            overflow : 'auto',
                            backgroundImage : coursewareCheckModalCurrentUrl ,
                            backgroundSize : `${ bgSizeWidth * (getFieldValue('slider') || 20) / 20 }px ${ bgSizeHeight * (getFieldValue('slider') || 20) / 20 }px`,
                            backgroundPosition: `top left`,
                            transform : `rotate(${getFieldValue(targetName)}deg)`
                        }}>
                    </div>
                    <div style = {{ height : img_operation_interval }}></div>
                    <div className = { styles.operation } style = {{ height : operation_height }}>
                        <div style = {{ width : 55 }}>
                            {getFieldDecorator('slider',{
                                initialValue : !!minMultiple ? minMultiple * 20 : 20
                            })(
                                <Slider min = { !!minMultiple ? minMultiple * 20 : 20 } max = { !!maxMultiple ? maxMultiple * 20 : 20 } tipFormatter = { null }/>
                            )}
                        </div>
                        <Icon className = { styles.operation_icon } type = 'step-backward' onClick = {() => CoursewareCheckModalChangePage('-',coursewareCheckModalImgIndex)}/>
                        <InputNumber min = { 1 } max = { coursewareCheckModalImgTotal } size = 'default' style = {{ width : 60 , background : 'transparent' }} value = { coursewareCheckModalImgIndex } onChange = {(e) => CoursewareCheckModalChangePage('free',e)}/>
                        <Icon className = { styles.operation_icon } type = 'step-forward' onClick = {() => CoursewareCheckModalChangePage('+',coursewareCheckModalImgIndex)}/>
                        <div style = {{ color : '#fff' }}>共{ coursewareCheckModalImgTotal }张</div>
                        { rotate && rotate.map((item,index) =>
                            <div key = { item.id } onClick = { !item.display ? () => ChangeRotate(item.angle) : null } style = { !!item.display ? { display : item.display } : null }>
                                {getFieldDecorator(item.id,{
                                    initialValue : 0
                                })(
                                    <Input type = 'hidden'/>
                                )}
                                <Icon className = { styles.operation_icon } type = { item.icon } />
                            </div>
                        )}
                        <Icon className = { styles.operation_icon } type = 'close' onClick = { CoursewareCheckModalClose }/>
                    </div>
                </div>

            </Modal>
             }
    </div>
    );
}

export default Form.create()(CoursewareCheckModal);
