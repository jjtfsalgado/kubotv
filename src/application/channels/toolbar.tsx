import * as React from 'react';
import * as PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
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
            backgroundColor: "#121212"
        },
        grow: {
            flexGrow: 1,
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
        inputRoot:{
            color: "#fff"
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
                                value={search}
                                onChange={this.onSearch}
                            />
                        </div>
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

    onSearch = (ev: any) => {
        const value = ev.target.value;
        hls.search(value);

        this.setState({
            search: value
        })
    };

    onShowLoadPlaylist = async () => {
        const playlist = await LoadPlaylistDialog.show();
        if(playlist){
            const selectedChannels = await ListDialog.show({ data: playlist});
            if(selectedChannels){
                selectedChannels.forEach((i: any) => i["id"] = newGuid());
                await hls.updateView(selectedChannels)
            }
        }
    }
}


ToolBar.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(ToolBar);