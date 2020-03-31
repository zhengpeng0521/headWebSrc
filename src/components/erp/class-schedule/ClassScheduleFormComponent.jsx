import React from 'react';
import styles from './ClassScheduleFormComponent.less';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import { Modal,Button,Form, Input,DatePicker,TimePicker,Select,Popover,Icon,message,Popconfirm } from 'antd';
import { BlockPicker } from 'react-color';
import moment from 'moment';
const FormItem = Form.Item;
const Option   = Select.Option;

/**
 * 课程表
 * 表单组件
 */
function ClassScheduleFormComponent ({
    visible, formLoading, formData, afterSubmit, onClose,resetFormModel,
    classRoomComList,classComList,courseComList,teacherComList,allStuComList,classStuComList,classStuComArr,
    remedialStuArr,remedialStuArrInit,resetRemedialStuArr,
    updateRemedialStuItem, updateClassProgress,updateClassStudent,onSubmitAction,
    remedialStuData,updateRemedialStuData,//补课学员的下拉框数据
    onOrgChange,deleteSchedule,changeClassTime,
    form: {
        getFieldDecorator,
        getFieldValue,
        setFieldsValue,
        validateFields,
        resetFields,
        validateFieldsAndScroll,
    }
}) {
    //上课时间不能选择
    function classDateDisableFunc(value) {
        return value < moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD');
    }

    //校验上课时间
	function classTimeValidator(rule, value, callback) {
		if(value && value.length == 2) {
			if(value[0] == '') {
                callback('请选择上课开始时间');
            } else if(value[1] == '') {
                callback('请选择上课结束时间');
            } else {
                if(value[0] > value[1]) {
                    callback('上课开始时间必须在结束时间之前');
                } else {
                    callback();
                }
            }
		} else {
			callback('请选择上课时间');
		}
	}

    /*timepick切换时*/
    function timePickChange(type, time, timeString) {

        let classTimeArr = getFieldValue('classTime');
        if(!(classTimeArr && classTimeArr.length == 2)) {
            classTimeArr = ['', ''];
        }
        if(type == 'classBeginTime') {
            classTimeArr[0] = timeString;
        } else if(type == 'classEndTime') {
            classTimeArr[1] = timeString;
        }
        changeClassTime(type, time, timeString);
        setFieldsValue({'classTime': classTimeArr});
        validateFields(['classTime']);
    }

    let classScheduleFormModalFoot = [
            <Button key="class_schedule_form_save" type="primary" onClick={onSaveClick} loading={formLoading}>保存</Button>,
        ];
    if(formData.cpId != undefined) {
        classScheduleFormModalFoot.push(
            <Popconfirm title="确认要删除吗?" onConfirm={()=>deleteSchedule(formData.orgId, formData.cpId)} okText="确定" cancelText="取消">
                <Button key="class_schedule_form_del" type="ghost" loading={formLoading}>删除</Button>
            </Popconfirm>
        );
    }
    classScheduleFormModalFoot.push(<Button key="class_schedule_form_cancle" type="ghost" onClick={onCloseClick} loading={formLoading}>取消</Button>);

    let formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 18 },
    };

    let weekTextArr = ['周日','周一','周二','周三','周四','周五','周六',];
    let monthTextArr = [];
    for(let i = 0; i < 31; i++) {
        monthTextArr.push((i + 1) + '号');
    }

    //解析cron表达式
    let cronExp = formData.cronExp;
    let cronExpArr = (cronExp && cronExp.length > 0) ? cronExp.split(' ') : undefined;
    //排课重复类型  排课重复类型的值
    let scheduleTypeRepeatType,scheduleTypeRepeatTypeValue;
    if(cronExpArr && cronExpArr.length  >= 6) {
        scheduleTypeRepeatType = cronExpArr[3] == '?' ? '1' : '2';
        scheduleTypeRepeatTypeValue = cronExpArr[3] == '?' ? (cronExpArr[5]-1)+'' : (cronExpArr[3]-1)+'';
    }

    /*班级切换时*/
    function classChange(value, option) {
        //补课时  更新班级进度
        if(getFieldValue('type') == '3') {
            resetFields(['classProgress']);
        } else if(getFieldValue('type') == '2') {
            resetFields(['normalStuArr']);
        }
        let courseId = option.props.courseId;

        let orgId = getFieldValue('orgId');
        if(orgId == undefined || orgId == '') {
            message.warn('请先选择门店');
            return;
        }
        updateClassStudent(value, courseId, orgId);
    }
    /*课程切换时*/
    function courseChange(value) {
        //补课时  更新课程下的相关下拉框数据
        if(getFieldValue('type') == '3') {
            let orgId = getFieldValue('orgId');
            if(orgId == undefined || orgId == '') {
                message.warn('请先选择门店');
                return;
            }
            resetRemedialStu();
            updateRemedialStuData(orgId, value);
        }
    }

    //上课学员
    let classStuArr = [];
    classStuComList && classStuComList.map(function(item) {
        classStuArr.push(item.stuId+'');
    });

    function scheduleColorChange(color) {
        setFieldsValue({'color': color.hex});
    }

    //排课颜色选择器
    let scheduleColorPick = (
        <div className={styles.schedule_color_pick}>
            <BlockPicker
               triangle="hide" color={getFieldValue('color') || '#1dafe4'}
                colors={[
                    '#523d87', '#8e4090', '#db3387', '#e776c8', '#7976e7',
                    '#1dafe4', '#0b7a3b', '#169f4e', '#97c24a', '#fbbc3c',
                    '#e76d39', '#d62436', '#d9c585', '#9e612f', '#772c1d'
                ]}
                onChangeComplete={scheduleColorChange}/>
        </div>
    );

    //补课学员的表单渲染
    let remedialStuRender = [];

    /*补课学员是否已经选择 某学员*/
    function hasSelectStu(stuId) {
        if(remedialStuArr && remedialStuArr.length > 0) {
            for(let i = 0; i < remedialStuArr.length; i++) {
                if(getFieldValue(remedialStuArr[i].key) == stuId) {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    /*增加补课学员选项*/
    function addRemedialStuItem() {
        let lastItem = remedialStuArr[remedialStuArr.length-1];
        let newIndex = lastItem.index + 1;
        remedialStuArr.push({
            key: 'remedialStu_' + newIndex,
            index: newIndex,
            value: undefined,
        });
        updateRemedialStuItem(remedialStuArr, true);
    }

    /*删减补课学员选项*/
    function removeRemedialStuItem(key) {
        if(remedialStuArr.length == 1) {
            message.warn('请至少保留一项补课学员');
            return;
        }

        let newList = [];
        remedialStuArr && remedialStuArr.length > 0 && remedialStuArr.map(function(item) {
            if(item.key != key) {
                newList.push(item);
            }
        });
        if(newList.length == 0) {
            newList.push({key: 'remedialStu_0', index: 0, value: undefined});
        }
        updateRemedialStuItem(newList, true);
    }

    /*获取 课程下  某学员的报课列表*/
    function getCourseStuClassList(stuId) {

        let courseStuList = [];

        if(stuId == undefined || stuId == '') {
            return courseStuList;
        }

        remedialStuData && remedialStuData.map(function(dataItem) {
            if(dataItem.stuId == stuId) {
                courseStuList = dataItem.clsList;
            }
        });

        return courseStuList;
    }

    /*获取学员的班级进度*/
    function getCourseStuClassProssList(stuId, classId) {
        let list = [];

        if(stuId == undefined || stuId == '' || classId == undefined || classId == '') {
            return list;
        }

        remedialStuData && remedialStuData.map(function(dataItem) {
            if(dataItem.stuId == stuId) {
                dataItem.clsList && dataItem.clsList.map(function(clsItem) {
                    if(clsItem.stuCourseId == classId) {
                        let maxProgress = clsItem.maxProgress || 50;
                        for(let i = 0; i < maxProgress; i++) {
                            list.push({
                                key: (i+1)+'',
                                name: '第' + (i+1) + '节课',
                            });
                        }
                    }
                });
            }
        });
        return list;
    }

    remedialStuArr && remedialStuArr.length > 0 && remedialStuArr.map(function(stuItem, stuIndex) {
        let leftLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14, offset: stuIndex == 0 ? 0 : 10 },
        };

        let middleLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
        };

        let rightLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
        };

        let courseStuClassRender = [];
        let courseStuClassList = getCourseStuClassList(getFieldValue(stuItem.key));

        if(courseStuClassList && courseStuClassList.length > 0) {
            courseStuClassList.map(function(cscItem) {
                courseStuClassRender.push(<Option key={cscItem.stuCourseId+''} value={cscItem.stuCourseId+''}>{cscItem.clsName}</Option>);
            });
        }

        remedialStuRender.push(
            <div key={'repeat_form_item_' + stuItem.key} className={styles.repeat_form_item_cont}>
                <FormItem
                      {...leftLayout}
                      label={stuIndex == 0 ? '补课学员' : ''}
                      className={styles.repeat_form_left_item}
                    >
                    {getFieldDecorator(stuItem.key, {
                        initialValue: stuItem.value,
                        rules: [
                            {required: (getFieldValue('type') == '3'), message: '请选择补课学员',},
                        ],
                      })(
                        <Select
                           placeholder="请选择补课学员"
                           allowClear
                           showSearch
                           optionFilterProp="children"
                           notFoundContent="没有学员"
                           style={{width: '95%'}}>
                            {remedialStuData && remedialStuData.map(function(item) {
                                return (<Option key={item.stuId+''} value={item.stuId+''} disabled={hasSelectStu(item.stuId)}>{item.stuName}</Option>);
                            })}
                        </Select>
                      )}
                  </FormItem>
                  <FormItem
                     {...middleLayout}
                      label=''
                      className={styles.repeat_form_mid_item}
                     >
                      {getFieldDecorator('courseClass_' + stuItem.key, {
                        initialValue: stuItem.stuCourseId,
                        rules: [
                            {required: (getFieldValue('type') == '3'), message: '请选择班级',},
                        ],
                      })(
                        <Select
                           placeholder="请选择班级"
                           allowClear
                           showSearch
                           optionFilterProp="children"
                           notFoundContent="没有班级"
                           style={{width: '95%'}}>
                            {getCourseStuClassList(getFieldValue(stuItem.key)) && getCourseStuClassList(getFieldValue(stuItem.key)).map(function(item) {
                                    return (<Option key={item.stuCourseId+''} value={item.stuCourseId+''}>{item.clsName}</Option>);
                                })}
                        </Select>
                      )}
                      </FormItem>

                      <FormItem
                             {...rightLayout}
                              label=''
                              className={styles.repeat_form_right_item}
                             >
                              {getFieldDecorator('courseClassPross_' + stuItem.key, {
                            initialValue: stuItem.progress == undefined ? undefined : stuItem.progress + '',
                            rules: [
                                {required: (getFieldValue('type') == '3'), message: '请选择班级进度',},
                            ],
                          })(
                            <Select
                               placeholder="请选择班级进度"
                               notFoundContent="没有进度"
                               style={{width: '95%'}}>
                                {getCourseStuClassProssList(getFieldValue(stuItem.key), getFieldValue('courseClass_' + stuItem.key)) && getCourseStuClassProssList(getFieldValue(stuItem.key), getFieldValue('courseClass_' + stuItem.key)).map(function(item) {
                                    return (<Option key={item.key+''} value={item.key+''}>{item.name}</Option>);
                                })}
                            </Select>
                          )}
                      </FormItem>

                      <div className={styles.form_item_bar}>
                          <Icon type="plus-circle-o" size="lg" className={styles.form_item_bar_item_left} onClick={()=> addRemedialStuItem()} />
                          <Icon type="minus-circle-o" size="lg" className={styles.form_item_bar_item_right} onClick={()=> removeRemedialStuItem(stuItem.key)} />
                      </div>
            </div>
        );
    });

    /*点击保存*/
    function onSaveClick() {
        validateFieldsAndScroll((err, values) => {
            if (!!err) {
                return;
            }
            //处理补课学员
            if(getFieldValue('type') == '3' && !remedialStuArrInit) {
                values.remedialStuArr = remedialStuArr;
            }
            onSubmitAction(values, onCloseClick);
        });
    }

    /*点击关闭*/
    function onCloseClick() {
        resetFormModel();//清除记录在model里的表单数据
        resetRemedialStu();
        resetFields();
        onClose();
    }

    //重置补课学员表单
    function resetRemedialStu() {
        if(remedialStuArr && remedialStuArr.length > 0) {
            let currentRstuKeys = [];
            remedialStuArr.map(function(rStuItem) {
                currentRstuKeys.push(rStuItem.key);
                currentRstuKeys.push('courseClass_'+rStuItem.key);
                currentRstuKeys.push('courseClassPross_' + rStuItem.key);
            });
            resetFields(currentRstuKeys);
            resetRemedialStuArr();
        }
    }

    /*门店选择切换*/
    function onOrgChangeClick(orgId) {
        resetFields(['classroomId', 'classId', 'courseId', 'ptArr', 'atArr', 'normalStuArr', 'auditionStuArr', ]);
        resetRemedialStu();
        onOrgChange && onOrgChange(orgId);
    }

    function range(start, end) {
      let result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    }

    /*上课时间的  小时禁用选项*/
    function timeDisabledHour(type) {
        let formClassTime = getFieldValue('classTime');
        let disArr = [];
        if(formClassTime && formClassTime.length == 2) {

            let classTimeItem = (type == 'beginTime') ? formClassTime[1] : formClassTime[0];

            if(classTimeItem != undefined && classTimeItem != '') {
                let arr = classTimeItem.split(':');
                if(arr && arr.length == 2) {
                    let h = parseInt(arr[0]);
                    let hours = range(0, 24);
                    disArr = (type == 'beginTime') ? hours.splice(h+1, 24-h) : hours.splice(0, h);
                }
            }
        }

        return disArr.concat(range(0, 7)).concat(range(23, 24));;
    }

    /*上课时间的  分钟禁用选项*/
    function timeDisabledMin(type, hour) {
        let formClassTime = getFieldValue('classTime');
        let disArr = [];
        if(formClassTime && formClassTime.length == 2) {
            let classTimeItem = (type == 'beginTime') ? formClassTime[1] : formClassTime[0];

            if(classTimeItem != undefined && classTimeItem != '') {
                let arr = classTimeItem.split(':');
                if(arr && arr.length == 2) {
                    let h = parseInt(arr[0]);
                    let m = parseInt(arr[1]);

                    let mins = range(0, 60);

                    if(hour == h) {
                        disArr = (type == 'beginTime') ? mins.splice(m, 60-h) : mins.splice(0, m+1);
                    }
                }
            }
        }
        return disArr;
    }

    function isTeacherOptDisabled(type, opt_value) {
        let form_item_value = getFieldValue(type);
        if(form_item_value && form_item_value.length > 0) {
            if(form_item_value.findIndex(function(value, index, arr) {
                return value == opt_value;
            }) > -1) {
                return true;
            }
        }
        return false;
    }

    return (
        <Modal
            title={(formData.cpId == undefined || formData.cpId == '') ? '新增排课' : '修改排课'}
            visible={visible}
            maskClosable={false}
            closable={true}
            onCancel={onCloseClick}
            width={550}
            className = 'class_schedule_form_modal'
            footer={classScheduleFormModalFoot}>

            <div className={styles.class_schedule_form_cont}>
                <Form>
                    {getFieldDecorator('cpId', {
                        initialValue: formData.cpId,
                      })(
                        <Input type="hidden" />
                      )}
                     <FormItem
                          {...formItemLayout}
                          label="校区"
                    >
                    {getFieldDecorator('orgId', {
                        initialValue: formData.orgId,
                        rules: [{
                          required : true, message : '请选择校区',
                        }],
                      })(
                        <TenantOrgFilter disabled = { !!formData.cpId } width = '100%' onChange = { ( orgId ) => onOrgChangeClick( orgId ) } />
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="时间"
                    >
                    {getFieldDecorator('classTime', {
                        initialValue: (formData && formData.startTime) ? [formData.startTime, formData.endTime] : undefined,
                        rules: [
                            {required: true, message: '请选择上课时间', type: 'array',},
                            { validator: classTimeValidator },
                        ],
                      })(
                        <div>
                            {/*<TimePicker disabledHours={()=>timeDisabledHour('beginTime')} disabledMinutes={(hour)=>timeDisabledMin('beginTime', hour)} style={{width: 120}} format="HH:mm" value={formData.startTime && moment(formData.startTime, 'HH:mm')} onChange={(time, timeString)=>timePickChange('classBeginTime', time, timeString)}/> */}
                            <TimePicker style={{width: 120}} format="HH:mm" value={formData.startTime && moment(formData.startTime, 'HH:mm')} onChange={(time, timeString)=>timePickChange('classBeginTime', time, timeString)}/>
                            <span>&nbsp;&nbsp;至&nbsp;&nbsp;</span>
                            <TimePicker disabledHours={()=>timeDisabledHour('endTime')} disabledMinutes={(hour)=>timeDisabledMin('endTime', hour)} style={{width: 120}} format="HH:mm" value={formData.endTime && moment(formData.endTime, 'HH:mm')} onChange={(time, timeString)=>timePickChange('classEndTime', time, timeString)}/>
                        </div>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="教室"
                    >
                    {getFieldDecorator('classroomId', {
                        initialValue: formData.roomId,
                        rules: [
                            {required: true, message: '请选择教室',},
                        ],
                      })(
                        <Select placeholder="请选择教室" optionFilterProp="children" showSearch allowClear style={{width: '100%'}} notFoundContent='没有教室'>
                            {classRoomComList && classRoomComList.map(function(item) {
                                return (<Option key={item.roomId+''} value={item.roomId+''}>{item.roomName}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>

                   <FormItem
                          {...formItemLayout}
                          label="排课方式"
                    >
                    {getFieldDecorator('scheduleType', {
                      })(
                        <div className={styles.schedule_type_cont}>
                           {getFieldDecorator('repeatable', {
                                initialValue: formData.repeatable || '0',
                            })(
                            <Select placeholder="请选择排课方式" style={{width: '120px', marginRight: 4}}>
                                <Option value="0">单次</Option>
                                <Option value="1">重复</Option>
                            </Select>
                            )}

                            {!!(getFieldValue('repeatable') == '1') &&
                                 <div style={{lineHeight: 'normal'}}>
                                {getFieldDecorator('scheduleTypeRepeatType', {
                                    initialValue: scheduleTypeRepeatType || '1'
                                })(
                                <Select style={{width: '120px', marginRight: 4}}>
                                    <Option value="1">每周</Option>
                                    <Option value="2">每月</Option>
                                </Select>
                                )}

                                {getFieldDecorator('scheduleTypeRepeatTypeValue', {
                                    initialValue: scheduleTypeRepeatTypeValue || '1'
                                })(
                                   <Select style={{width: '120px'}}>
                                    {(getFieldValue('scheduleTypeRepeatType')  == '1') ?
                                        weekTextArr.map(function(weekTextItem, weekTextIndex) {
                                            return (<Option key={'week_' + weekTextIndex} value={weekTextIndex+''}>{weekTextItem}</Option>);
                                        })
                                       :
                                        monthTextArr.map(function(monthTextItem, monthTextIndex) {
                                            return (<Option key={'month_' + monthTextIndex} value={monthTextIndex+''}>{monthTextItem}</Option>);
                                        })
                                    }
                                    </Select>
                                )}
                                </div>
                             }
                        </div>

                      )}
                    </FormItem>

                    {!!(getFieldValue('repeatable') == '0') &&
                    <FormItem
                          {...formItemLayout}
                          label="上课日期"
                    >
                    {getFieldDecorator('studyDate', {
                        initialValue: formData.studyDate ? moment(formData.studyDate, 'YYYY-MM-DD') : undefined,
                        rules: [{
                          required: (getFieldValue('repeatable') == '0'), message: '请选择上课日期', type: 'object',
                        }],
                      })(
                        <DatePicker style={{width: '100%'}} format="YYYY-MM-DD" disabledDate={classDateDisableFunc}/>
                      )}
                    </FormItem>
                    }

                    <FormItem
                          {...formItemLayout}
                          label="排课类型"
                    >
                    {getFieldDecorator('type', {
                        initialValue: formData.type || '2',
                        rules: [
                            {required: true, message: '请选择排课类型',},
                        ],
                      })(
                        <Select placeholder="请选择排课类型" allowClear style={{width: '100%'}}>
                            <Option value="1">试听</Option>
                            <Option value="2">班课</Option>
                            <Option value="3">补课</Option>
                        </Select>
                      )}
                    </FormItem>

                   {!!(getFieldValue('type') == '2') &&
                    <FormItem
                          {...formItemLayout}
                          label="班级"
                    >
                    {getFieldDecorator('classId', {
                        initialValue: formData.clsId,
                        rules: [
                            {required: (getFieldValue('type') == '2'), message: '请选择班级',},
                        ],
                      })(
                        <Select placeholder="请选择班级" showSearch optionFilterProp="children" allowClear style={{width: '100%'}} onSelect={classChange} notFoundContent='没有班级'>
                            {classComList && classComList.map(function(item) {
                                return (<Option key={item.clsId+''} value={item.clsId+''} courseId={item.courseId+''}>{item.clsName}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>
                    }

                    {!!(getFieldValue('type') == '1' || getFieldValue('type') == '3') &&
                    <FormItem
                          {...formItemLayout}
                          label="课程"
                    >
                    {getFieldDecorator('courseId', {
                        initialValue: formData.courseId,
                        rules: [
                            {required: (getFieldValue('type') == '1' || getFieldValue('type') == '3'), message: '请选择课程',},
                        ],
                      })(
                        <Select placeholder="请选择课程" allowClear style={{width: '100%'}} onChange={courseChange} notFoundContent='没有课程'>
                            {courseComList && courseComList.map(function(item) {
                                return (<Option key={item.id+''} value={item.id+''}>{item.title}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>
                    }

                    <FormItem
                          {...formItemLayout}
                          label="主教"
                    >
                    {getFieldDecorator('ptArr', {
                        initialValue: formData.ptArr ? formData.ptArr.split(',') : undefined,
                        rules: [
                            {required: true, message: '请选择主教',},
                        ],
                      })(
                        <Select
                           placeholder="请选择主教"
                           allowClear
                           showSearch
                           mode = 'multiple'
                           optionFilterProp="children"
                           notFoundContent="没有教师"
                           style={{width: '100%'}}>
                            {teacherComList && teacherComList.map(function(item) {
                                return (<Option key={item.userId+''} value={item.userId+''} disabled={isTeacherOptDisabled('atArr', item.userId+'')}>{item.userName}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>

                    <FormItem
                          {...formItemLayout}
                          label="助教"
                    >
                    {getFieldDecorator('atArr', {
                        initialValue: formData.atArr ? formData.atArr.split(',') : undefined,
                      })(
                        <Select
                           placeholder="请选择助教"
                           allowClear
                           showSearch
                           mode = 'multiple'
                           optionFilterProp="children"
                           notFoundContent="没有教师"
                           style={{width: '100%'}}>
                            {teacherComList && teacherComList.map(function(item) {
                                return (<Option key={item.userId+''} value={item.userId+''} disabled={isTeacherOptDisabled('ptArr', item.userId+'')}>{item.userName}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>


                    {!!(getFieldValue('type') == '2') &&
                    <FormItem
                          {...formItemLayout}
                          label="上课学员"
                    >
                    {getFieldDecorator('normalStuArr', {
                        initialValue: classStuComArr,
                      })(
                        <Select
                           placeholder="请选择上课学员"
                           allowClear
                           showSearch
                           mode = 'multiple'
                           optionFilterProp="children"
                           notFoundContent="没有学员"
                           style={{width: '100%'}}>
                            {classStuComList && classStuComList.map(function(item) {
                                return (<Option key={item.stuId+''} value={item.stuId+''}>{item.stuName}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>
                    }

                    {!!(getFieldValue('type') == '3') && remedialStuRender}

                    {!!(getFieldValue('type') == '1') &&
                    <FormItem
                      {...formItemLayout}
                      label="试听学员"
                    >
                    {getFieldDecorator('auditionStuArr', {
                        initialValue: formData.auditionStuArr ? formData.auditionStuArr.split(',') : undefined,
                        rules: [
                            {required: (getFieldValue('type') == '1'), message: '请选择试听学员',},
                        ],
                      })(
                        <Select
                           placeholder="请选择试听学员"
                           allowClear
                           showSearch
                           mode = 'multiple'
                           optionFilterProp="children"
                           notFoundContent="没有学员"
                           style={{width: '100%'}}>
                            {allStuComList && allStuComList.map(function(item) {
                                return (<Option key={item.stuId+''} value={item.stuId+''}>{item.stuName}</Option>);
                            })}
                        </Select>
                      )}
                    </FormItem>
                    }

                    <FormItem
                      {...formItemLayout}
                      label={getFieldValue('type') == '1' ? '试听内容' : getFieldValue('type') == '2' ? '上课内容' : getFieldValue('type') == '3' ? '补课内容' : '上课内容'}
                    >
                    {getFieldDecorator('cpContent', {
                        initialValue: formData.cpContent,
                      })(
                        <Input type="textarea" placeholder={getFieldValue('type') == '1' ? '请填写试听内容' : getFieldValue('type') == '2' ? '请填写上课内容' : getFieldValue('type') == '3' ? '请填写补课内容' : '请填写上课内容'} autosize={{ minRows: 2, maxRows: 6 }} />
                      )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="颜色"

                    >
                    {getFieldDecorator('color', {
                        initialValue: formData.color || '#1dafe4',
                      })(
                        <Popover content={scheduleColorPick} title={null} trigger="click" overlayClassName="common_schedule_form_color_pick">
                            <div className={styles.schedule_color_cont}
                                style={{backgroundColor: getFieldValue('color')}}
                            >可点击更改</div>
                        </Popover>
                      )}
                    </FormItem>

                </Form>
            </div>
        </Modal>

    );
}

export default Form.create()(ClassScheduleFormComponent);
