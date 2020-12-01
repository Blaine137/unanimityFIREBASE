import React from "react";
import styles from "./AccountSettings.module.scss";
import UpdatePwdForm from './UpdatePwdForm/UpdatePwdForm';
import UpdateUsernameForm from './UpdateUsernameForm/UpdateUsernameForm';
import * as passwordHash from 'password-hash'; //import npm pass https://www.npmjs.com/package/password-hash
import DOMPurify from 'dompurify';
import axios from '../../../../axios';

/* 
	TODO: Add pwd confirm field to updatePwdform and change inputs to type of pwd
*/

const AccountSettings = props => {
	//checks if currrent password entered is equal to auth user pwd on db.
	const checkPwd = async checkPassword => {
		checkPassword = DOMPurify.sanitize(checkPassword);
		checkPassword = checkPassword.replace(/[^\w^!?$]/g,'');
		 try {
			 let hashedPassword = await axios.get('users/u' + props.authUID + '/password.json')
			 .catch(err => console.log(err));
			 hashedPassword = hashedPassword.data;
			 return passwordHash.verify(checkPassword, hashedPassword);   
		 } catch {
			 return 300;
		 }  
	}

	return(
		<div className={ styles.container }> 
			<button className={ styles.closeSettings } onClick={ () => props.setShowSettings(false) }>&times;</button>
			<h3 style={ { display: "inline" } }>Account settings</h3>
			<UpdatePwdForm checkPwd={ checkPwd } setShowSettings={ props.setShowSettings } authUID={ props.authUID }/>
			<UpdateUsernameForm checkPwd={ checkPwd } authUsername={ props.authUsername } setShowSettings={ props.setShowSettings } authUID={ props.authUID }/>
		</div>
	);
}

export default AccountSettings;