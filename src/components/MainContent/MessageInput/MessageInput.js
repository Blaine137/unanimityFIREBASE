import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles, Button, Grid, Hidden } from '@material-ui/core';

let lastMessageSentTime = null;

/*
Child component of MainContent. Is a textarea where users enter their message to send.
Throttles message send rate to prevent spam.
*/
const MessageInput = (props) => {
  const [userMessage, setUserMessage] = useState('');

  const useStyles = makeStyles(theme => ({
    inputContainer: {
      width: 'calc(100% - 2rem)',
      padding: '.5rem',
      marginRight: '1rem',
      position: 'absolute',
      bottom: '1rem',
      left: '1rem',
      borderRadius: '15px',
      backgroundColor: theme.palette.background.default,
    },
    input: {
      border: `1px solid ${theme.palette.text.secondary}`,
      borderRadius: '15px',
      width: 'calc(100% - 2rem)',
      height: '1rem',
      padding: '1rem',
      transition: 'all .1s ease-in-out',
      fontSize: '1rem',
      '&:hover': { cursor: 'pointer' },
      '&:focus': {
        outline: 'none',
        transform: 'scale(1.05)',
      },
    },
    [theme.breakpoints.up('md')]: {
      inputContainer: {
        width: 'calc(100% - 5rem)',
        padding: '1rem',
        marginRight: '2rem',
        position: 'absolute',
        bottom: '2rem',
        left: '2rem',
      },
    },
  }));
  const classes = useStyles();

  return (
    <Grid spacing={1} container justify="center" alignItems="center" className={classes.inputContainer}>
      <Grid item xs={9} sm={10} md={11}>
        <textarea
          aria-label="Type a messages and press enter on the keyboard to send a message. You can also send emojis with :smile:."
          spellCheck="true"
          maxLength="1999"
          placeholder="Enter your message. Use our emojis by :smile:"
          className={classes.input}
          onChange={(e) => {
            setUserMessage(DOMPurify.sanitize(e.target.value));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (props.currentChatRoomName && props.currentChatRoomName !== 'Unanimity') {
                // if user has not sent a message yet, don't throttle message send rate.
                if (lastMessageSentTime === null) {
                  lastMessageSentTime = Date.now();
                  lastMessageSentTime -= 50000;
                }
                const currentTime = Date.now();
                if (currentTime >= (lastMessageSentTime + 2000)) {
                  lastMessageSentTime = currentTime;
                  props.newMessage(userMessage);
                  // makes the input box empty once newMessage gets the input
                  e.target.value = '';
                } else {
                  props.showHideCustomAlert(' Please wait two seconds before sending another message! ');
                }
              } else {
                props.showHideCustomAlert(' Please select a chatroom before sending a message! ');
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={3} sm={2} md={1}>
        <Button
          aria-label="Send new message"
          type="submit"
          value="Send"
          color="secondary"
          variant="contained"
          onClick={e => {
            if (props.currentChatRoomName && props.currentChatRoomName !== 'Unanimity') {
              // if user has not sent a message yet, don't throttle message send rate.
              if (lastMessageSentTime === null) {
                lastMessageSentTime = Date.now();
                lastMessageSentTime -= 50000;
              }
              const currentTime = Date.now();
              if (currentTime >= (lastMessageSentTime + 2000)) {
                lastMessageSentTime = currentTime;
                props.newMessage(userMessage);
                // makes the input box empty once newMessage gets the input
                e.target.value = '';
              } else {
                props.showHideCustomAlert(' Please wait two seconds before sending another message! ');
              }
            } else {
              props.showHideCustomAlert(' Please select a chatroom before sending a message! ');
            }
          }}
          disableElevation
        >
          <Hidden mdDown>SEND</Hidden>
          <SendIcon style={{ height: '1rem' }} />
        </Button>
      </Grid>
    </Grid>
  );
};

export default MessageInput;
