import React from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../../utils/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

const RegisterPage: React.FC = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)

  const formik = useFormik({
    initialValues: { userName: '', phoneNumber: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      userName: Yup.string().required('الاسم مطلوب'),
      phoneNumber: Yup.string().required('رقم الهاتف مطلوب'),
      password: Yup.string().min(6, 'الحد الأدنى 6 أحرف').required('كلمة المرور مطلوبة'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'كلمتا المرور غير متطابقتين').required('تأكيد كلمة المرور مطلوب')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        await register(values.userName, values.phoneNumber, values.password)
        navigate('/')
      } catch (e: any) {
        setError(e.message || 'فشل إنشاء الحساب')
      } finally {
        setSubmitting(false)
      }
    }
  })

  return (
    <Box maxWidth={480} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>إنشاء حساب</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="الاسم" {...formik.getFieldProps('userName')} error={formik.touched.userName && Boolean(formik.errors.userName)} helperText={formik.touched.userName && formik.errors.userName} />
            <TextField label="رقم الهاتف" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
            <TextField label="كلمة المرور" type="password" {...formik.getFieldProps('password')} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
            <TextField label="تأكيد كلمة المرور" type="password" {...formik.getFieldProps('confirmPassword')} error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>إنشاء</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default RegisterPage