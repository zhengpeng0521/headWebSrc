import React from 'react';
import { Popover } from 'antd';

module.exports = [
                            {
                                key: 'id',
                                title: '编号',
                                dataIndex: 'id',
                                width: 150,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'settAmount',
                                title: '提现金额',
                                dataIndex: 'settAmount',
                                width: 80,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'remitAmount',
                                title: '实际到账',
                                dataIndex: 'remitAmount',
                                width: 80,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'settFee',
                                title: '手续费',
                                dataIndex: 'settFee',
                                width: 80,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'payeeRealName',
                                title: '户名',
                                dataIndex: 'payeeRealName',
                                width: 80,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'payeeAccount',
                                title: '账号',
                                dataIndex: 'payeeAccount',
                                width:150,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'bankAddress',
                                title: '开户行',
                                dataIndex: 'bankAddress',
                                width:120,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'operator',
                                title: '操作人',
                                dataIndex: 'operator',
                                width:80,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'createTime',
                                title: '提交时间',
                                dataIndex: 'createTime',
                                width:180,
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },{
                                key: 'settStatus',
                                title: '状态',
                                dataIndex: 'settStatus',
                                render : (text,record) => (
                                    <Popover placement="top" content={text} trigger="hover">
                                        { text }
                                    </Popover>
                                )
                            },
                        ]
