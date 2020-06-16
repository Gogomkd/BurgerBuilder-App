import React from 'react';

import Logo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';

const logo = (props) => (
    <div className={classes.Logo}><img src={Logo} alt="error" />
    </div>
);

export default logo;