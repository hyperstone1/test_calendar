import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const BtnModal = ({ type, className, onClick, isLoading, children }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <button type={type} onClick={onClick} className={className} disabled={isLoading}>
      {isLoading && type === 'submit' ? <Spin indicator={antIcon} /> : children}
      {/* {!isLoading && children} */}
    </button>
  );
};

export default BtnModal;
