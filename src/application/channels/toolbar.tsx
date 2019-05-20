import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import {Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import createStyles from "@material-ui/core/styles/createStyles";
import {Popper} from "@material-ui/core";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from '@material-ui/icons/Settings';
import DraftsIcon from '@material-ui/icons/Drafts';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import {hls} from "../../controllers/hls";
import {ListDialog} from "./list_dialog";
import {LoadPlaylistDialog} from "./load_playlist_dialog";


const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing.unit,
                width: 'auto',
            },
        },
        searchIcon: {
            width: theme.spacing.unit * 9,
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
            width: '100%',
        },
        inputInput: {
            paddingTop: theme.spacing.unit,
            paddingRight: theme.spacing.unit,
            paddingBottom: theme.spacing.unit,
            paddingLeft: theme.spacing.unit * 10,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: 120,
                '&:focus': {
                    width: 200,
                },
            },
        },
    });

export interface Props extends WithStyles<typeof styles> {}

export class ToolBar extends React.Component<Props, {
    showMenu: boolean;
}> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showMenu: false,
            showPlaylistDialog: false
        } as any
    }

    menuRef: any;

    render(){
        const { classes } = this.props;
        const {showMenu} = this.state;

        return [
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
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
                                    id="menu-list-grow"
                                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={this.onToggleMenu}>
                                        <MenuList>
                                            <MenuItem onClick={this.onShowLoadPlaylist}>
                                                <ListItemIcon>
                                                    <CloudUpload />
                                                </ListItemIcon>
                                                <ListItemText inset primary="Load" />
                                            </MenuItem>
                                            <MenuItem>
                                                <ListItemIcon>
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText inset primary="Settings" />
                                            </MenuItem>
                                        </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                            Playlist
                        </Typography>
                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        ]
    }

    onToggleMenu = () => {
        this.setState({
            showMenu: !this.state.showMenu
        })
    };

    onShowLoadPlaylist = async () => {
        const url = await LoadPlaylistDialog.show();
        if(url){
            const playlist = await hls.loadPlaylist(url);
            const selectedChannels = await ListDialog.show({ data: playlist});
            if(selectedChannels){
                await hls.updateView(selectedChannels)
            }
        }
    }
}


ToolBar.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(ToolBar);