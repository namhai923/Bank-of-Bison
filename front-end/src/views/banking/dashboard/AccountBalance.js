import { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { MoreHoriz, AccountBalanceWallet, FileCopyTwoTone } from '@mui/icons-material';

//third-party
import { CopyToClipboard } from 'react-copy-to-clipboard';

// project imports
import MainCard from 'components/cards/MainCard';
import EarningIcon from 'assets/images/earning.svg';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

const AccountBalance = (props) => {
    let { accountBalance } = props;
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2.25 }}>
                    <Grid container direction="column">
                        <Grid item>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.secondary[800],
                                            mt: 1
                                        }}
                                    >
                                        <img src={EarningIcon} alt="Notification" />
                                    </Avatar>
                                </Grid>
                                <Grid item>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.mediumAvatar,
                                            backgroundColor: theme.palette.secondary.dark,
                                            color: theme.palette.secondary[200],
                                            zIndex: 1
                                        }}
                                        aria-controls="menu-earning-card"
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <MoreHoriz fontSize="inherit" />
                                    </Avatar>
                                    <Menu
                                        id="menu-earning-card"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                        variant="selectedMenu"
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right'
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right'
                                        }}
                                    >
                                        <CopyToClipboard text={localStorage.userInfo}>
                                            <MenuItem onClick={handleClose}>
                                                <FileCopyTwoTone sx={{ mr: 1.75 }} /> Copy Data
                                            </MenuItem>
                                        </CopyToClipboard>
                                    </Menu>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid container alignItems="center">
                                <Grid item>
                                    <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                        ${accountBalance.toFixed(2)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Avatar
                                        sx={{
                                            cursor: 'pointer',
                                            ...theme.typography.smallAvatar,
                                            backgroundColor: theme.palette.secondary[200],
                                            color: theme.palette.secondary.dark
                                        }}
                                    >
                                        <AccountBalanceWallet fontSize="inherit" />
                                    </Avatar>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item sx={{ mb: 1.25 }}>
                            <Typography
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    color: theme.palette.secondary[200]
                                }}
                            >
                                Account Balance
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </CardWrapper>
        </>
    );
};

AccountBalance.propTypes = {
    accountBalance: PropTypes.number
};

export default AccountBalance;
