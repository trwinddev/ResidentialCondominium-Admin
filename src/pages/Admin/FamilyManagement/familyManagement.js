import {
    HomeOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import {
    BackTop, Breadcrumb,
    Form,
    Spin,
    Table
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../../apis/userApi";
import "./familyManagement.css";
import emergencyMaintenanceApi from '../../../apis/emergencyMaintenanceApi';
import { Link } from 'react-router-dom';

const FamilyManagement = () => {

    const [category, setCategory] = useState();
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Tên vợ/chồng',
            dataIndex: 'spouse_name',
            key: 'spouse_name',
        },
        {
            title: 'Con cái',
            dataIndex: 'children',
            key: 'children',
        },
        {
            title: 'Số phòng',
            dataIndex: 'rooms',
            key: 'rooms',
            render: (text) => {
                if(text){
                    const roomArray = text.split(', ');
                    const firstRoom = roomArray[0];
                    return <div>{firstRoom ? firstRoom : 'Chưa có phòng'}</div>;
                }
                return <div>{'Chưa có phòng'}</div>;
            },
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getAllPersonalInfo();
                const data = JSON.stringify(response);

                console.log(JSON.parse(data));
                setCategory(JSON.parse(data));
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch category list:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        })();
    }, []);


    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/dash-board">
                                    <HomeOutlined />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý hộ gia đình</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} childrenColumnName="antdChildren" pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default FamilyManagement;