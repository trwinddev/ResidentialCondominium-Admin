import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select,
    DatePicker,
    Card,
    Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import complaintApi from "../../../apis/complaintApi";
import "./complaintManagement.css";
import dayjs from 'dayjs';
import moment from 'moment';
import userApi from '../../../apis/userApi';
import { Link } from 'react-router-dom';

const { Option } = Select;

const ComplaintManagement = () => {

    const [category, setCategory] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [userList, setUserList] = useState();
    const [progress, setProgress] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
        form.resetFields();
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                created_by: userData.id,
                user_id: values.user_id,
                subject: values.subject,
                description: values.description,
                status: values.status,
                progress: values.progress || 0,
                assigned_to: values.assigned_to || "",
            };
            return complaintApi.createComplaint(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khiếu nại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khiếu nại thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                user_id: values.user_id,
                subject: values.subject,
                description: values.description,
                status: values.status,
                progress: values.progress || progress,
                assigned_to: values.assigned_to || JSON.parse(localStorage.getItem('user'))?.id,
            }
            console.log(categoryList)
            return complaintApi.updateComplaint(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khiếu nại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khiếu nại thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
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

            // if (userData.role == "isAdmin") {
                await complaintApi.listComplaints().then((res) => {
                    setCategory(res);
                    setLoading(false);
                });
            // } else {
            //     await complaintApi.listComplaints().then((res) => {
            //         console.log(res);

            //         // Filter complaints based on the created_by field
            //         const filteredComplaints = res.filter(complaint => complaint.created_by === userData.id);

            //         setCategory(filteredComplaints);
            //         setLoading(false);
            //     });
            // }
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await complaintApi.deleteComplaint(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khiếu nại thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khiếu nại thành công',

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
                const response = await complaintApi.getDetailComplaint(id);
                setId(id);
                setProgress(response.progress);
                if (response.status != "Đang chờ xử lý") {
                    setIsDisabled(true);
                }
                form2.setFieldsValue({
                    user_id: response.user_id,
                    subject: response.subject,
                    description: response.description,
                    status: response.status,
                    progress: response.progress,
                    assigned_to: response.assigned_to,
                });

                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await complaintApi.searchComplaint(name);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Chủ hộ khiếu nại',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Email',
            dataIndex: 'user_email',
            key: 'user_email',
        },
        {
            title: 'Chủ đề',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        // {
        //     title: 'Đánh giá',
        //     dataIndex: 'progress',
        //     key: 'progress',
        // },
        {
            title: 'Đảm nhiệm bởi',
            dataIndex: 'assigned_to',
            key: 'assigned_to',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div>
                    {(
                        <Row>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditCategory(record.id)}
                            >
                                {"Chỉnh sửa"}
                            </Button>
                            {/* <div style={{ marginLeft: 10 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn muốn xóa khiếu nại này không?"
                                    onConfirm={() => handleDeleteCategory(record.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >
                                        {"Delete"}
                                    </Button>
                                </Popconfirm>
                            </div> */}
                        </Row>
                    )}
                </div>
            ),
        },
    ];


    const columns2 = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Chủ hộ khiếu nại',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        // {
        //     title: 'Email',
        //     dataIndex: 'user_email',
        //     key: 'user_email',
        // },
        {
            title: 'Chủ đề',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                switch(status) {
                    case 'Đã xong':
                        color = 'green';
                        break;
                    case 'Đang xử lý':
                        color = 'orange';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{status}</Tag>;
            },
        },
        // {
        //     title: 'Đánh giá',
        //     dataIndex: 'progress',
        //     key: 'progress',
        // },
        {
            title: 'Đảm nhiệm bởi',
            dataIndex: 'assigned_to_name',
            key: 'assigned_to_name',
            render: (assigned_to_name) => assigned_to_name || '-'
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => {
                const isCompleted = record.status === 'Đã xong';

                return (
                    <div>
                        <Row>
                            {!isCompleted && (
                                <Button
                                    size="small"
                                    icon={<EditOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                    onClick={() => handleEditCategory(record.id)}
                                >
                                    {"Chỉnh sửa"}
                                </Button>
                            )}
                            <div style={{ marginLeft: 10 }}>
                                {!isCompleted && (
                                    <Popconfirm
                                        title="Are you sure to delete this complaint?"
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
                                )}
                            </div>
                        </Row>
                    </div>
                );
            },
        },
    ];

    const handleFilter2 = async (name) => {
        try {
            let res;
            console.log(name)
            // Fetch all complaints
            const allComplaints = await complaintApi.listComplaints();

            // Perform filtering based on the selected role
            if (name != "all") {
                res = allComplaints.filter(complaint => complaint.user_role == name);
            } else {
                // If the role is not 'resident', filter only by subject
                res = allComplaints;
            }

            setCategory(res);
        } catch (error) {
            console.log('Filtering complaints error:', error);
        }
    }

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    setUserList(res.data);
                    setLoading(false);
                });

                const createdById = response.user.id;

                const allComplaints = await complaintApi.listComplaints();

                // if (response.user.role == "isAdmin") {
                    setCategory(allComplaints);
                // }
                // else {
                //     const filteredComplaints = allComplaints.filter(complaint =>
                //         complaint.created_by === createdById
                //     );
                //     setCategory(filteredComplaints);
                // }

                handleFilter2("all");

                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, []);

    return (
        <div>
            <Spin spinning={loading}>
                <div className=''>
                    <div style={{ marginTop: 20 }} className='header-complaint-container'>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <CalendarOutlined style={{ color: 'rgba(0, 0, 0, 0.88)' }}/>
                                <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Quản lý khiếu nại</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14, paddingTop: 20, paddingBottom: 20 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo chủ đề"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Select
                                                    placeholder="Lọc theo quyền hạn"
                                                    style={{ width: 200, marginRight: 10 }}
                                                    onChange={(value) => {
                                                        handleFilter2(value);
                                                    }}
                                                    defaultValue="all"
                                                >
                                                    <Option value="all">Toàn bộ</Option>
                                                    <Option value="resident">Cư dân</Option>
                                                    <Option value="isReceptionist">Lễ tân</Option>
                                                    <Option value="isSecurity">Bảo vệ</Option>

                                                </Select>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khiếu nại</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    {userData?.role === "isAdmin" ?
                        <div style={{ marginTop: 20}}>
                        <div id="account">
                            <div id="account_container">
                                <Card title="Danh sách khiếu nại" bordered={false} >
                                    <Table columns={columns2} dataSource={category} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div> :
                    <div style={{ marginTop: 20}}>
                        <div id="account">
                            <div id="account_container">
                                <Card title="Danh sách khiếu nại" bordered={false} >
                                    <Table columns={columns2} dataSource={category} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                    }
                </div>

                <Modal
                    title="Tạo khiếu nại"
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
                            name="user_id"
                            label="Người khiếu nại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người khiếu nại',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người khiếu nại">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="subject"
                            label="Chủ đề"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chủ đề',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Chủ đề" />
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
                            {/* <Input placeholder="Mô tả" /> */}
                        </Form.Item>

                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa khiếu nại"
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
                            name="user_id"
                            label="Người khiếu nại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người khiếu nại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người khiếu nại" disabled={isDisabled || userData?.role !== "isAdmin"}>
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="subject"
                            label="Chủ đề"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chủ đề!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Chủ đề" disabled={isDisabled || userData?.role !== "isAdmin"} />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input.TextArea rows={4} placeholder="Mô tả" disabled={isDisabled || userData?.role !== "isAdmin"} />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái',
                                },
                            ]}
                            style={{ marginBottom: 10}}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value="Đang chờ xử lý">Đang chờ xử lý</Select.Option>
                                <Select.Option value="Đang xử lý">Đang xử lý</Select.Option>
                                <Select.Option value="Đã xong">Đã xong</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="assigned_to"
                            label="Người đảm nhiệm"
                            rules={[
                                // {
                                //     required: true,
                                //     message: 'Vui lòng chọn người đảm nhiệm',
                                // },
                            ]}
                            style={{ marginBottom: 10, display: userData?.role === 'isAdmin' ? 'block' : 'none' }}
                        >
                            {/* <Input placeholder="Người đảm nhiệm" /> */}
                            <Select placeholder="Chọn người đảm nhiệm">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.assigned_to_name}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ComplaintManagement;