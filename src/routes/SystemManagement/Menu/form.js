import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

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
      Name: Form.createFormField({
        ...props.currentNode.Name,
      }),
      Path: Form.createFormField({
        ...props.currentNode.Path,
      }),
      IconName: Form.createFormField({
        ...props.currentNode.IconName,
      }),
      Description: Form.createFormField({
        ...props.currentNode.Description,
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
          {getFieldDecorator('Name', {
            rules: [{
              required: true, message: '请输入名称',
            }],
          })(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="路径"
        >
          {getFieldDecorator('Path', {
            rules: [{
              required: true, message: '请输入路径',
            }],
          })(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="图标"
        >
          {getFieldDecorator('IconName')(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="描述"
        >
          {getFieldDecorator('Description')(
            <TextArea autosize />,
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
