import { callChangePassword } from '@/config/api';
import { Button, Form, Input, message, notification } from 'antd'
import { FormProps } from 'antd/lib';
import React from 'react'


interface FieldType {
    oldPassword?: string;
    newPassword?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { oldPassword, newPassword } = values
    const payload = {
        oldPassword,
        newPassword
    };
    const res = await callChangePassword(payload)
    if (res && res?.data) {
        message.success("Doi Mk thành công")
    }
    else {
        notification.error({
            message: 'Có lỗi xảy ra',
            description: res.message
        });
    }
};


const ChangePassword = () => {
    const [form] = Form.useForm();
    return (
        <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            form={form}
        >
            <Form.Item<FieldType>
                label="Mật khẩu hiện tại"
                name="oldPassword"
                rules={[{ required: true, message: 'vui lòng điền mật khẩu hiện tại' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: 'vui lòng điền mật khẩu mới' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button style={{ marginRight: 20 }} >
                    Hủy
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default ChangePassword