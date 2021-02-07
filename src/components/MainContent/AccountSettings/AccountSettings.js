import React, { useState } from 'react';
import * as passwordHash from 'password-hash'; // import npm pass https://www.npmjs.com/package/password-hash
import DOMPurify from 'dompurify';
import {
  Button, IconButton, Grid, Typography, makeStyles,
} from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CloseIcon from '@material-ui/icons/Close';
import axios from '../../../axios';
import UpdateUsernameForm from './UpdateUsernameForm/UpdateUsernameForm';
import UpdatePasswordForm from './UpdatePasswordForm/UpdatePasswordForm';

/*
This component is opened from the option menu and is loaded where the UserMessages would be. This is a parent component that
shows a list of settings to users and is responsible for show/hiding child components like updatePwdForm and UpdateUsernameForm.
*/
const AccountSettings = (props) => {
  const [isUpdatePwdFormShowing, setIsUpdatePwdFormShowing] = useState(false);
  const [isUpdateUsernameFormShowing, setIsUpdateUsernameFormShowing] = useState(false);

  const useStyles = makeStyles(theme => ({
    accountSettingsButton: {
      margin: '1rem',
    },
  }));

  const classes = useStyles();

  // checks if current password entered is equal to auth user pwd on db.
  const checkPasswordInput = async (checkPassword) => {
    // eslint-disable-next-line no-param-reassign
    checkPassword = DOMPurify.sanitize(checkPassword);
    // eslint-disable-next-line no-param-reassign
    checkPassword = checkPassword.replace(/[^\w^!?$]/g, '');
    try {
      let hashedPassword = await axios.get(`users/u${props.authUID}/password.json`)
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
      hashedPassword = hashedPassword.data;
      return passwordHash.verify(checkPassword, hashedPassword);
    } catch {
      return 300;
    }
  };

  const goToAccountSettingsHome = () => {
    setIsUpdateUsernameFormShowing(false);
    setIsUpdatePwdFormShowing(false);
  };

  // eslint-disable-next-line consistent-return
  const showBackBtn = () => {
    if (isUpdateUsernameFormShowing || isUpdatePwdFormShowing) {
      return (
        <IconButton
          aria-label="Go back to account settings"
          onClick={goToAccountSettingsHome}
          color="primary"
          style={{ float: 'right' }}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      );
    }
  };

  const showAccountSettingsForm = () => {
    if (isUpdateUsernameFormShowing) {
      return (
        <UpdateUsernameForm
          checkPasswordInput={checkPasswordInput}
          authUsername={props.authUsername}
          setAreSettingsShowing={props.setAreSettingsShowing}
          authUID={props.authUID}
          showHideCustomAlert={props.showHideCustomAlert}
        />
      );
    } if (isUpdatePwdFormShowing) {
      return (
        <UpdatePasswordForm
          checkPasswordInput={checkPasswordInput}
          setAreSettingsShowing={props.setAreSettingsShowing}
          authUID={props.authUID}
          showHideCustomAlert={props.showHideCustomAlert}
        />
      );
    }
    return (
      <>
        <Grid container spacing={1} alignItems="center" justify="center">
          <Grid item xs={6}>
            <Button
              fullWidth
              aria-label="open up a form where you can update your username"
              onClick={() => setIsUpdateUsernameFormShowing(true)}
              className={classes.accountSettingsButton}
              variant="outlined"
              color="secondary"
            >
              Update Username
            </Button>
            <Button
              fullWidth
              aria-label="open up a form where you can update your password"
              onClick={() => setIsUpdatePwdFormShowing(true)}
              className={classes.accountSettingsButton}
              variant="outlined"
              color="secondary"
            >
              Update Password
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <div role="menu">
      <Grid container justify="center" alignItems="center">
        {showBackBtn()}
        <IconButton
          aria-label="close account settings menu"
          onClick={() => props.setAreSettingsShowing(false)}
          color="primary"
          style={{ float: 'right' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h6"
          style={{ display: 'inline', float: 'left' }}
        >
          Account settings
        </Typography>
      </Grid>
      {showAccountSettingsForm()}
    </div>
  );
};

export default AccountSettings;
