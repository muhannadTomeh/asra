import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const UserEditPage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initial, setInitial] = React.useState<any | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/users/${id}`)
        setInitial(res.data)
      } catch (e: any) { setError(e.message) }
    })()
  }, [id])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initial || { userName: '', phoneNumber: '', isActive: true },
    validationSchema: Yup.object({
      userName: Yup.string().required('الاسم مطلوب'),
      phoneNumber: Yup.string().required('رقم الهاتف مطلوب')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        await api.put(`/users/${id}`, values)
        navigate(`/users/${id}`)
      } catch (e: any) { setError(e.message) } finally { setSubmitting(false) }
    }
  })

  if (!initial) return <Typography>جارٍ التحميل...</Typography>

  return (
    <Box maxWidth={520} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>تعديل المستخدم</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="الاسم" {...formik.getFieldProps('userName')} error={formik.touched.userName && Boolean(formik.errors.userName)} helperText={formik.touched.userName && formik.errors.userName} />
            <TextField label="رقم الهاتف" {...formik.getFieldProps('phoneNumber')} error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)} helperText={formik.touched.phoneNumber && formik.errors.phoneNumber} />
            <FormControlLabel control={<Checkbox checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} />} label="نشط" />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>حفظ</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default UserEditPage