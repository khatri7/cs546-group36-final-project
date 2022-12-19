import React from 'react';
import loaderCss from './loader.module.css';
import logo from './favicon.png';

function Loader() {
	return (
		<div className={loaderCss['loader-container']}>
			<img src={logo} alt="Open Glass" />
		</div>
	);
}

export default Loader;
