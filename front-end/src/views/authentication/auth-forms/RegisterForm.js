import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput, useMediaQuery } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
const vSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(50).required('Email is required'),
    fname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('First Name is required'),
    lname: Yup.string()
        .max(50, 'Cannot have more than 50 characters')
        .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field ')
        .required('Last Name is required'),
    balance: Yup.number()
        .min(0, "Can't be negative")
        .max(100000, 'Too much, less than $100,000 please')
        .integer('Should be an integer')
        .required('Account balance is required')
});

const RegisterForm = (props) => {
    let { handleSubmit } = props;
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    fname: '',
                    lname: '',
                    balance: ''
                }}
                validationSchema={vSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.fname && errors.fname)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-fname-register">First Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-fname-register"
                                        type="text"
                                        value={values.fname}
                                        name="fname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.fname && errors.fname && <FormHelperText error>{errors.fname}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.lname && errors.lname)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-lname-register">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-lname-register"
                                        type="text"
                                        value={values.lname}
                                        name="lname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                    />
                                    {touched.lname && errors.lname && <FormHelperText error>{errors.lname}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth error={Boolean(touched.balance && errors.balance)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-balance-register">Account Balance</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-balance-register"
                                type="number"
                                value={values.balance}
                                name="balance"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.balance && errors.balance && <FormHelperText error>{errors.balance}</FormHelperText>}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    data-testid="signUpButton"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

RegisterForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
};

export default RegisterForm;
export { vSchema };
