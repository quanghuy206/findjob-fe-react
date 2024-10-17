import ModalArticle from '@/components/admin/article/modal.article'
import DataTable from '@/components/client/data-table'
import Access from '@/components/share/access'
import { callDeleteArticle } from '@/config/api'
import { ALL_PERMISSIONS } from '@/config/permissions'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchArticle } from '@/redux/slice/articleSlide'
import { IArticles } from '@/types/backend'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { ActionType, ProColumns } from '@ant-design/pro-components'
import { Button, message, notification, Popconfirm, Space } from 'antd'
import dayjs from 'dayjs'
import queryString from 'query-string'
import React, { useRef, useState } from 'react'

const ArticlePage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IArticles | null>(null);

    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.article.isFetching);
    const meta = useAppSelector(state => state.article.meta);
    const articles = useAppSelector(state => state.article.result)
    const dispatch = useAppDispatch();


    const handleDeleteArticle = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteArticle(_id);
            if (res && res.data) {
                message.success('Xóa Article thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IArticles>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.current - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Id',
            dataIndex: '_id',
            width: 250,
            render: (text, record, index, action) => {
                return (
                    <span>
                        {record._id}
                    </span>
                )
            },
            hideInSearch: true,
            hidden: true
        },
        {
            title: 'Title',
            dataIndex: 'title',
            sorter: true,
            width: 350
        },
        {
            title: 'author',
            dataIndex: 'author',
            sorter: true,
            width: 300,
            hideInSearch: true,
        },
        {
            title: 'summary',
            dataIndex: 'summary',
            sorter: true,
            width: 300,
            hidden: true
        },

        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <Access
                        permission={ALL_PERMISSIONS.ARTICLES.UPDATE}
                        hideChildren
                    >

                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access>
                    <Access
                        permission={ALL_PERMISSIONS.ARTICLES.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa Article"}
                            description={"Bạn có chắc chắn muốn xóa Article này ?"}
                            onConfirm={() => handleDeleteArticle(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.title) clone.title = `/${clone.title}/i`;
        if (clone.author) clone.author = `/${clone.author}/i`;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.title) {
            sortBy = sort.title === 'ascend' ? "sort=title" : "sort=-title";
        }
        if (sort && sort.author) {
            sortBy = sort.author === 'ascend' ? "sort=author" : "sort=-author";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }
    return (
        <div>
            <Access permission={ALL_PERMISSIONS.ARTICLES.GET_PAGINATE}>
                <DataTable<IArticles>
                    actionRef={tableRef}
                    headerTitle="Danh sách bài viết"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={articles}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchArticle({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <Access
                                permission={ALL_PERMISSIONS.ARTICLES.CREATE}
                                hideChildren
                            >
                                <Button
                                    icon={<PlusOutlined />}
                                    type="primary"
                                    onClick={() => setOpenModal(true)}
                                >
                                    Thêm mới
                                </Button>
                            </Access>
                        );
                    }}
                />
            </Access>
            <ModalArticle
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div>
    )
}

export default ArticlePage