import React from 'react'
import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField, Typography } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { api } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'

const CompanyCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const [error, setError] = React.useState<string | null>(null)

  const formik = useFormik({
    initialValues: { name: '', address: '', ownerPhoneNumber: '', isActive: true },
    validationSchema: Yup.object({
      name: Yup.string().required('الاسم مطلوب'),
      address: Yup.string().required('العنوان مطلوب'),
      ownerPhoneNumber: Yup.string().required('رقم هاتف المالك مطلوب')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setError(null)
      try {
        const { data } = await api.post('/companies', values)
        navigate(`/companies/${data.id}`)
      } catch (e: any) { setError(e.message) } finally { setSubmitting(false) }
    }
  })

  return (
    <Box maxWidth={600} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>شركة جديدة</Typography>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField label="الاسم" {...formik.getFieldProps('name')} error={formik.touched.name && Boolean(formik.errors.name)} helperText={formik.touched.name && formik.errors.name} />
            <TextField label="العنوان" {...formik.getFieldProps('address')} error={formik.touched.address && Boolean(formik.errors.address)} helperText={formik.touched.address && formik.errors.address} />
            <TextField label="رقم هاتف المالك" {...formik.getFieldProps('ownerPhoneNumber')} error={formik.touched.ownerPhoneNumber && Boolean(formik.errors.ownerPhoneNumber)} helperText={formik.touched.ownerPhoneNumber && formik.errors.ownerPhoneNumber} />
            <FormControlLabel control={<Checkbox checked={formik.values.isActive} onChange={(e) => formik.setFieldValue('isActive', e.target.checked)} />} label="نشطة" />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={formik.isSubmitting}>إنشاء</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  )
}

export default CompanyCreatePage