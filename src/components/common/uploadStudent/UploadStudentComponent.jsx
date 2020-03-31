import React from 'react';
import { Upload, Steps, Tabs, Modal, Input, message, Button, Icon, Table, Radio, Checkbox } from 'antd';
import styles from './UploadStudentComponent.less';
import FieldsMapPage from '../../../pages/common/fields-map/FieldsMap';
import TenantOrgSelect from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
import { ProgressBar } from '../new-component/NewComponent';

const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;

function UploadStudentComponent ({

	dp,
	flag,
	showResult,
	showResultData,
	showModal,
	recordIndex,
	nextString,
	excelString,
	keyIndex,
	regexDic,
	sourceData,
	targetData,
    parentTargetData,
    importParent,
	selectCampusId,
	firstStepSuccess,
	secondStepSuccess,
	thirdStepSuccess,
	lastStepSuccess,
	previewData,
	currentId,
    Changecolor,
    uploadLoading,     //上传时加载状态

}) {

	const columns = [{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			render: text => <p>{text}</p>,
		}, {
			title: '性别',
			dataIndex: 'sex',
			key: 'sex',
			render: text => <p>{text}</p>,
		}, {
			title: '生日',
			dataIndex: 'birthday',
			key: 'birthday',
			render: text => <p>{text}</p>,
		}, {
			title: '昵称',
			dataIndex: 'nickname',
			key: 'nickname',
			render: text => <p>{text}</p>,
		}, {
			title: '联系方式',
			dataIndex: 'mobile',
			key: 'mobile',
			render: text => <p>{text}</p>,
		}, {
		 	title: '联系地址',
		  	dataIndex: 'conaddress',
		  	key: 'conaddress',
			render: text => <p>{text}</p>,
		}, {
			title: '学校地址',
			dataIndex: 'schaddress',
			key: 'schaddress',
			render: text => <p>{text}</p>,
		}, {
		  	title: '小区',
		  	dataIndex: 'community',
		  	key: 'community',
			render: text => <p>{text}</p>,
		}, {
			title: '负责人',
			dataIndex: 'seller',
			key: 'seller',
			render: text => <p>{text}</p>,
		}];

    if(importParent || flag) {
        columns.push({
            title: '家长姓名',
			dataIndex: 'parentName',
			key: 'parentName',
			render: text => <p>{text}</p>,
        });
        columns.push({
            title: '家长联系方式',
			dataIndex: 'parentMobile',
			key: 'parentMobile',
			render: text => <p>{text}</p>,
        });
        columns.push({
            title: '家长关系',
			dataIndex: 'parentRelation',
			key: 'parentRelation',
			render: text => <p>{text}</p>,
        });
    }

	//匹配处理
	function changeMapping(mappingArr) {

        let secondStepSuccess = false;//步骤二是否验证通过
        let flg_name = false;
        /*let flg_sex = false;*/
        let flg_parentName = false;
        let flg_parentMobile = false;
        let flg_parentRelation = false;

		let obj = {};
		mappingArr.length>0&&mappingArr.map((item, index) => {
			obj[item.target] = item.source;

            if(item.source == 'name' && item.target != undefined && item.target != '') {
                flg_name = true;
            }
            /*if(item.source == 'sex' && item.target != undefined && item.target != '') {
                flg_sex = true;
            }*/
            if(item.source == 'parentName' && item.target != undefined && item.target != '') {
                flg_parentName = true;
            }
            if(item.source == 'parentMobile' && item.target != undefined && item.target != '') {
                flg_parentMobile = true;
            }
            if(item.source == 'parentRelation' && item.target != undefined && item.target != '') {
                flg_parentRelation = true;
            }
		});

        if(importParent) {
            secondStepSuccess = flg_name /*&& flg_sex*/ && flg_parentName && flg_parentMobile && flg_parentRelation;
        } else {
            secondStepSuccess = flg_name /*&& flg_sex*/;
        }
		dp('updateState', {regexDic : obj, secondStepSuccess,});
	}

	//处理源数据
	let source = [];
	sourceData&&sourceData.length>0&&sourceData.map((item, index) => {
		let newObj = {
			key : String(index),
			label : item[index],
		};
		source.push(newObj);
	});

    function showTargetLabel(item) {
        let {key,value} = item;
        if(key == 'name') {
            return '姓名 (必填)';
        /*} else if(key == 'sex') {
            return '性别 (必填)';*/
        } else if(key == 'parentName') {
            return '家长姓名 (必填)';
        } else if(key == 'parentMobile') {
            return '家长联系方式 (必填)';
        } else if(key == 'parentRelation') {
            return '家长关系 (必填)';
        } else {
            return value||'未知字段';
        }
    }

	let target = [];
    if(importParent) {
        parentTargetData && parentTargetData.length > 0 && parentTargetData.map((item, index) => {
            let newObj = {
                key : item.key,
                label : showTargetLabel(item),
            };
            target.push(newObj);
        });
    } else {
        targetData&&targetData.length>0&&targetData.map((item, index) => {
            let newObj = {
                key : item.key,
                label : showTargetLabel(item),
            };
            target.push(newObj);
        });
    }

 	let props = {
		sourceList : target,
		targetList : source,
		maxHeight : '500px',
		onChange : changeMapping,
        sourceTitle: '闪闪表单',
        targetTitle: '未配对文件数据',
 	}


	let initParamter = {
		selectCampusId 		: (window._init_data.firstOrg).key,
		keyIndex			: undefined,
		flag 				: false,
		firstStepSuccess 	: false,
		secondStepSuccess 	: false,
		thirdStepSuccess 	: true,
		lastStepSuccess 	: false,
		sourceData 			: [],
		targetData 			: [],
		regexDic			: {},
		excelString			: '请上传文件',
	}
	//上传文件
	const uploadProps = {
		name	: 'file',
		action	: `${BASE_URL}/upload/uploadExcel`,
		accept 	: '.xlsx' || '.xls',
		data 	: {
			 orgId : selectCampusId,
		},
		showUploadList : false,
		onChange(info) {
			if(selectCampusId == undefined) {
				return message.error('请选择校区');
			}

			if (info.file.status !== 'uploading') {
				if(info.file.response.errorCode != 9000) {
					return message.error(info.file.response.errorMessage);
				}
    		}

			if (info.file.status === 'done') {
				let id = info&&info.fileList.length>0&&info.fileList[info.fileList.length - 1].response.id;			
			  	message.success(`上传成功,正在检测文件类型`);
				dp('updateState', {excelString : info.file.name, currentId: id});
				dp('isModelFile', {id : id});
			} else if (info.file.status === 'error') {
			  	message.error(`上传失败`);
			}
		},
	};

	//下载模板
	function downloadTemplate() {
		window.open(`${BASE_URL}/download/downloadStuInfoModel?type=1`)
	}

	function onClickUploadButton() {
		dp('updateState', {
            showModal : !showModal ,
            selectCampusId : (window._init_data.firstOrg).key
        });
	}

    /*更改是否同时导入家长*/
    function changeImportParent() {
        dp('changeImportParent');
    }

	function checkboxChange(e) {
		if(e.target.value) {
			dp('updateState', {keyIndex : e.target.value});
		} else {
			dp('updateState', {keyIndex : undefined});
		}
	}

	//下一步
	function next() {
		if(recordIndex + 1 == 1 && !flag) {
			dp('getSourceData', {id : currentId});
		}

		if(flag && recordIndex == 0) {
			recordIndex = 1;
		}

		if(recordIndex + 1 == 2) {
			dp('getTableData', {id : currentId, 'regex' : JSON.stringify(regexDic), flag : flag});
		}


		let title = recordIndex + 1 == 1 ? '确认配对' : recordIndex + 1 == 2 ? '下一步' : '确认';
        if(recordIndex + 1 == 4){
            dp('updateState', { recordIndex : 3 });
        }else{
            dp('updateState', { recordIndex : recordIndex + 1, nextString : title });
        }
		if(recordIndex == 3) {
			dp('uploadMappingData', {
				proMode : keyIndex, 
				regexValue : regexDic,
				id : currentId,
				flag : flag,
			});
		}

	}

	//上一步
	function previousStep() {
		if(flag && recordIndex == 2) {
			recordIndex = recordIndex = 1;
		}
		let title = recordIndex - 1 == 1 ? '确认配对' : '下一步';
		dp('updateState', {recordIndex : recordIndex - 1, nextString : title});
	}

	function uploadCancel() {
		dp('updateState', {
			showModal : !showModal,
			...initParamter
		});
	}

	function closeModal() {
		dp('updateState', {
			recordIndex : 0,
		   	nextString : '下一步',
			...initParamter
		});
	}

	function currentSelectCampus(id) {
		if(id != selectCampusId) {	
			dp('updateState', {
				selectCampusId : id, 
			   	excelString		: '请上传文件', 
			   	firstStepSuccess 	: false,
			});
		}
	}
			
	function resultOk() {
		dp('updateState', {
			showResult : !showResult,
			showResultData : {},
		});	
	}
			
	function resultCancel() {
		dp('updateState', {
			showResult : !showResult,
			showResultData : {},
		});
	}
			
	function uploadFailLog() {
		if(showResultData&&showResultData.logFileId) {
			window.open(`${BASE_URL}/download/downloadByFileSys?id=${showResultData.logFileId}`)
		}
	}

	let layoutOne = (
		<div className={styles.js_upload_div}>
			<TenantOrgSelect onChange={currentSelectCampus} width='280px' value={selectCampusId} />
			<div style={{marginTop : '20px'}}></div>
			<div style={{width : '280px', margin : 'auto'}}>
				<Input  placeholder="Basic usage"
						value={excelString}
						disabled={true}
						style={{
							float : 'left',
							width : '200px',
					    	border: '0px',
							borderRadius: '5px 0px 0px 5px',
							borderTop: '1px solid #d9d9d9',
							borderBottom: '1px solid #d9d9d9',
							borderLeft: '1px solid #d9d9d9',
							color : '#666',
						}}
					/>
				<Upload {...uploadProps}>
					<Button type="primary" style={{borderRadius : '0px 5px 5px 0px', float : 'left'}}>选择文件</Button>
				</Upload>
			</div>
			<p style={{marginTop : '10px'}}>您可以下载<a onClick={() => downloadTemplate()}>数据模板</a>来准备数据后上传，也可以上传添加自己的文件</p>
		</div>
	)
	   
	let layoutTwo = (
		<div>
			<string>请将您上传的文件信息与闪闪系统的信息进行匹配</string>
			<p className={styles.js_upload_two_p}>无配对的文件信息将不会导入系统</p>
			<div className={styles.check_import_parent}>
			    <Checkbox checked={importParent} onChange={changeImportParent}>同时导入家长信息</Checkbox>
			</div>
			{showModal ? <FieldsMapPage {...props} /> : ''}
		</div>
	)

	let layoutThree = (
		<div>
			<Table columns={columns} dataSource={previewData} bordered={true}/>
		</div>
	)
	
	const radioStyle = {
      	display: 'block',
      	height: '30px',
		lineHeight: '30px',
    };

	let layoutFour = (
		<div style={{marginBottom : '20px'}}>
            { uploadLoading ?
                <ProgressBar content = '学员导入中' height = '50px'/>
                :
                <div>
                    <p style={{paddingBottom : '10px'}}>请选择学员姓名重复时的处理方式</p>
                    <RadioGroup onChange={(e) => checkboxChange(e)} value={keyIndex}>
                        <Radio style={radioStyle} value={1}>全部导入，姓名重复的学员信息建立新的学员</Radio>
                        <Radio style={radioStyle} value={2}>全部导入，姓名重复的学员信息覆盖掉旧的学员信息</Radio>
                        <Radio style={radioStyle} value={3}>姓名重复的不导入，只导入不重复的</Radio>
                    </RadioGroup>
                </div>
            }
		</div>
	)

	let layouFooter = (
		<div>
			{recordIndex != 0 ? <Button type="default" onClick={() => previousStep()} style = {{ display : uploadLoading ? 'none' : 'inline-block' }}>上一步</Button> : ''}
			<Button
				type="primary"
				onClick={() => next()}
				disabled={
					recordIndex == 0 ? !firstStepSuccess :
					recordIndex == 1 ? !secondStepSuccess :
					recordIndex == 2 ? !thirdStepSuccess :
					recordIndex == 3 ? (keyIndex != undefined ? lastStepSuccess : true) : !lastStepSuccess
				}
			>
				{nextString}
			</Button>
		</div>
	)
	
	let resultFooter = (
		<div>
			<Button
				type="primary"
				onClick={() => resultOk()}
			>
				我知道了
			</Button>
		</div>
	)


	return (
		<div>
			<Button type="default" onClick={() => onClickUploadButton()} style = {{ marginRight : (!Changecolor ? '10px':'0')  , background : '#88C702' , border : '1px solid #88C702' , color : '#fff'}}>{!Changecolor ? '批量导入':'导入学员' }</Button>
			<Modal
				width={1000}
				title="导入学员"
				visible={showModal}
				onOk={() => next()}
				onCancel={() => uploadCancel()}
				maskClosable={false}
				footer={layouFooter}
				wrapClassName="js_upload_student_modal"
				afterClose={closeModal}
			>
				<div className={styles.js_upload_student_steps}>
					<Steps current={recordIndex}>
						<Step title="上传文件" />
						<Step title="信息配对" />
						<Step title="预览表格" />
						<Step title="导入数据" />
					</Steps>
				</div>

				<Tabs defaultActiveKey={String(recordIndex)} activeKey={String(recordIndex)}  size="small">
					<TabPane tab="" key="0">{layoutOne}</TabPane>
					<TabPane tab="" key="1">{layoutTwo}</TabPane>
					<TabPane tab="" key="2">{layoutThree}</TabPane>
					<TabPane tab="" key="3">{layoutFour}</TabPane>
				</Tabs>
			</Modal>
			<Modal
				width={500}
				title="导入完成"
				visible={showResult}
				onOk={() => resultOk()}
				onCancel={() => resultCancel()}
				maskClosable={false}
				footer={resultFooter}
				wrapClassName="js_upload_student_modal"
			>
				<p className={styles.js_upload_success_p}>{showResultData.sucNum}条导入成功</p>
				<p className={styles.js_upload_fail_p}>
                    <span style = {{ marginRight : parseFloat(showResultData.failNum) > 0 ? 5 : 0 }}>{showResultData.failNum}条导入失败</span>
                    { parseFloat(showResultData.failNum) > 0 ? <a onClick={() => uploadFailLog()}>下载失败日志</a> : null }
                </p>
			</Modal>
		</div>
    );
}

export default UploadStudentComponent;
