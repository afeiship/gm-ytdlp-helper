import { FloatButton } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface FloatButtonProps {
  onClick: () => void;
}

const AppFloatButton: React.FC<FloatButtonProps> = ({ onClick }) => {
  return (
    <FloatButton
      icon={<DownOutlined />}
      type="primary"
      onClick={onClick}
      style={{ right: 24, bottom: 24 }}
    />
  );
};

export default AppFloatButton;