import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    FileOutlined
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
import assetManagementApi from "../../../apis/assetManagementApi";
import "./assetReport.css";
import uploadFileApi from '../../../apis/uploadFileApi';
import { Link } from 'react-router-dom';

const { Option } = Select;

const AssetReport = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
        form.resetFields();
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "assetId": values.assetId,
                "reportDate": values.report_date.format("YYYY-MM-DD"),
                "reportDescription": values.report_description,
                "fileUrl": file
            }
            return assetManagementApi.createAssetReports(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo báo cáo thiết bị thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo báo cáo thiết bị thành công',
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
                "name": values.name,
                "description": values.description,
            }
            return assetManagementApi.updateAssetCategory(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa báo cáo thiết bị thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa báo cáo thiết bị thành công',
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
            await assetManagementApi.listAssetReports(1).then((res) => {
                setCategory(res.data);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }


    const handleFilter = async (name) => {
        try {
            const res = await assetManagementApi.searchAssetsByName(name);
            setCategory(res.data);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên thiết bị',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'report_description',
            key: 'report_description',
        },
        {
            title: 'File đính kèm',
            dataIndex: 'file_url',
            key: 'file_url',
            render: (attachment) => (
                <a href={attachment} target="_blank" rel="noopener noreferrer">
                    {"Xem file"}
                </a>
            ),
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
    ];

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                await assetManagementApi.listAssetReports(1).then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await assetManagementApi.listAssetManagement().then((res) => {
                    console.log(res);
                    setCategoryList(res.data);
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
                <div>
                    <div style={{ marginTop: 20 }} className='header-asset-container'>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <FileOutlined style={{ color: 'rgba(0, 0, 0, 0.88)' }}/>
                                <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Báo cáo thiết bị</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo báo cáo thiết bị</Button>
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
                                <Card title="Danh sách báo cáo thiết bị" bordered={false} >
                                    <Table columns={columns} dataSource={category} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    title="Tạo báo cáo thiết bị mới"
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
                        name="reportCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                name="assetId"
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
                                name="report_date"
                                label="Ngày báo cáo"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn ngày báo cáo',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker placeholder="Ngày báo cáo" format="DD-MM-YYYY" />
                            </Form.Item>
                            <Form.Item
                                name="report_description"
                                label="Mô tả báo cáo"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả báo cáo',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Mô tả báo cáo" />
                            </Form.Item>

                            <Form.Item
                                name="image"
                                label="Đính kèm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn đính kèm',
                                    },
                                ]}
                            >
                                <input
                                    type="file"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>

                    </Form>
                </Modal>


                <Modal
                    title="Chỉnh sửa báo cáo thiết bị"
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
                            name="name"
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
                            <Input placeholder="Mô tả" />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default AssetReport;