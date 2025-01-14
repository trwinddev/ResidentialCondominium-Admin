import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    FolderOpenTwoTone,
    HddTwoTone,
    HomeOutlined,
    NotificationTwoTone,
    ShopTwoTone,
    ShoppingTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Modal,
    Row,
    Spin,
    Tag,
    Typography,
    Table
} from 'antd';
import React, { useEffect, useState } from 'react';
import dashBoardApi from "../../apis/dashBoardApi";
import assetManagementApi from "../../apis/assetManagementApi";
import "./dashBoard.css";


const DashBoard = () => {
    const [order, setOrder] = useState([]);
    const [statisticList, setStatisticList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotalList] = useState();
    const [data, setData] = useState(null);
    const [category, setCategory] = useState([]);

    const [assetList, setAssetList] = useState([]);

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => {
                return Number(record.value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            },
        },
        {
            title: 'Vị trí',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        }
    ];

    useEffect(() => {
        (async () => {
            try {
                await assetManagementApi.listAssetManagement().then((res) => {
                    setAssetList(res.data);
                });
                await dashBoardApi.getAssetStatistics().then((res) => {
                    setTotalList(res)
                    setStatisticList(res);
                    setData(res.data.data);
                    setLoading(false);
                });

            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <div id='dashboard-layout'>
                <Spin spinning={false}>
                    <div>
                        <div style={{ marginTop: 20 }}>
                            <Breadcrumb>
                                {/* <Breadcrumb.Item href="">
                                    <HomeOutlined />
                                </Breadcrumb.Item> */}
                                <Breadcrumb.Item href="">
                                    <HomeOutlined style={{ color: 'rgba(0, 0, 0, 0.88)' }}/>
                                    <span style={{ color: 'rgba(0, 0, 0, 0.88)' }}>Trang chủ</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <Row gutter={12} style={{ marginTop: 20 }}>
                            <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>{statisticList?.userCount}</div>
                                            <div className='title_total'>Số thành viên</div>
                                        </div>
                                        <div>
                                            <ContactsTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>

                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>{statisticList?.roomCount}</div>
                                            <div className='title_total'>Số phòng</div>
                                        </div>
                                        <div>
                                            <ShopTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>
                                                {parseFloat(statisticList?.totalAssetsValue).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}
                                            </div>
                                            <div className='title_total'>Tổng giá trị thiết bị</div>
                                        </div>
                                        <div>
                                            <HddTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>

                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>{statisticList?.contractCount}</div>
                                            <div className='title_total'>Số hợp đồng</div>
                                        </div>
                                        <div>
                                            <ShoppingTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>

                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={12} style={{ marginTop: 20 }}>
                            <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>{statisticList?.eventHistoryCount}</div>
                                            <div className='title_total'>Lịch sử sự kiện</div>
                                        </div>
                                        <div>
                                            <NotificationTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>{statisticList?.customerCount}</div>
                                            <div className='title_total'>Số khách hàng</div>
                                        </div>
                                        <div>
                                            <FolderOpenTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            {/* <Col span={6}>
                                <Card className="card_total" bordered={false}>
                                    <div className='card_number'>
                                        <div>
                                            <div className='number_total'>{statisticList?.meetingParticipantsCount}</div>
                                            <div className='title_total'>Số người tham gia cuộc họp</div>
                                        </div>
                                        <div>
                                            <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                        </div>
                                    </div>
                                </Card>
                            </Col> */}
                        </Row>
                    </div>
                    <BackTop style={{ textAlign: 'right' }} />
                </Spin>
            </div>
            <div style={{ marginTop: 20}}>
                <div id="asset">
                    <div id="asset_container">
                        <Card title="Danh sách thiết bị sắp đến hạn bảo trì" bordered={false} >
                            <Table
                                columns={columns}
                                dataSource={assetList}
                                pagination={{ position: ['bottomCenter'] }}
                            />
                        </Card>
                            </div>
                        </div>
                    </div>
        </div>
    )
}

export default DashBoard;