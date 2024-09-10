import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form } from 'antd';
import React from 'react';

export type UpdateFormProps = {
  onSubmit: (values: any) => Promise<void>;
  values: any;
  btn: any,
};
const LibUpdateForm: React.FC<UpdateFormProps> = (props: any) => {
  const [form] = Form.useForm();
  return (
    <DrawerForm
      title={props.values ? '编辑' : '添加'}
      form={form}
      preserve={false}
      trigger={
        props.btn
      }
      layout={'horizontal'}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (data) => {
        data.id = props.values?.id || 0;
        return props.onSubmit(data);
      }}
      width={"450px"}
    >
      <ProFormText
        name="name"
        labelCol={{ span: 4 }}
        label="名称"
        initialValue={props.values?.name || ''}
      />

      <ProFormTextArea
        name="desc"
        labelCol={{ span: 4 }}
        label="描述"
        initialValue={props.values?.desc || ''}
      />
      <ProFormSelect
        name={'type'}
        labelCol={{ span: 4 }}
        label={'使用场景'}
        initialValue={props.values && props.values.type}
        fieldProps={{
          onChange: (v) => {
            //console.log(v);
          }
        }}
        options={[
          { label: '评论', value: 0 },
          { label: '私信', value: 1 },
        ]} />
    </DrawerForm>
  );
};
export default LibUpdateForm;
