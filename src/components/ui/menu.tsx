import * as React from 'react';
import * as PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import {Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

const styles = (theme: Theme) => ({
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },
        },
    },
    primary: {},
    icon: {},
});

export interface Props extends WithStyles<typeof styles> {}

function ListItemComposition(props: Props) {
    const { classes } = props;

    return (
        <Paper>
            <MenuList>
                <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                        <SendIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Sent mail" />
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                        <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Drafts" />
                </MenuItem>
                <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Inbox" />
                </MenuItem>
            </MenuList>
        </Paper>
    );
}

ListItemComposition.propTypes = {
    classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(ListItemComposition);