import {
    HomeOutlined,
    PlusOutlined,
    CommentOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Card,
    Popconfirm
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import meetingResidentsApi from "../../../../apis/meetingResidentsApi";
import "./recordResidentEvents.css";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const RecordResidentEvents = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

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
                "date": values.date.format("YYYY-MM-DD HH:mm:ss"),
                "description": values.description,
                "location": values.location,
                "role": "resident"
            };
            return meetingResidentsApi.createMeeting(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo sự kiện cư dân thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo sự kiện cư dân thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
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

    const handleCategoryList = async () => {
        try {
            await meetingResidentsApi.getAllMeetings().then((res) => {
                setCategory(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await meetingResidentsApi.deleteMeeting(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sự kiện cư dân thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sự kiện cư dân thành công',

                    });
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await meetingResidentsApi.getMeetingById(id);
                setId(id);
                form2.setFieldsValue({
                    title: response.title,
                    date: dayjs(response.date),
                    description: response.description,
                    location: response.location,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "title": values.title,
                "date": values.date.format("YYYY-MM-DD HH:mm:ss"),
                "description": values.description,
                "location": values.location,
            };
            return meetingResidentsApi.updateMeeting(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa sự kiện cư dân thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa sự kiện cư dân thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleFilter = async (name) => {
        try {
            const res = await meetingResidentsApi.searchMeetingsByTitle(name);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleViewOrder = (id) => {
        ;
        history.push(`/residence-event-details/${id}`);
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tổ chức',
            dataIndex: 'date',
            key: 'date',
            render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss'),
        },
        // {
        //     title: 'Hành động',
        //     key: 'action',
        //     render: (text, record) => (
        //         <div>
        //             <Row>
        //                 <Button
        //                     size="small"
        //                     icon={<EyeOutlined />}
        //                     style={{ width: 150, borderRadius: 15, height: 30 }}
        //                     onClick={() => handleViewOrder(record.id)}
        //                 >
        //                     Xem
        //                 </Button>
        //             </Row>
        //         </div>
        //     ),
        // },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >
                            {"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa sự kiện cư dân này?"
                                onConfirm={() => handleDeleteCategory(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >
                                    {"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];



    useEffect(() => {
        (async () => {
            try {
                await meetingResidentsApi.getAllMeetings().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className=''>
                    <div style={{ marginTop: 20 }} className='header-record-resident-events-container'>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <CommentOutlined style={{ color: 'rgba(0, 0, 0, 0.88)' }}/>
                                <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Sự kiện cư dân</span>
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
                                            placeholder="Tìm kiếm theo tên"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo sự kiện cư dân</Button>
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
                                <Card title="Danh sách sự kiện cư dân" bordered={false} >
                                    <Table columns={columns} dataSource={category} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    title="Tạo sự kiện cư dân"
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
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="date"
                            label="Ngày tổ chức"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày tổ chức',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} showTime format="DD-MM-YYYY HH:mm:ss" placeholder="Ngày tổ chức" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea rows={4} placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="location"
                            label="Địa điểm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa điểm',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa điểm" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa sự kiện cư dân"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
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
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="date"
                            label="Ngày tổ chức"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày tổ chức',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} showTime format="DD-MM-YYYY HH:mm:ss" placeholder="Ngày tổ chức" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: false,
                                    message: 'Vui lòng nhập mô tả',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea rows={4} placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="location"
                            label="Địa điểm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa điểm',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Địa điểm" />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default RecordResidentEvents;