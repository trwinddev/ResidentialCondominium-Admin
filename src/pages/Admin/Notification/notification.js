import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    AuditOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Table,
    Row,
    Space,
    Spin,
    Select,
    notification,
    DatePicker,
    Card
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../../apis/userApi";
import "./notification.css";
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Option } = Select;

const Visitors = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [selectedInput, setSelectedInput] = useState();
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [newsList, setNewsList] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
        form.resetFields();
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "title": values.title,
                "content": values.content,
                "role": values.role,
            };
            return userApi.sendNotification(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo thông báo thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo thông báo thành công',
                    });
                    setOpenModalCreate(false);
                    handleList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'created_at',
        //     key: 'created_at',
        //     render: (text) => moment(text).format('DD-MM-YYYY'),
        // },
    ];

    const handleList = () => {
        (async () => {
            try {

                await userApi.listNotification().then((res) => {
                    console.log(res);
                    setNewsList(res);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }

    const handleFilterName = async (name) => {
        try {
            const response = await userApi.searchNotificationByName(name);
            setNewsList(response.data);
        } catch (error) {
            console.log('search to fetch notification list:' + error);
        }
    }

    useEffect(() => {
        handleList();
    }, [])
    return (
        <div>
            <Spin spinning={false}>
                <div className=''>
                    <div style={{ marginTop: 20 }} className='header-notification-container'>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <AuditOutlined style={{ color: 'rgba(0, 0, 0, 0.88)' }}/>
                                <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Quản lý thông báo</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div id="account">
                        <div id="account_container">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14, paddingTop: 20, paddingBottom: 20 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm tên thông báo"
                                            allowClear
                                            style={{ width: 300 }}
                                            onChange={handleFilterName}
                                            value={selectedInput}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo thông báo</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 20}}>
                        <div id="account">
                            <div id="account_container">
                                <Card title="Danh sách thông báo" bordered={false} >
                                    <Table columns={columns} dataSource={newsList} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Modal
                            title="Tạo thông báo mới"
                            visible={openModalCreate}
                            style={{ top: 100 }}
                            onOk={() => {
                                form
                                    .validateFields()
                                    .then((values) => {
                                        form.resetFields();
                                        handleOkUser(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }}
                            onCancel={() => handleCancel("create")}
                            okText="Hoàn thành"
                            cancelText="Hủy"
                            width={600}
                        >
                            <Form
                                form={form}
                                name="eventCreate"
                                layout="vertical"
                                initialValues={{
                                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                                    prefix: '86',
                                }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tiêu đề',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Tiêu đề" />
                                </Form.Item>
                                <Form.Item
                                    name="content"
                                    label="Nội dung"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập nội dung',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Nội dung" />
                                </Form.Item>
                                <Form.Item
                                    name="role"
                                    label="Vai trò"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn vai trò',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Select placeholder="Chọn vai trò">
                                        <Option value="resident">Cư dân</Option>
                                        <Option value="isReceptionist">Lễ tân</Option>
                                        <Option value="isSecurity">Bảo vệ</Option>
                                        <Option value="isAdmin">Admin</Option>
                                    </Select>
                                </Form.Item>

                            </Form>
                        </Modal>
                    </div>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default Visitors;