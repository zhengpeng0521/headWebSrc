import React from 'react';
import { message , InputNumber , Popover , Form , DatePicker , Select } from 'antd';
import { NullData } from '../../../common/new-component/NewComponent';
import QueueAnim from 'rc-queue-anim';
import thead from './thead.json';
import styles from './NewFollowCoursePrintArea.less';

/*cerp按课程打印签到表(因为需要打印，所以打印的样式必须写在js中)*/
function NewFollowCoursePrintArea({
    dp,
    wetherClickRouteIn,         //是否是点击路由进入
    listData,                   //列表数据
    courseSelectContent,        //搜课程搜索栏数据
    DateOnChange,               //日期onChange事件
    CourseOnChange,             //课程下拉列表onChange事件
    form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        resetFields,
        getFieldValue,
        setFieldsValue,
        validateFieldsAndScroll,
    }
}) {

    //如果是点击路由进入则清空所有
    if(!!wetherClickRouteIn){
        resetFields();
        dp('newFollowCoursePrint/updateState',{ wetherClickRouteIn : false })
    }

    function DateOnChangeClearCourse(date,dateString){
        if(!!getFieldValue('course')){
            setFieldsValue({
                course : []
            })
        }
        DateOnChange(date,dateString);
    }

    //头部课程信息格式化DIV
    function FormatDiv({
        children
    }){
        return(
            <div style = {{ width : 'calc(100%/3)' , height : '100%' , lineHeight : '200%' , padding : '0 10px' , display : 'inline-block' , textAlign : 'center' , overflow : 'hidden' , whiteSpace : 'nowrap' , textOverflow : 'ellipsis' }}>
                { children }
            </div>
        )
    }


    //每一项的公共样式
    function commonStyle(width,index,type){
        return {
            width,
            height : 25 ,
            lineHeight : '25px' ,
            textAlign : 'center' ,
            borderLeft : index == 0 ? '1px solid #ddd' : 0 ,
            borderRight : '1px solid #ddd' ,
            borderBottom : type == 'thead' ? 0 : '1px solid #ddd' ,
            backgroundColor : '#fff',
            overflow : 'hidden',
            textOverflow : 'ellipsis',
            whiteSpace : 'nowrap',
            padding : '0 5px'
        }
    }

    let th = [];
    thead.map((item,index) => {
        th.push(
            <div key = { 'thead_' + index }
                style = { commonStyle(item.width,index,'thead') }>
                { item.name }
            </div>
        )
    })

    //将上课补课试听三个数组格式化的方法
    function formatStuArrItem(stuArr,zj_type,formatArr){
        if(stuArr && stuArr.length > 0){
            stuArr.map((item,index) => {
                item.zj_type = zj_type;
                formatArr.push(item);
            });
        }
        return formatArr;
    }

    function render_tr(item){
        let { stuArr , mulStuArr , tryStuArr } = item;
        let returnArr = [];         //返回的数组
        let formatArr = [];         //需要格式化的数组
        formatArr = formatStuArrItem(stuArr,'上课',formatArr);
        formatArr = formatStuArrItem(mulStuArr,'补课',formatArr);
        formatArr = formatStuArrItem(tryStuArr,'试听',formatArr);
        formatArr.map((format_item,format_index) => {
            //初始化每一项
            let tr_item = [];           //一行中的每一项
            thead.map((item,index) => {
                tr_item.push(
                    <div key = { 'initial_' + index + '_' + item.cpdId }
                        style = { commonStyle(item.width,index) }>
                    </div>
                )
            });
            thead.map((thead_item,thead_index) => {
                tr_item.splice(thead_index,1,
                    <div key = { format_index + '_' + thead_index + '_' + item.cpdId }
                        style = { commonStyle(thead_item.width,thead_index) }>
                        { thead_item.id == 'num' ? format_index + 1 : (format_item[thead_item.id] || '') }
                    </div>
                )
            });
            returnArr.push(
                <div key = { 'trow_' + format_index + '_' + item.cpdId } style = {{ width : '100%' , display : 'flex' }}>
                    { tr_item || [] }
                </div>
            )
        });
        return returnArr;
    }

    return (
        <div className={styles.all}>
            <div className={styles.search_area}>
                <div className={styles.search_area_item}>
                    {getFieldDecorator('singleDate')(
                        <DatePicker
                            placeholder = '请选择上课日期'
                            format = "YYYY-MM-DD"
                            size = 'default'
                            showToday
                            style = {{ width : 180 }}
                            onChange = { DateOnChangeClearCourse }/>
                    )}
                </div>
                { !!getFieldValue('singleDate') ?
                    <QueueAnim
                        type={['left', 'left']}
                        ease={['easeOutQuart', 'easeInOutQuart']}>
                        <div className={styles.search_area_item} key = 'course'>
                            {getFieldDecorator('course')(
                                <Select
                                    mode = 'multiple'
                                    placeholder = '请选择课程'
                                    size = 'default'
                                    allowClear
                                    showSearch
                                    optionFilterProp = "children"
                                    notFoundContent = "未找到"
                                    style = {{ minWidth : 220 , width : 'auto' }}
                                    onChange = {(e) => CourseOnChange(e,getFieldValue('course'))}>
                                    { !!courseSelectContent && courseSelectContent.length > 0 ?
                                        courseSelectContent.map((item,index) => {
                                            return <Select.Option key = { item.cpdId } value = { item.cpdId }>{ `${item.courseName}(${item.startTime}~${item.endTime})` }</Select.Option>
                                        })
                                        :
                                        []
                                    }
                                </Select>
                            )}
                        </div>
                    </QueueAnim>
                    :
                    null
                }
            </div>
            <div className={styles.print_area} id = 'new_cerp_follow_course_print'>
                <div style = {{ width : '100%' , height : '100%' }}>
                    <div style = {{ position : 'relative' , marginBottom : 10 , height : 30 }}>
                        <div style = {{ margin : '0 auto' , height : '100%' , lineHeight : '30px' , textAlign : 'center' , fontSize : '18px' , fontWeight : 700 }}>学员签到</div>
                    </div>
                    { listData && listData.length > 0 ?
                        listData.map((all_item,all_index) => {
                            return(
                                <div key = { all_index } style = {{ width : '100%' , marginBottom : 10 }}>
                                    <div style = {{ height : 80 , backgroundColor : '#f5f5f5' , width : '100%' , padding : '5px 0' , border : '1px solid #ddd' }} >
                                        <div style = {{ height : 'calc(100%/3)' , width : '100%' , display : 'flex' }}>
                                            <FormatDiv>课程名称:{ all_item.courseName || '--' }</FormatDiv>
                                            <FormatDiv>班级:{ all_item.clsName || '--' }</FormatDiv>
                                            <FormatDiv>编号:{ !isNaN(all_item.cpdId + '') ? all_item.cpdId + '' : '--' }</FormatDiv>
                                        </div>
                                        <div style = {{ height : 'calc(100%/3)' , width : '100%' , display : 'flex' }}>
                                            <FormatDiv>
                                                <Popover placement="top" content={ `主教:${ all_item.mtNames || '--' } / 助教:${ all_item.atNames || '--' }` } trigger="hover">
                                                    老师:{ ( all_item.mtNames || '--' ) + '/' + ( all_item.atNames || '--' ) }
                                                </Popover>
                                            </FormatDiv>
                                            <FormatDiv>教室:{ all_item.roomName || '--' }</FormatDiv>
                                            <FormatDiv>所属校区:{ all_item.orgName || '--' }</FormatDiv>
                                        </div>
                                        <div style = {{ height : 'calc(100%/3)' , width : '100%' , display : 'flex' }}>
                                            <FormatDiv>日期:{ all_item.studyDate || '--' }</FormatDiv>
                                            <FormatDiv>时间:{ ( all_item.startTime || '--' ) + '~' + ( all_item.endTime || '--' ) }</FormatDiv>
                                            <FormatDiv>
                                                <Popover placement="top" content={ `上课人数:${ all_item.num || 0 } / 补课人数:${ all_item.mulNum || 0 } / 试听人数:${ all_item.tryNum || 0 }` } trigger="hover">
                                                    人数:{ ( all_item.num || 0 ) + '/' + ( all_item.mulNum || 0 ) + '/' + ( all_item.tryNum || 0 ) }
                                                </Popover>
                                            </FormatDiv>
                                        </div>
                                    </div>
                                    <div style = {{ display : 'flex' , borderBottom : '1px solid #ddd' }}>
                                        { th || [] }
                                    </div>
                                    <div>
                                        { render_tr(all_item) }
                                    </div>
                                </div>
                            )
                        })
                        :
                        <NullData height = '300px' content = '当天无排课信息'/>
                    }
                </div>
            </div>
        </div>
    );
}

export default Form.create()(NewFollowCoursePrintArea);
