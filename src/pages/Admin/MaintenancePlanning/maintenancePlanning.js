import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    BorderLeftOutlined
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
    DatePicker,
    Select,
    Card
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import maintenancePlanningApi from "../../../apis/maintenancePlansApi";
import "./maintenancePlanning.css";
import assetManagementApi from '../../../apis/assetManagementApi';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const { Option } = Select;


const MaintenancePlanning = () => {

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
            const startDate = values.start_date;
            const endDate = values.end_date;

            if (startDate && endDate && endDate.isBefore(startDate, 'day')) {
                notification["error"]({
                    message: 'Lỗi',
                    description: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
                });
                setLoading(false);

                return;
            }

            const categoryList = {
                "asset_id": values.asset_id,
                "plan_description": values.plan_description,
                "start_date": values.start_date.format("YYYY-MM-DD"),
                "end_date": values.end_date.format("YYYY-MM-DD"),
            };

            return maintenancePlanningApi.createMaintenancePlan(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo kế hoạch bảo trì thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo kế hoạch bảo trì thành công',
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
            const startDate = values.start_date;
            const endDate = values.end_date;

            if (startDate && endDate && endDate.isBefore(startDate, 'day')) {
                notification["error"]({
                    message: 'Lỗi',
                    description: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
                });
                setLoading(false);

                return;
            }

            const categoryList = {
                "asset_id": values.asset_id,
                "plan_description": values.plan_description,
                "start_date": values.start_date.format("YYYY-MM-DD"),
                "end_date": values.end_date.format("YYYY-MM-DD"),
            }
            return maintenancePlanningApi.updateMaintenancePlan(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa kế hoạch bảo trì thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa kế hoạch bảo trì thành công',
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
            await maintenancePlanningApi.getAllMaintenancePlans().then((res) => {
                setCategory(res.data);
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
            await maintenancePlanningApi.deleteMaintenancePlan(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                        "Không thể xóa vì nó đã được sử dụng trong một sự kiện hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa kế hoạch bảo trì thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa kế hoạch bảo trì thành công',

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
                const response = await maintenancePlanningApi.getDetailMaintenancePlan(id);
                setId(id);
                form2.setFieldsValue({
                    asset_id: response.data.asset_id,
                    plan_description: response.data.plan_description,
                    start_date: dayjs(response.data.start_date),
                    end_date: dayjs(response.data.end_date),
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
            const res = await maintenancePlanningApi.searchMaintenancePlans(name);
            setCategory(res.data);
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
            title: 'Tên thiết bị',
            dataIndex: 'asset_name',
            key: 'asset_name',
        },
        {
            title: 'Mô tả kế hoạch',
            dataIndex: 'plan_description',
            key: 'plan_description',
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
                                title="Bạn có chắc chắn xóa kế hoạch bảo trì này?"
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

    const [categoryList, setCategoryList] = useState([]);


    useEffect(() => {
        (async () => {
            try {
                await maintenancePlanningApi.getAllMaintenancePlans().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await assetManagementApi.listAssetManagement().then((res) => {
                    console.log(res);
                    setCategoryList(res.data);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div>
                    <div style={{ marginTop: 20 }} className='header-maintenance-container'>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <BorderLeftOutlined style={{ color: 'rgba(0, 0, 0, 0.88)' }}/>
                                <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Kế hoạch bảo trì</span>
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
                                            placeholder="Tìm kiếm theo tên thiết bị"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo kế hoạch bảo trì</Button>
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
                                <Card title="Danh sách kế hoạch bảo trì" bordered={false} >
                                    <Table columns={columns} dataSource={category} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    title="Tạo kế hoạch bảo trì mới"
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
                            name="asset_id"
                            label="Thiết bị"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thiết bị',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn thiết bị">
                                {categoryList?.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="plan_description"
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
                            name="start_date"
                            label="Ngày bắt đầu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Ngày bắt đầu" format="DD-MM-YYYY" />
                        </Form.Item>
                        <Form.Item
                            name="end_date"
                            label="Ngày kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Ngày kết thúc" format="DD-MM-YYYY" />
                        </Form.Item>
                    </Form>
                </Modal>


                <Modal
                    title="Chỉnh sửa kế hoạch bảo trì"
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
                            name="asset_id"
                            label="Thiết bị"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn thiết bị',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn thiết bị">
                                {categoryList?.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="plan_description"
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
                            name="start_date"
                            label="Ngày bắt đầu"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày bắt đầu',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD-MM-YYYY"
                                disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Form.Item>
                        <Form.Item
                            name="end_date"
                            label="Ngày kết thúc"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày kết thúc',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = getFieldValue('start_date');
                                        if (!startDate || !value || moment(value).isSameOrAfter(startDate, 'day')) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
                                    },
                                }),
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD-MM-YYYY"
                                disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default MaintenancePlanning;