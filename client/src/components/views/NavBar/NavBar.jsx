import React, { useCallback, useState } from 'react'
import LeftMenu               from './sections/LeftMenu';
import RightMenu              from './sections/RightMenu';
import { Drawer, Button }     from 'antd'
import { AlignRightOutlined } from '@ant-design/icons';
import './sections/NavBar.css';

const NavBar = () => {

  const [visible, setVisible] = useState(false);

  const showDrawer = useCallback(() => {
	setVisible(true)
  }, [visible]);

  const onClose = useCallback(() => {
    setVisible(false);
  }, [visible]);

  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%', background: 'white' }}>
      <div className="menu__logo">
        <a href="/">Logo</a>
      </div>
      <div className="menu__container">
        <div className="menu_left" >
          <LeftMenu mode="horizontal" />
        </div>
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
         <AlignRightOutlined />
        </Button>
        <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          onClose={onClose}
          open={visible}
        >
          <LeftMenu mode="inline" />
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
};

export default NavBar;