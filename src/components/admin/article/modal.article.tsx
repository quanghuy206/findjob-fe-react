import { IArticles } from '@/types/backend';
import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FooterToolbar, ModalForm, ProCard, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Col, ConfigProvider, Form, message, notification, Row, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';

import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import { callCreateArticle, callUpdateArticle, callUploadSingleFile } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { useNavigate } from 'react-router-dom';
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit: (IArticles) | null;
    setDataInit: (v: any) => void;
}
interface IArticleForm {
    title: string;
    author: string;
    content: string;
    summary: string
}
interface IArticleLogo {
    name: string;
    uid: string;
}

const ModalArticle = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [animation, setAnimation] = useState<string>('open');

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [dataLogo, setDataLogo] = useState<IArticleLogo[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [valueContent, setValueContent] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id && dataInit?.content) {
            setValueContent(dataInit.content);
            form.setFieldsValue({
                ...dataInit
            })
        }
    }, [dataInit])


    const submitArticle = async (valuesForm: IArticleForm) => {
        const { title, author, content, summary } = valuesForm;

        if (dataLogo.length === 0) {
            message.error('Vui lòng upload ảnh Logo')
            return;
        }

        if (dataInit?._id) {
            //update
            const res = await callUpdateArticle(dataInit._id, title, author, summary, valueContent, dataLogo[0].name);
            if (res.data) {
                message.success("Cập nhật bài viết thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const res = await callCreateArticle(title, author, summary, valueContent, dataLogo[0].name);
            if (res.data) {
                message.success("Thêm mới bài viết thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }
    const handleReset = async () => {
        form.resetFields();
        setValueContent("");
        setDataInit(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))
        setOpenModal(false);
        setAnimation('open')
    }

    //set Quill
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
        ],
    }

    const handleRemoveFile = (file: any) => {
        setDataLogo([])
    }


    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "articles");
        if (res && res.data) {
            console.log("upload", res.data)
            setDataLogo([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        }
        else {
            if (onError) {
                setDataLogo([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };


    return (
        <>
            {
                openModal &&
                <>
                    <ModalForm
                        title={<>{dataInit?._id ? "Cập nhật Article" : "Tạo mới Article"}</>}
                        open={openModal}
                        modalProps={{
                            onCancel: () => { handleReset() },
                            afterClose: () => handleReset(),
                            destroyOnClose: true,
                            // width: isMobile ? "100%" : 900,
                            footer: null,
                            keyboard: false,
                            maskClosable: false,
                            className: `modal-company ${animation}`,
                            rootClassName: `modal-company-root ${animation}`
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitArticle}
                        initialValues={dataInit?._id ? dataInit : {}}
                        submitter={{
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                            }
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <ProFormText
                                    label="Tên Tiêu đề"
                                    name="title"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tiêu đề' }]}
                                    placeholder="Nhập tiêu đề"
                                />
                            </Col>
                            <Col span={24}>
                                <ProFormText
                                    label="Tên tác giả"
                                    name="author"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống tên tác giả' }]}
                                    placeholder="Nhập tên tác giả"
                                />
                            </Col>
                            <Col span={24}>
                                <ProFormText
                                    label="Tóm tắt nội dung"
                                    name="summary"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập tên tóm tắt nội dung"
                                />
                            </Col>
                            <Col span={16}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Ảnh Logo"
                                    name="logo"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng không bỏ trống Logo',
                                        validator: () => {
                                            if (dataLogo.length > 0) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider >
                                        <Upload
                                            name="logo"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileLogo}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) => handleRemoveFile(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id ?
                                                    [
                                                        {
                                                            uid: uuidv4(),
                                                            name: dataInit?.logo ?? "",
                                                            status: 'done',
                                                            url: `${import.meta.env.VITE_BACKEND_URL}/images/articles/${dataInit?.logo}`,
                                                        }
                                                    ] : []
                                            }

                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>


                            <ProCard
                                title="Miêu tả"
                                // subTitle="mô tả công ty"
                                headStyle={{ color: '#d81921' }}
                                style={{ marginBottom: 20 }}
                                headerBordered
                                size="small"
                                bordered
                            >
                                <Col span={24}>
                                    <ReactQuill
                                        modules={modules}
                                        theme="snow"
                                        value={valueContent}
                                        onChange={setValueContent}
                                    />
                                </Col>
                            </ProCard>
                        </Row>
                    </ModalForm>
                </>
            }
        </>
    )
}

export default ModalArticle