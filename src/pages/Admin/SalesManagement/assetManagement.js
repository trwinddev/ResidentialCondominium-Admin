import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    BarcodeOutlined
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
    InputNumber,
    Card
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import assetEventApi from "../../../apis/assetEventHistoryApi";
import "./salesManagement.css";
import assetCategoryApi from '../../../apis/assetCategoryApi';
import assetManagementApi from '../../../apis/assetManagementApi';
import { Link } from 'react-router-dom';

const { Option } = Select;

const SalesManagement = () => {

    const [category, setCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [assetList, setAssetList] = useState();


    const showModal = () => {
        setOpenModalCreate(true);
        form.resetFields();
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "asset_id": values.asset_id,
                "event_type": values.event_type,
                "event_date": values.event_date.format("YYYY-MM-DD"),
                "description": values.description,
                "quantity": values.quantity,
            }

            if (values.event_type == "Mua") {
                return assetEventApi.purchaseEvent(categoryList).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description:
                                'Mua thiết bị thất bại',
                        });
                    }
                    else {
                        notification["success"]({
                            message: `Thông báo`,
                            description:
                                'Tạo mua bán thiết bị thành công',
                        });
                        setOpenModalCreate(false);
                        handleCategoryList();
                    }
                })
            } else {
                return assetEventApi.sellEvent(categoryList).then(response => {
                    console.log(response.message);
                    if (response.message == "Not enough assets to sell") {
                        notification["error"]({
                            message: `Thông báo`,
                            description:
                                'Số lượng thiết bị không đủ để bán',
                        });
                        setLoading(false);
                        return;
                    }
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description:
                                'Bán thiết bị thất bại',
                        });
                    }
                    else {
                        notification["success"]({
                            message: `Thông báo`,
                            description:
                                'Bán thiết bị thành công',
                        });
                        setOpenModalCreate(false);
                        handleCategoryList();
                    }
                })
            }

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
            await assetEventApi.listEvents().then((res) => {
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
            const res = await assetEventApi.searchEvent(name);
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
            title: 'Tên',
            dataIndex: 'asset_name',
            key: 'asset_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Loại',
            dataIndex: 'event_type',
            key: 'event_type',
            render: (text) => (text === 'purchase' ? 'Mua' : 'Bán'),
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: 'Ngày cập nhật',
            key: 'updated_at',
            dataIndex: 'updated_at',
            render: (text) => moment(text).format('DD-MM-YYYY'),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                await assetEventApi.listEvents().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await assetManagementApi.listAssetManagement().then((res) => {
                    console.log(res);
                    setAssetList(res.data);
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
                    <div style={{ marginTop: 20 }} className='header-sales-container'>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <BarcodeOutlined />
                                <span>Quản lý mua bán thiết bị</span>
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
                                            placeholder="Tìm kiếm theo mô tả"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo mua bán thiết bị</Button>

                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 20}}>
                        <div id="account">
                            <div id="account_container">
                                <Card title="Danh sách mua bán thiết bị" bordered={false} >
                                    <Table columns={columns} dataSource={category} pagination={{ position: ['bottomCenter'] }}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>


                <Modal
                    title="Tạo mua bán thiết bị"
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
                                {assetList?.map(asset => (
                                    <Option key={asset.id} value={asset.id}>
                                        {asset.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="event_type"
                            label="Loại sự kiện"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại sự kiện',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn loại sự kiện">
                                <Option value="Mua">Mua</Option>
                                <Option value="Bán">Bán</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="event_date"
                            label="Ngày sự kiện"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn ngày sự kiện',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Ngày sự kiện" format="DD-MM-YYYY" />
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
                            name="quantity"
                            label="Số lượng"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder="Số lượng" />
                        </Form.Item>

                    </Form>
                </Modal>


                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default SalesManagement;