import React from 'react'
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom'
import { api } from '../../../utils/api'
import { Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material'

const CompanyDetailsPage: React.FC = () => {
  const { id } = useParams()
  const [data, setData] = React.useState<any | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/companies/${id}`)
        setData(res.data)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [id])

  const onDelete = async () => {
    if (!confirm('حذف الشركة؟')) return
    try { await api.delete(`/companies/${id}`); navigate('/companies') } catch (e: any) { setError(e.message) }
  }

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>
  if (!data) return null

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>تفاصيل الشركة</Typography>
        <Stack spacing={1}>
          <Typography>الاسم: {data.name}</Typography>
          <Typography>العنوان: {data.address}</Typography>
          <Typography>المالك: {data.ownerName}</Typography>
          <Typography>الحالة: {data.isActive ? 'نشط' : 'غير نشط'}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" component={RouterLink} to={`/companies/${id}/edit`}>تعديل</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>حذف</Button>
          <Button variant="text" component={RouterLink} to={`/companies/${id}/seasons`}>مواسم الشركة</Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default CompanyDetailsPage