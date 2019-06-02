import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import {Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/Delete';
import createStyles from "@material-ui/core/styles/createStyles";
import CloudUpload from '@material-ui/icons/CloudUpload';
import {hls} from "../../controllers/hls";
import {ListDialog} from "./list_dialog";
import {LoadPlaylistDialog} from "./load_playlist_dialog";
import {newGuid} from "../../utils/function";
import {Popper} from "@material-ui/core";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {ConfirmDialog} from "../../components/dialog/confirm";


const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            color: "#fff"
        },
        toolbar:{
            backgroundColor: "#292929"
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        }
    });

export interface Props extends WithStyles<typeof styles> {}

export class ToolBar extends React.Component<Props, {
    search: string;
    showMenu: boolean;
}> {
    constructor(props: Props) {
        super(props);

        this.state = {} as any
    }

    menuRef: any;

    render(){
        const { classes } = this.props;
        const {search, showMenu} = this.state;

        return [
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.menuButton}
                                    color="inherit"
                                    onClick={this.onToggleMenu}
                                    aria-label="Open drawer"
                                    buttonRef={(node) => this.menuRef = node}>
                            <MenuIcon/>
                        </IconButton>
                        <Popper open={showMenu} anchorEl={this.menuRef} transition>
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                                    <Paper>
                                        <ClickAwayListener onClickAway={this.onToggleMenu}>
                                        <MenuList>
                                            <MenuItem onClick={this.onShowLoadPlaylist}>
                                                <ListItemIcon>
                                                    <CloudUpload />
                                                </ListItemIcon>
                                                <ListItemText inset primary="Load" />
                                            </MenuItem>
                                            <MenuItem onClick={this.onResetPlaylist}>
                                                <ListItemIcon>
                                                    <DeleteIcon />
                                                </ListItemIcon>
                                                <ListItemText inset primary="Reset" />
                                            </MenuItem>
                                        </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Toolbar>
                </AppBar>
            </div>
        ]
    }

    onResetPlaylist = async () => {
        const result = await ConfirmDialog.show({message: "Do you want to delete all channels?", title: "Reset playlist"});
        if(!result){return};

        hls.deleteData()
    };

    onToggleMenu = () => {
        this.setState({
            showMenu: !this.state.showMenu
        })
    };

    onShowLoadPlaylist = async () => {
        const playlist = await LoadPlaylistDialog.show();
        if(playlist){
            const selectedChannels = await ListDialog.show({ data: playlist});
            if(selectedChannels){
                await hls.updateView(selectedChannels)
            }
        }
    }
}


(ToolBar as any).propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ToolBar);