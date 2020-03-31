import React from 'react';
import styles from './MaintenanceComponent.less';
import { Link } from 'dva/router';
import {Table, Input, InputNumber ,Popconfirm, Button, message} from 'antd';

function MaintenanceComponent ({

	callUpdataFunction,
	dicListSource,
	saveDataFunction,
	untreatedDicValue,
	dictValue,
	callbackSelectTitleFunction,
    callbackSelectTitleCancelFunction,
	selectTitleIndex,
	callbaseAddFunction,
	callbaceDelectFunction,
	addStatus,
    showStatus,//赢率显示

}) {

	let props = {
		dicListSource,
		callUpdataFunction,
	}

	const columns = [{
			title: '值',
			dataIndex: 'v',
			width: '20%',
			render: (text, record, index) => renderColumns(dictValue, index, text),
		},

        {
			title: '赢率',
			dataIndex: 'r',
			width: '20%',
            visible :showStatus,
            render: (text, record, index) =>
            {
                return(
                        <div style={{height:'34px','lineHeight':'34px'}}>
                            { showStatus=='0' ?'':
                                <span>赢率&nbsp;&nbsp;{renderColumns1(dictValue, index, text)}&nbsp;%</span>
                            }
                        </div>
                    )
            },


		},
        {
			title: '操作',
			dataIndex: 'operation',
			width: '8%',
			colSpan: 1,
			className: 'tbTextAlign',
			render: (text, record, index) => {
				const { editable } = dictValue[index];

				return (

					<div className="editable-row-operations">
					{
							editable
							?
							<span>
								<a onClick={() => editDone(index)} style={{fontSize: 14}}>保存</a>
								&nbsp;&nbsp;&nbsp;
								<Popconfirm
									title="确定取消?"
									onConfirm={() => cancel(index)}
									placement="leftTop"
								>
									<a style={{fontSize: 14}}>取消</a>
								</Popconfirm>
							</span>
							:

                              <div>
                                 { record.mark&&record.mark?'':
                                    <span>

                                            <a onClick={() => edit(index)} style={{fontSize: 14}}>编辑</a>
                                                &nbsp;&nbsp;&nbsp;
                                            <Popconfirm
                                                title="确定删除?"
                                                onConfirm={() => delect(index)}
                                                placement="leftTop"
                                            >
                                                <a style={{fontSize: 14}}>删除</a>
                                            </Popconfirm>

                                    </span>
                                 }
                              </div>

					}
					</div>
				);
			},
		}];

  	function renderColumns(data, index, text) {
    	const { editable } = data[index];
		if (typeof editable === 'undefined') {
      		return text;
    	}
    	return (
			<EditableCell
      			editable={editable}
      			value={text}
      			onChange={(value) => handleChange(index, value)}
				index={index}
      			status={''}
				{...props}
    		/>
		);
  	}
	function renderColumns1(data, index, text) {
    	const { editable } = data[index];
		if (typeof editable === 'undefined') {
      		return text;
    	}

    	return (
			<EditableCell1
      			editable={editable}
      			value={text}
      			onChange={(value) => handleChange1(index, value)}
				index={index}
      			status={''}
				{...props}
    		/>
		);
  	}
	//添加状态为0的数据
	function mergeValue(value) {
		if(untreatedDicValue&&untreatedDicValue.length>0) {
			for(let val of untreatedDicValue) {
				let key = '';
				if(value.length > 0) {
					for(let idx in value) {
						key = value[idx].k;
					}
					if(key == val.k) {
						let timestamp = (new Date()).valueOf();
						val.k = String(timestamp);
					}
				}
				dictValue.unshift(val);
			}
		}
		return dictValue;
	}
	
	//输入是改变
	function handleChange(index, value) {
    	dictValue[index].v = value;
		dictValue = mergeValue(dictValue);
		callUpdataFunction({dictValue : dictValue});
  	}

    //输入是改变
	function handleChange1(index, value) {
    	dictValue[index].r = value;
		dictValue = mergeValue(dictValue);
		callUpdataFunction({dictValue : dictValue});
  	}


	//删除数据
	function delect(index){
		dictValue[index].s = 0;
		dictValue = mergeValue(dictValue);
		callbaceDelectFunction({value : dictValue, id : dicListSource[selectTitleIndex].id});
	}

	function cancel(index) {
		callbackSelectTitleCancelFunction(selectTitleIndex);
	}

	//添加数据
	function add() {
		//获取时间戳
		let timestamp = (new Date()).valueOf();
		let newObj = {
			s 			: 1,
			v 			: '',
            r           : '',
			k 			: String(timestamp),
			key 		: String(timestamp),
			editable 	: true,
		}
		dictValue = mergeValue(dictValue);
		dictValue.push(newObj);
		callUpdataFunction({addStatus : !addStatus, dictValue : dictValue});
	}


  	function edit(index) {
		dictValue[index].editable =  !dictValue[index].editable;
		dictValue = mergeValue(dictValue);
		callUpdataFunction({dictValue : dictValue});
  	}

  	function editDone(index) {
        if(showStatus=='0'){  //赢率不显示的列表
            if(dictValue[index].v=='微官网'){
                message.warning('来源名称不能为“微官网');
            }else if(dictValue[index].v.trim() != '' && dictValue[index].v != null && dictValue[index].v != undefined ) {
                dictValue[index].editable =  !dictValue[index].editable;
                dictValue = mergeValue(dictValue);
                saveDataFunction({id : dicListSource[selectTitleIndex].id, value : dictValue});
            }else if( dictValue[index].v.trim().length == 0 ){
				message.warning('内容不能为空')
			}
        }else{
            if(dictValue[index].v.trim() != '' && dictValue[index].v != null && dictValue[index].v != undefined &&
               dictValue[index].r != '' && dictValue[index].r != null && dictValue[index].r != undefined ) {
                dictValue[index].editable =  !dictValue[index].editable;
                dictValue = mergeValue(dictValue);
                saveDataFunction({id : dicListSource[selectTitleIndex].id, value : dictValue});
            }
            if(dictValue[index].v.trim() == '' || dictValue[index].v == null || dictValue[index].v == undefined){
                message.warning('内容不能为空');
            }
            if(dictValue[index].r == '' || dictValue[index].r == null || dictValue[index].r == undefined){
                message.warning('赢率必须大于0，小于等于100');
            }
        }

	}

	//保存当前点击的title索引
    let status='';
	function touchTitle(index,dictKey) {
        if(dictKey=='studentFollowState'){
            status='1'
        }else{
            status='0'
        }

		callbackSelectTitleFunction(index,status);
	}

	const listName = dicListSource&&dicListSource.map((item, index) => {
		let stys = index == selectTitleIndex ? styles.listNameSelect : styles.listName;

        let dictKey = item.dictKey;
        if(item.name!='学生来源'){
            return 	<div key={index}>
                        <div
                            className={stys}
                            onClick={() => touchTitle(index,dictKey)}
                        >
                            {item.name}
                        </div>
                    </div>
        }

	})

	return (
		<div className="system-dic-data-maintenance">
            <div className={styles.left_area}>
                <div className={styles.block_title}>业务名称</div>
                <div className={styles.businessNameList}>
                    { listName || [] }
                </div>
            </div>
            <div className={styles.right_area}>
                <div className={styles.block_title}>业务参数</div>
                <Table
                    pagination={false}
                    dataSource={dictValue || []}
                    showHeader={false}
                    columns={columns}
                    className="table-base"
                />
                <Button onClick={() => add()} disabled={addStatus} type="primary" style={{ float: 'right' }}>
                    新增
                </Button>
            </div>
		</div>
	)
}

function EditableCell ({
	editable,
	value,
	callUpdataFunction,
	dicListSource,
	onChange,

}) {

  	function handleChange(e) {
		onChange(e.target.value);
  	}

	return (
		<div style={{display:'inline-block'}}>
			{
			  editable ?
				<div>
				  <Input
					  value={value}
					  onChange={e => handleChange(e)}
				  />
				</div>
				:
				<div className="editable-row-text"
					style={{
						height: '30px',
						lineHeight: '30px',
						overflow: 'hidden',
						fontSize : '1.16rem',
                        paddingRight : '6px',
                        paddingTop  : '3px',
					}}
				>
				  {value&&value.toString() || ' '}
				</div>
			}
		  </div>
	);
}

function EditableCell1 ({
	editable,
	value,
	callUpdataFunction,
	dicListSource,
	onChange,

}) {

  	function handleChange1(value) {
		onChange(value);
  	}

	return (
		<div style={{display:'inline-block'}}>
			{
			  editable ?
				<div>
				  <InputNumber
					  value={value}
					  onChange={ handleChange1}
                      min={0}
                      max={100}
                      defaultValue={0}
				  />
				</div>
				:
				<div className="editable-row-text"
					style={{
						height: '34px',
						lineHeight: '34px',
						overflow: 'hidden',
						fontSize : 14,
                        paddingRight : '6px',
                        paddingTop:'10px',
					}}
				>
				  {value&&value.toString() || ' '}
				</div>
			}
		  </div>
	);
}

export default MaintenanceComponent;
