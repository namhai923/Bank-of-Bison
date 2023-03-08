import { useState } from 'react';
// material-ui
import { Avatar, Button, CardActions, CardContent, Typography, Table, TablePagination } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// project imports
import MainCard from 'ui-component/cards/MainCard';
// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import BasicModal from './FilterModal';
import { useSelector } from 'react-redux';
import createData from 'helper/createData';
// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = () => {
    let userInfo = useSelector((state) => state.user);

    const rows = [];
    const AddData = () => {
        let expenseHistory = userInfo.expenseHistory;
        for (let i = 0; i < expenseHistory.length; i++) {
            rows.push(createData(expenseHistory[i].location, expenseHistory[i].date, expenseHistory[i].category, expenseHistory[i].amount));
        }
    };
    AddData();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    if (rows.length == 0) {
        return (
            <Typography variant="h2" align="center">
                Your Expenses Will Appear Here! Make Your First Transaction In Order To Show Display It Here
            </Typography>
        );
    } else {
        return (
            <>
                <MainCard content={false}>
                    <CardContent>
                        <BasicModal />
                        <TableContainer component={Paper}>
                            <Typography variant="h2" align="center">
                                Tracking Expense
                            </Typography>
                            <Table xs={12} aria-label="simple table">
                                {
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Transaction Id</TableCell>
                                            <TableCell align="left">Merchant</TableCell>
                                            <TableCell align="left">Date</TableCell>
                                            <TableCell align="left">Category</TableCell>
                                            <TableCell align="left">Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                }
                                <TableBody>
                                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                {row.transNumber}
                                            </TableCell>
                                            <TableCell align="left">{row.merchant}</TableCell>
                                            <TableCell align="left">{row.date}</TableCell>
                                            <TableCell align="left">{row.category}</TableCell>
                                            <TableCell align="left">{row.price}</TableCell>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '5px',
                                                    backgroundColor: row.background,
                                                    color: row.color,
                                                    ml: 2
                                                }}
                                            >
                                                <KeyboardArrowDownOutlinedIcon fontSize="small" color="inherit" />
                                            </Avatar>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </CardContent>
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View All
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            </>
        );
    }
};
export default PopularCard;
