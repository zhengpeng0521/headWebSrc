import React from 'react';
import styles from './MaintenanceComponent.less';
import { Link } from 'dva/router';
import {Table, Input, Popconfirm, Button, message} from 'antd';

function MaintenanceComponent ({

	callUpdataFunction,
	dicListSource,
	saveDataFunction,
	untreatedDicValue,
	dictValue,
	callbackSelectTitleFunction,
	selectTitleIndex,
	callbaseAddFunction,
	callbaceDelectFunction,

}) {

	let props = {
		dicListSource,
		callUpdataFunction,
	}

	const columns = [{
			title: '值',
			dataIndex: 'v',
			width: '40%',
			render: (text, record, index) => renderColumns(dictValue, index, text),
		},{
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
							editable ?
								(
								index == dictValue.length - 1
								?
								<span>
									<a onClick={() => add(index)} style={{fontSize: 14}}>新增</a>
								</span>
								:
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
								)
							:
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

	function cancel(index) {
		callbackSelectTitleFunction(selectTitleIndex);
	}

	//添加状态为0的数据
	function mergeValue(value, untreatedValue, index) {
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
		dictValue = mergeValue(dictValue, untreatedDicValue, index);
		callUpdataFunction({dictValue : dictValue});
  	}

	//删除数据
	function delect(index){
		dictValue[index].s = 0;
		dictValue = mergeValue(dictValue, untreatedDicValue, index);
		callbaceDelectFunction({value : dictValue, id : dicListSource[selectTitleIndex].id});
	}

	//添加数据
	function add(index) {
		if(dictValue[index].v != '' && dictValue[index].v != null && dictValue[index].v != undefined) {
			dictValue[index].editable = false;
			dictValue[index].k = `${index}`;
			dictValue = mergeValue(dictValue, untreatedDicValue, index);
			callbaseAddFunction({value : dictValue, id : dicListSource[selectTitleIndex].id});
		} else {
			message.warning('请填写内容');
		}
	}

  	function edit(index) {
		dictValue[index].editable =  !dictValue[index].editable;
		dictValue = mergeValue(dictValue, untreatedDicValue, index);
		callUpdataFunction({dictValue : dictValue});
  	}

  	function editDone(index) {
		if(dictValue[index].v != '' && dictValue[index].v != null && dictValue[index].v != undefined) {
			dictValue[index].editable =  !dictValue[index].editable;
			dictValue = mergeValue(dictValue, untreatedDicValue, index);
			saveDataFunction({id : dicListSource[selectTitleIndex].id, value : dictValue});
		} else {
			message.error('请填写内容');
		}
	}

	//保存当前点击的title索引
	function touchTitle(index) {
		callbackSelectTitleFunction(index);
	}

	const listName = dicListSource&&dicListSource.map((item, index) => {
		let stys = index == selectTitleIndex ? styles.listNameSelect : styles.listName;
		return 	<div key={index}>
					<div
						className={stys}
						onClick={() => touchTitle(index)}
					>
						{item.name}
					</div>
				</div>
	})

	return (
		<div className="system-dic-data-maintenance">
			<div className={styles.leftTitltDiv}>
				<p className={styles.blueMark}></p>
				<p className={styles.businessName}>业务名称</p>
			</div>
			<div className={styles.rightTitltDiv}>
				<p className={styles.blueMark}></p>
				<p className={styles.businessName}>业务参数</p>
			</div>
			<div className={styles.businessNameList}>
				{listName}
			</div>
			<Table
				bordered
				pagination={false}
				dataSource={dictValue || []}
				showHeader={false}
				columns={columns}
				className="table-base"
				style={{width: 'calc(70% - 60px)'}}
			/>
			
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
		<div>
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
						fontSize : 14,
					}}
				>
				  {value&&value.toString() || ' '}
				</div>
			}
		  </div>
	);
}

export default MaintenanceComponent;
