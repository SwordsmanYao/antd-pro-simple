import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;

@connect(state => ({
  currentNode: state.menu.currentNode,
}))
@Form.create({
  onFieldsChange(props, changedFields) {
    console.log('onFieldsChange', changedFields);
    props.dispatch({
      type: 'menu/saveNode',
      payload: changedFields,
    });
  },
  mapPropsToFields(props) {
    console.log('mapPropsToFields', props.currentNode);
    return {
      name: Form.createFormField({
        ...props.currentNode.name,
      }),
      path: Form.createFormField({
        ...props.currentNode.path,
      }),
      icon: Form.createFormField({
        ...props.currentNode.icon,
      }),
    };
  },
  onValuesChange(_, values) {
    console.log(values);
  },
})
export default class BasicForms extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  }
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <Form
        onSubmit={this.handleSubmit}
        hideRequiredMark
        style={{ marginTop: 8 }}
      >
        <FormItem
          {...formItemLayout}
          label="名称"
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true, message: '请输入名称',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="路径"
        >
          {getFieldDecorator('path', {
            rules: [{
              required: true, message: '请输入路径',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="图标"
        >
          {getFieldDecorator('icon', {
            rules: [{
              required: true, message: '请输入图标',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }}>保存</Button>
        </FormItem>
      </Form>
    );
  }
}
