// import * as React from 'react';
// import * as PropTypes from 'prop-types';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
// import {Theme, WithStyles, withStyles} from '@material-ui/core/styles';
// import MenuIcon from '@material-ui/icons/Menu';
// import createStyles from "@material-ui/core/styles/createStyles";
// import {hls} from "../../../controllers/hls";
// import {ListDialog} from "./list_dialog";
// import {LoadPlaylistDialog} from "./load_playlist_dialog";
// import {ConfirmDialog} from "../../../ui/dialog/confirm";
//
//
// // const styles = (theme: Theme) =>
// //     createStyles({
// //         root: {
// //             width: '100%',
// //             color: "#fff"
// //         },
// //         toolbar:{
// //             backgroundColor: "#292929"
// //         },
// //         menuButton: {
// //             marginLeft: -12,
// //             marginRight: 20
// //         },
// //         title: {
// //             display: 'none',
// //             [theme.breakpoints.up('sm')]: {
// //                 display: 'block',
// //             },
// //         }
// //     });
//
// export interface Props extends WithStyles<any> {}
//
// class ToolBar extends React.Component<Props, {
//     search: string;
//     showMenu: boolean;
// }> {
//     constructor(props: Props) {
//         super(props);
//
//         this.state = {} as any
//     }
//
//     menuRef: any;
//
//     render(){
//         const { classes } = this.props;
//         const {search, showMenu} = this.state;
//
//         return [
//             <div className={classes.root}>
//                 <AppBar position="static">
//                     <Toolbar className={classes.toolbar}>
//                         <IconButton className={classes.menuButton}
//                                     color="inherit"
//                                     onClick={this.onToggleMenu}
//                                     aria-label="Open drawer"
//                                     buttonRef={(node) => this.menuRef = node}>
//                             <MenuIcon/>
//                         </IconButton>
//                     </Toolbar>
//                 </AppBar>
//             </div>
//         ]
//     }
//
//     onResetPlaylist = async () => {
//         const result = await ConfirmDialog.show({message: "Do you want to delete all channels?", title: "Reset playlist"});
//         if(!result){return};
//
//         hls.deleteData();
//     };
//
//     onToggleMenu = () => {
//         this.setState({
//             showMenu: !this.state.showMenu
//         })
//     };
//
//     onShowLoadPlaylist = async () => {
//         const playlist = await LoadPlaylistDialog.show();
//         if(playlist){
//             const selectedChannels = await ListDialog.show({ data: playlist});
//             if(selectedChannels){
//                 await hls.updateView(selectedChannels)
//             }
//         }
//     }
// }
//
//
// (ToolBar as any).propTypes = {
//     classes: PropTypes.object.isRequired,
// };
