import React, { Fragment, useState } from 'react';
import styles from './ChatroomHeader.module.scss';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography, List, ListItem, ListItemText, FormControlLabel, Switch, Grid } from '@material-ui/core';
/*
User interface component that is located above the chatroom. 
this component displays the burger button, current Chat room name, 
and the toggle options button. It contains logics for showing/hiding the sidebar and the option menu.
*/
const ChatroomHeader = props => {
    const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(true);
    const [optionsMenuElements, setOptionsMenuElements] = useState(null);
    const [isAppLightTheme, setIsAppLightTheme] = useState(false);
    
    const toggleAppTheme = () => {
        if(isAppLightTheme) {
            document.documentElement.style.setProperty("--main-bg","#585d63");
            document.documentElement.style.setProperty("--main-text","white");
            document.documentElement.style.setProperty("--off-text","#f6f6f6");
            document.documentElement.style.setProperty("--light-accent-bg","#2C2F33");
            document.documentElement.style.setProperty("--dark-accent-bg","#23272A");
            document.documentElement.style.setProperty("--light-action","white");
            document.documentElement.style.setProperty("--dark-action","#d4d4d4");
        } else {
            document.documentElement.style.setProperty("--main-bg","white");
            document.documentElement.style.setProperty("--main-text","black");
            document.documentElement.style.setProperty("--off-text","#313639");
            document.documentElement.style.setProperty("--light-accent-bg","#F6F6F6");
            document.documentElement.style.setProperty("--dark-accent-bg","#e8e8e8");
            document.documentElement.style.setProperty("--light-action","#365F88");
            document.documentElement.style.setProperty("--dark-action","#05386B");
        }
    }
    
    //shows & hides the options menu. triggered by the three dots in the top right of the header
    const toggleOptionsMenu =  () => {
        if(isOptionsMenuOpen === true) {
            setOptionsMenuElements(
                <List role="menu" aria-label="option menu pop out" className={ styles.optionsMenu }>
                    {/* The switch has padding that we can't remove. So to make all the ListItems have equal space we added space to all ListItem except this one. */}
                    <ListItem role="menuitem" style={{padding: 0, margin: 0}} >
                        <FormControlLabel
                            label="Theme"
                            labelPlacement="start"
                            control={
                                <Switch
                                    aria-label="Switch to change theme color of Unanimity" 
                                    checked={isAppLightTheme}
                                    onChange={() => { setIsAppLightTheme(!isAppLightTheme);  setOptionsMenuElements(null)}}
                                    name="themColor"
                                    color="primary"
                                    margin="dense"
                                />
                            }                                                 
                        />                          
                    </ListItem>
                    <ListItem 
                        tabIndex="0" 
                        role="button"
                        aria-label="Logout of unanimity"
                        onClick={ () => { props.intentionalAndForcedUserLogout(true) }} 
                    >
                        <ListItemText>Logout</ListItemText>
                    </ListItem>
                    <ListItem 
                        role="menuitem"
                        aria-label="click this link to go to account settings"
                        onClick={() => { props.setAreSettingsShowing(!props.areSettingsShowing); setOptionsMenuElements(null); }}
                    >
                        <ListItemText>Account Settings</ListItemText>
                    </ListItem>                       
                </List>
            );          
        } else {
            setOptionsMenuElements(null);
        }
        setIsOptionsMenuOpen(!isOptionsMenuOpen);
    }

   /*
        changes the sidebar opener between a x and a burger( the three lines ) 
        dose not cause the sidebar to open and close. sidebar open and close is handled in messenger.js
    */
    const toggleSidebarButtonStyles = () => {
        if(props.isSidebarOpen) {
            //make the burger button a X
            return(
                <IconButton
                    tabIndex="0"  
                    onClick={ () => props.toggleSidebar() }           
                    aria-label="Close sidebar"
                    size="small"
                    className={styles.menu}
                >
                    <CloseIcon color="primary"/>
                </IconButton >
            );
        } else {
            //sidebar is closed show the burger (three lines) to open it.
            return(
                <IconButton
                    tabIndex="0"  
                    onClick={ () => props.toggleSidebar() }           
                    aria-label="Open sidebar"
                    size="small"
                    className={styles.menu}
                >
                    <MenuIcon color="primary"/>
                </IconButton >
            );
        }
    }

    toggleAppTheme();
    let burger = toggleSidebarButtonStyles();   
    return(
        <Fragment>
            <header className={ styles.header }>
            <Grid container justify="flex-start"  alignItems="center" >
                <Grid item xs={2} justify="flex-start">            
                        { burger }  
                </Grid>
                <Grid item xs={8} alignContent="center">
                    <Typography variant="h5">{ props.currentChatRoomName }</Typography>
                </Grid>
                <Grid item xs={2}>
                        <IconButton
                            tabIndex="0" 
                            className={ styles.options } 
                            onClick={ () => toggleOptionsMenu() }           
                            aria-label="Open options menu button"
                            aria-haspopup="true"
                            size="small"
                        >
                            <MoreVertIcon color="primary"/>
                        </IconButton >  
                </Grid>    
            </Grid> 
            </header> 
            { optionsMenuElements } 
        </Fragment>
    );
}

export default ChatroomHeader;