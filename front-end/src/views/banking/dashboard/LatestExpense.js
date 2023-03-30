import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { sortByTime } from 'utils/timeUtils';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const LatestExpense = () => {
    const theme = useTheme();
    let userInfo = useSelector((state) => state.user);
    let [latest, setLatest] = useState(() => {
        let latestExpense = 0;
        if (userInfo.expenseHistory.length > 0) {
            latestExpense = sortByTime(userInfo.expenseHistory)[userInfo.expenseHistory.length - 1].amount;
        }
        return latestExpense;
    });

    useEffect(() => {
        let latestExpense = 0;
        if (userInfo.expenseHistory.length > 0) {
            latestExpense = sortByTime(userInfo.expenseHistory)[userInfo.expenseHistory.length - 1].amount;
        }
        setLatest(latestExpense);
    }, [userInfo]);

    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                            <ListItemAvatar>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        backgroundColor: theme.palette.primary[800],
                                        color: '#fff'
                                    }}
                                >
                                    <TableChartOutlinedIcon fontSize="inherit" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        ${latest}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        Latest Expense
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>
        </>
    );
};

export default LatestExpense;
